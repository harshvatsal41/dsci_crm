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
import sanitizeInput from "@/Helper/sanitizeInput";
import { uploadImage } from "@/utilities/MediaUpload";

const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp", "svg"];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp", "image/svg+xml"];

export async function GET(req) {
    try {
        await util.connectDB();
        const token = req.cookies.get("dsciAuthToken")?.value || req.headers.get("Authorization")?.split(" ")[1];

        const decodedToken = decodeTokenPayload(token);


        const { searchParams } = new URL(req.url);
        const eventId = sanitizeInput(searchParams.get("eventId"));

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
            status: STATUS_CODES.INTERNAL_ERROR,
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
        const name = sanitizeInput(formData.get("name")?.toString().trim());
        const description = sanitizeInput(formData.get("description")?.toString().trim());
        const eventId = sanitizeInput(formData.get("eventId")?.toString().trim());
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
        
        if (!name || !eventId || !createdBy) {
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
                apiResponse({ message: "Event not found", statusCode: STATUS_CODES.NOT_FOUND }),
                { status: STATUS_CODES.NOT_FOUND }
            );
        }

        const focusAreaDoc = await FocusArea.create({
            name,
            description,
            yeaslyEventId: eventId,
            createdBy,
        });

        await EventOutreach.findByIdAndUpdate(
            eventId,
            { $push: { focusAreaIds: focusAreaDoc._id } },
        );

        try {
            const { publicPath } = await uploadImage(image, `public/${event.year}/focusarea`, ALLOWED_IMAGE_TYPES, ALLOWED_EXTENSIONS);
            focusAreaDoc.imageUrlPath = publicPath;
            await focusAreaDoc.save();
        } catch (fileError) {
            // If image upload fails, clean up DB entry
            await FocusArea.deleteOne({ _id: focusAreaDoc._id });
            console.error("Image upload failed:", fileError);
            return NextResponse.json(
                apiResponse({
                    message: "Image upload failed",
                    statusCode: STATUS_CODES.INTERNAL_ERROR,
                }),
                { status: STATUS_CODES.INTERNAL_ERROR }
            );
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
            status: handledError.httpStatus || STATUS_CODES.INTERNAL_ERROR,
        });
    }
}
