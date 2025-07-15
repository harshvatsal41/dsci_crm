import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import Blog from "@/Mongo/Model/DataModels/Blog";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import sanitizeInput from "@/Helper/sanitizeInput";
import path from "path";
import fs from "fs";
import { mkdir, writeFile } from "fs/promises";
import crypto from "crypto";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp",];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export async function POST(req) {
    try {
        await util.connectDB();

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

        const blog = await Blog.findOne({ yeaslyEventId: eventId });
        if (!blog) {
            return NextResponse.json(
                apiResponse({
                    message: "Blog not found",
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

        if (image) {
            const imageFile = image;
            const imageType = imageFile.type;
            const imageExtension = path.extname(imageFile.name).toLowerCase();

            if (!ALLOWED_IMAGE_TYPES.includes(imageType) || !ALLOWED_EXTENSIONS.includes(imageExtension)) {
                return NextResponse.json(
                    apiResponse({
                        message: "Invalid image type or extension",
                        statusCode: STATUS_CODES.BAD_REQUEST,
                    }),
                    { status: STATUS_CODES.BAD_REQUEST }
                );
            }

            const imageBuffer = await imageFile.arrayBuffer();
            const imageBufferArray = Array.from(new Uint8Array(imageBuffer));
            const imageHash = crypto.createHash("sha256").update(imageBufferArray).digest("hex");
            const imagePath = path.join("public", "images", `${event.year}`, "blogs", `${imageHash}${imageExtension}`);
            const imageFilePath = path.resolve(imagePath);

            try {
                await mkdir(path.dirname(imageFilePath), { recursive: true });
                await writeFile(imageFilePath, Buffer.from(imageBufferArray));
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

            blog.image = `/${event.year}/blogs/${imageHash}${imageExtension}`;
        }

        await blog.save();

        return NextResponse.json(
            apiResponse({
                message: "Blog updated successfully",
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