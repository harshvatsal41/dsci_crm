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
import { mkdir } from "fs/promises";
import crypto from "crypto";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp",];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

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
        const blogId = sanitizeInput(searchParams.get("blogId"));
        const formData = await req.formData();
        const title = sanitizeInput(formData.get("title") || "").trim();
        const content = sanitizeInput(formData.get("content") || "").trim();
        const photo = formData.get("image");
        const externalLink = formData.get("externalLink");
        const updatedBy = decodedToken.id;
        const body = sanitizeInput(formData.get("body") || "").trim();
        const contentWeight = parseInt(formData.get("contentWeight") || "0");
        
        if (!title || !content || !externalLink || !body || !contentWeight) {
            return NextResponse.json(
                apiResponse({
                    message: "Missing required fields",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        const blog = await Blog.findOne({ _id: blogId });
        if (!blog) {
            return NextResponse.json(
                apiResponse({
                    message: "Blog not found",
                    statusCode: STATUS_CODES.NOT_FOUND,
                }),
                { status: STATUS_CODES.NOT_FOUND }
            );
        }

        const event = await EventOutreach.findById(blog.yeaslyEventId);
        
        if (!event) {
            return NextResponse.json(
                apiResponse({
                    message: "Event not found",
                    statusCode: STATUS_CODES.NOT_FOUND,
                }),
                { status: STATUS_CODES.NOT_FOUND }
            );
        }

        if (photo && typeof photo !== 'string' && photo instanceof File) {
            // Validate type and extension
            const extension = path.extname(photo.name).slice(1).toLowerCase();
            if (!ALLOWED_IMAGE_TYPES.includes(photo.type) || !ALLOWED_EXTENSIONS.includes(extension)) {
                return NextResponse.json(apiResponse({
                    message: `Invalid image type or extension`,
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }), { status: STATUS_CODES.BAD_REQUEST });
            }

            // Delete old photo
            if (blog.image) {
                const oldPath = path.join(process.cwd(), "public", blog.image);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            // Save new photo
            const folderPath = path.join(process.cwd(), "public", `${event.year}`, "blogs");
            const randomId = crypto.randomBytes(8).toString("hex");
            const fileName = `${Date.now()}-${randomId}.${extension}`;
            const filePath = path.join(folderPath, fileName);
            const publicPath = `/${event.year}/blogs/${fileName}`;

            await mkdir(folderPath, { recursive: true });
            const buffer = Buffer.from(await photo.arrayBuffer());
            const fileStream = fs.createWriteStream(filePath);

            await new Promise((resolve, reject) => {
                fileStream.write(buffer, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });

            blog.image = publicPath;
        }

        blog.title = title;
        blog.content = content;
        blog.externalLink = externalLink;
        blog.updatedBy = decodedToken.id;
        blog.body = body;
        blog.contentWeight = contentWeight;

        await blog.save();

        return NextResponse.json(
            apiResponse({
                message: "Blog updated successfully",
                data: blog,
                statusCode: STATUS_CODES.UPDATESUCCESS,
            }),
            { status: STATUS_CODES.UPDATESUCCESS }
        );
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