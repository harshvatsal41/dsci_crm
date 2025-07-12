import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import FocusArea from "@/Mongo/Model/DataModels/FocusArea";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { handleError } from "@/Helper/errorHandler";
import { decodeTokenPayload } from "@/Helper/jwtValidator";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export async function GET(req) {
    try {
        await util.connectDB();
        const token = req.cookies.get("dsciAuthToken")?.value || req.headers.get("Authorization")?.split(" ")[1];

        const decodedToken = decodeTokenPayload(token);


        const { searchParams } = new URL(req.url);
        const eventId = searchParams.get("eventId");

        const filter = {
            isDeleted: false,
        };

        if (eventId) {
            filter.yeaslyEventId = eventId;
        }

        const focusAreas = await FocusArea.find(filter);

        return NextResponse.json(apiResponse({
            message: "Focus areas fetched successfully",
            data: focusAreas,
            statusCode: STATUS_CODES.OK,
        }));
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}

export async function POST(req) {
    try {
        await util.connectDB();

        const token = req.cookies.get("dsciAuthToken")?.value || req.headers.get("Authorization")?.split(" ")[1];
        const decodedToken = decodeTokenPayload(token);
        console.log("Decoded Token:", decodedToken);

        // ✅ Log and verify Content-Type before parsing formData
        const contentType = req.headers.get("content-type") || "";
        console.log("Incoming Content-Type:", contentType);
        if (!contentType.startsWith("multipart/form-data")) {
            return NextResponse.json(
                apiResponse({
                    message: "Content-Type must be multipart/form-data",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        let formData;
        try {
            formData = await req.formData();
        } catch (error) {
            console.error("FormData parsing error:", error);
            return NextResponse.json(
                apiResponse({
                    message: "Invalid form data format",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // 3. Process fields with better sanitization
        const name = (formData.get("name") || "").trim();
        const description = (formData.get("description") || "").trim();
        const eventId = formData.get("eventId");
        const createdBy = decodedToken?.id;
        const image = formData.get("image");

        if (!image || typeof image === "string" || !(image instanceof File) || !eventId || !createdBy || !name) {
            return NextResponse.json(
                apiResponse({
                    message: "Missing required fields or image must be a file",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // 5. Sanitize filename (especially for Mac screenshots)
        const originalFilename = image.name || "image";
        const sanitizedFilename = originalFilename
            .replace(/[^a-zA-Z0-9\-._]/g, "_") // Replace special chars
            .replace(/\s+/g, "_") // Replace spaces
            .replace(/_{2,}/g, "_") // Remove duplicate underscores
            .substring(0, 100); // Limit length

        // 6. Validate MIME type and extension
        const extension = path.extname(sanitizedFilename).slice(1).toLowerCase();

        // ✅ Validate MIME type
        if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
            return NextResponse.json(
                apiResponse({
                    message: "Invalid image MIME type",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // ✅ Validate file extension
        if (!ALLOWED_EXTENSIONS.includes(extension)) {
            return NextResponse.json(
                apiResponse({
                    message: `Invalid image extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(", ")}`,
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        const event = await EventOutreach.findById(eventId);
        if (!event) {
            return NextResponse.json(
                apiResponse({ message: "Event not found", statusCode: 404 }),
                { status: 404 }
            );
        }

        const focusAreaDoc = await FocusArea.create({
            name,
            description,
            yeaslyEventId: eventId,
            createdBy,
        });

        const folderPath = path.join(process.cwd(), "public", `${event.year}`, "focusarea");
        const randomId = crypto.randomBytes(8).toString("hex"); // e.g., "a4f8c1d2b3e4f5a6"
        const fileName = `${Date.now()}-${randomId}.${extension}`;
        const filePath = path.join(folderPath, fileName);
        const publicPath = `/${event.year}/focusarea/${fileName}`;

        try {
            await mkdir(folderPath, { recursive: true });
            
            // Use streams for better memory handling with large files
            const fileStream = fs.createWriteStream(filePath);
            const buffer = Buffer.from(await image.arrayBuffer());
            await new Promise((resolve, reject) => {
                fileStream.write(buffer, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });
            
            focusAreaDoc.imageUrlPath = publicPath;
            await focusAreaDoc.save();
        } catch (fileError) {
            // Clean up if file saving fails
            await FocusArea.deleteOne({ _id: focusAreaDoc._id });
            console.error("File save error:", fileError);
            throw new Error("Failed to save image file");
        }

        return NextResponse.json(
            apiResponse({
                message: "FocusArea created with image",
                data: focusAreaDoc,
                statusCode: STATUS_CODES.CREATED,
            }),
            { status: STATUS_CODES.CREATED }
        );
    } catch (error) {
        const handledError = handleError(error);
        return NextResponse.json(handledError, {
            status: handledError.httpStatus || 500,
        });
    }
}
