import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import Blog from "@/Mongo/Model/DataModels/Blog";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import sanitizeInput from "@/Helper/sanitizeInput";
import path from "path";
import fs from "fs";
import { mkdir, writeFile } from "fs/promises";
import crypto from "crypto";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp",];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];


export async function GET(req) {
    try {
        await util.connectDB();

        const { searchParams } = new URL(req.url);
        const eventId = sanitizeInput(searchParams.get("eventId"));

        const filter = {
            isDeleted: false,
        };

        if (eventId) {
            filter.yeaslyEventId = eventId;
        }

        const blogs = await Blog.find(filter);

        return NextResponse.json(apiResponse({
            message: "Blogs fetched successfully",
            data: blogs,
            statusCode: STATUS_CODES.OK,
        }));

    } catch (error) {
        console.error(error);
        return NextResponse.json(
            apiResponse({
                message: error.message || "Internal server error",
                httpStatus: error.statusCode || 500,
            })
        );
    }
}


export async function POST(req) {
    try {
        await util.connectDB();

        const token = req.cookies.get("dsciAuthToken")?.value || req.headers.get("Authorization")?.split(" ")[1];

        const decodedToken = decodeTokenPayload(token);
        if (!decodedToken?.id) {
            return NextResponse.json(
                apiResponse({
                    message: "Unauthorized: Invalid or missing token",
                    statusCode: STATUS_CODES.UNAUTHORIZED,
                }),
                { status: STATUS_CODES.UNAUTHORIZED }
            );
        }

        const user = await Employee.findById(decodedToken.id);
        if (!user) {
            return NextResponse.json(
                apiResponse({
                    message: "Unauthorized: User not found",
                    statusCode: STATUS_CODES.UNAUTHORIZED,
                }),
                { status: STATUS_CODES.UNAUTHORIZED }
            );
        }


        const { searchParams } = new URL(req.url);
        const eventId = sanitizeInput(searchParams.get("eventId"));
        const formData = await req.formData();
        const title = sanitizeInput(formData.get("title") || "").trim();
        const content = sanitizeInput(formData.get("content") || "").trim();
        const image = formData.get("image");
        const externalLink = formData.get("externalLink");
        const createdBy = decodedToken.id;
        const body = sanitizeInput(formData.get("body") || "").trim();
        const contentWeight = parseInt(formData.get("contentWeight") || "0");
        
        if (!title || !content || !image || !externalLink || !body || !contentWeight) {
            return NextResponse.json(
                apiResponse({
                    message: "Missing required fields",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        if(!eventId){
            return NextResponse.json(
                apiResponse({
                    message: "Event ID is required",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        const event = await EventOutreach.findById(eventId);
        if (!event) {
            return NextResponse.json(
                apiResponse({
                    message: "Event not found",
                    statusCode: STATUS_CODES.NOT_FOUND,
                }),
                { status: STATUS_CODES.NOT_FOUND }
            );
        }

        let imageUrl = "";
        if (image && typeof image !== 'string' && image instanceof File) {
            const originalFilename = image.name || "blog-image";
            const sanitizedFilename = originalFilename
                .replace(/[^a-zA-Z0-9\-._]/g, "_")
                .replace(/\s+/g, "_")
                .replace(/_{2,}/g, "_")
                .substring(0, 100);

            const extension = path.extname(sanitizedFilename).slice(1).toLowerCase();
            if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
                return NextResponse.json(
                    apiResponse({
                        message: "Invalid image MIME type",
                        statusCode: STATUS_CODES.BAD_REQUEST,
                    }),
                    { status: STATUS_CODES.BAD_REQUEST }
                );
            }

            if (!ALLOWED_EXTENSIONS.includes(extension)) {
                return NextResponse.json(
                    apiResponse({
                        message: `Invalid image extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(", ")}`,
                        statusCode: STATUS_CODES.BAD_REQUEST,
                    }),
                    { status: STATUS_CODES.BAD_REQUEST }
                );
            }

            const folderPath = path.join(process.cwd(), "public", `${event.year}`, "blogs");
            const randomId = crypto.randomBytes(8).toString("hex");
            const fileName = `${Date.now()}-${randomId}.${extension}`;
            const filePath = path.join(folderPath, fileName);
            const publicPath = `/${event.year}/blogs/${fileName}`;

            try {
                await mkdir(folderPath, { recursive: true });
                await writeFile(filePath, Buffer.from(await image.arrayBuffer()));
                imageUrl = publicPath;
            } catch (error) {
                console.error("Error saving image:", error);
                return NextResponse.json(
                    apiResponse({
                        message: "Failed to save image",
                        statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
                    }),
                    { status: STATUS_CODES.INTERNAL_SERVER_ERROR }
                );
            }
        }



        const blog = new Blog({
            title,
            content,
            image: imageUrl,
            externalLink,
            yeaslyEventId: eventId,
            createdBy,
            body,
            contentWeight,
        });

        await blog.save();

        await EventOutreach.findByIdAndUpdate(eventId, { $push: { blogs: blog._id } });
        return NextResponse.json(apiResponse({
            message: "Blog created successfully",
            data: blog,
            statusCode: STATUS_CODES.CREATED,
        }));
    } catch (error) {
        console.error(error);
        return NextResponse.json(
            apiResponse({
                message: error.message || "Internal server error",
                httpStatus: error.statusCode || 500,
            })
        );
    }
}