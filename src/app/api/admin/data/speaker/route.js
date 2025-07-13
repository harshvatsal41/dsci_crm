import { writeFile, mkdir } from "fs/promises";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { NextResponse } from "next/server";
import mongoose from "mongoose";
import Speaker from "@/Mongo/Model/DataModels/Speaker";
import util from "@/Helper/apiUtils";
import EventOutreach from '@/Mongo/Model/DataModels/yeaslyEvent';
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { handleError } from "@/Helper/errorHandler";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import sanitizeInput from "@/Helper/sanitizeInput";
        
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp",];
const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

// GET ALL Speakers
export async function GET(req) {
    try {
        await util.connectDB();

        const { searchParams } = new URL(req.url);
        const eventId = sanitizeInput(searchParams.get("eventId"));

        // Build query
        const query = {};
        if (eventId) query.yeaslyEventId = eventId;

        const speakers = await Speaker.find(query)
            .populate("yeaslyEventId", "title year")
            .populate("createdBy", "name email")
            .sort({ createdAt: -1 });

        return NextResponse.json(
            apiResponse(
                {
                    message: "Speakers fetched successfully",
                    data: speakers,
                    statusCode: STATUS_CODES.OK,
                }
            )
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


export async function POST(req) {
    try {
        await util.connectDB();

        // Authentication
        const token = req.cookies.get("dsciAuthToken")?.value || req.headers.get("Authorization")?.split(" ")[1];
        const decodedToken = decodeTokenPayload(token);
        if (!decodedToken?.id) {
            return NextResponse.json(
                apiResponse({
                    message: "Unauthorized",
                    statusCode: STATUS_CODES.UNAUTHORIZED,
                }),
                { status: STATUS_CODES.UNAUTHORIZED }
            );
        }

        // Content-Type validation
        const contentType = req.headers.get("content-type") || "";
        if (!contentType.startsWith("multipart/form-data")) {
            return NextResponse.json(
                apiResponse({
                    message: "Content-Type must be multipart/form-data",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // Parse form data
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

        // Extract and validate fields
        const name = sanitizeInput(formData.get("name") || "").trim();
        const title = sanitizeInput(formData.get("title") || "").trim();
        const organization = sanitizeInput(formData.get("organization") || "").trim();
        const position = sanitizeInput(formData.get("position") || "").trim();
        const bio = sanitizeInput(formData.get("bio") || "").trim();
        const experience = parseInt(formData.get("experience") || "0");
        const expertise = JSON.parse(formData.get("expertise") || "[]");
        const phone = sanitizeInput(formData.get("phone") || "").trim();
        const emailOfficial = sanitizeInput(formData.get("emailOfficial") || "").trim();
        const emailPersonal = sanitizeInput(formData.get("emailPersonal") || "").trim();
        const socialLinks = JSON.parse(formData.get("socialLinks") || "{}");
        const dob = sanitizeInput(formData.get("dob") || "").trim();
        const gender = sanitizeInput(formData.get("gender") || "").trim();
        const internalNote = sanitizeInput(formData.get("internalNote") || "").trim();
        const awards = JSON.parse(formData.get("awards") || "[]");
        const yeaslyEventId = sanitizeInput(formData.get("yeaslyEventId") || "").trim();
        const photo = formData.get("photo");
        const createdBy = decodedToken.id;

        // Validate required fields
        if (!name || !position || !bio || !expertise?.length || !phone || !emailOfficial || !yeaslyEventId) {
            return NextResponse.json(
                apiResponse({
                    message: "Missing required fields",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // Validate expertise is an array
        if (!Array.isArray(expertise)) {
            return NextResponse.json(
                apiResponse({
                    message: "Expertise must be an array",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // Validate event exists
        const event = await EventOutreach.findById(yeaslyEventId);
        if (!event) {
            return NextResponse.json(
                apiResponse({
                    message: "Event not found",
                    statusCode: STATUS_CODES.NOT_FOUND,
                }),
                { status: STATUS_CODES.NOT_FOUND }
            );
        }

        // Process photo if provided
        let photoUrl = "";
        if (photo && typeof photo !== 'string' && photo instanceof File) {
            // Sanitize filename
            const originalFilename = photo.name || "speaker-photo";
            const sanitizedFilename = originalFilename
                .replace(/[^a-zA-Z0-9\-._]/g, "_")
                .replace(/\s+/g, "_")
                .replace(/_{2,}/g, "_")
                .substring(0, 100);

            // Validate MIME type and extension
            const extension = path.extname(sanitizedFilename).slice(1).toLowerCase();
            if (!ALLOWED_IMAGE_TYPES.includes(photo.type)) {
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

            // Save photo to filesystem
            const folderPath = path.join(process.cwd(), "public", `${event.year}`, "speakers");
            const randomId = crypto.randomBytes(8).toString("hex");
            const fileName = `${Date.now()}-${randomId}.${extension}`;
            const filePath = path.join(folderPath, fileName);
            const publicPath = `/${event.year}/speakers/${fileName}`;

            try {
                await mkdir(folderPath, { recursive: true });

                // Use streams for better memory handling with large files
                const fileStream = fs.createWriteStream(filePath);
                const buffer = Buffer.from(await photo.arrayBuffer());
                await new Promise((resolve, reject) => {
                    fileStream.write(buffer, (error) => {
                        if (error) reject(error);
                        else resolve();
                    });
                });
                photoUrl = publicPath;
            } catch (fileError) {
                console.error("File save error:", fileError);
                return NextResponse.json(
                    apiResponse({
                        message: "Failed to save speaker photo",
                        statusCode: STATUS_CODES.INTERNAL_ERROR,
                    }),
                    { status: STATUS_CODES.INTERNAL_ERROR }
                );
            }
        }

        // Create speaker document
        const speakerData = {
            name,
            title,
            organization,
            position,
            bio,
            experience,
            expertise,
            phone,
            emailOfficial,
            emailPersonal,
            socialLinks,
            dob: dob ? new Date(dob) : undefined,
            gender,
            internalNote,
            awards,
            yeaslyEventId,
            createdBy,
            updatedBy: createdBy,
        };

        if (photoUrl) {
            speakerData.photoUrl = photoUrl;
        }

        const speaker = await Speaker.create(speakerData);

        // Update event with speaker reference
        await EventOutreach.findByIdAndUpdate(
            yeaslyEventId,
            { $push: { speakers: speaker._id } },
            { new: true }
        );

        return NextResponse.json(
            apiResponse({
                message: "Speaker created successfully",
                data: speaker,
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