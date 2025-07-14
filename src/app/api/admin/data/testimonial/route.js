import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import Testimonial from "@/Mongo/Model/DataModels/Testimonial";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import sanitizeInput from "@/Helper/sanitizeInput";
import path from "path";
import fs from "fs";
import { mkdir } from "fs/promises";
import crypto from "crypto";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp",];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];


export async function GET(req) {
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

        const { searchParams } = new URL(req.url);
        const eventId = sanitizeInput(searchParams.get("eventId"));

        if (!eventId) {
            return NextResponse.json(
                apiResponse({
                    message: "Event ID is required",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        const filter = {
            isDeleted: false,
            status: "Active",
        };

        if (eventId) {
            filter.eventId = eventId;
        }

        const testimonials = await Testimonial.find(filter);

        return NextResponse.json(apiResponse({
            message: "Testimonials fetched successfully",
            data: testimonials,
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
        if (!decodedToken?.id) {
            return NextResponse.json(
                apiResponse({
                    message: "Unauthorized: Invalid or missing token",
                    statusCode: STATUS_CODES.UNAUTHORIZED,
                }),
                { status: STATUS_CODES.UNAUTHORIZED }
            );
        }

        const { searchParams } = new URL(req.url);
        const eventId = sanitizeInput(searchParams.get("eventId"));
        const event = await EventOutreach.findById(eventId);

        if (!eventId) {
            return NextResponse.json(
                apiResponse({
                    message: "Event ID is required",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        if (!event) {
            return NextResponse.json(apiResponse({
                message: "Event not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }


        const formData = await req.formData();
        const name = sanitizeInput(formData.get("name")?.toString().trim());
        const organization = sanitizeInput(formData.get("organization")?.toString().trim());
        const photo = formData.get("image");
        const body = sanitizeInput(formData.get("body")?.toString().trim());
        const description = sanitizeInput(formData.get("description")?.toString().trim());
        const email = sanitizeInput(formData.get("email")?.toString().trim());
        const contentWeight = sanitizeInput(formData.get("contentWeight")?.toString().trim());

        if (!name || !organization || !body || !description || !email || !contentWeight) {
            return NextResponse.json(
                apiResponse({
                    message: "Missing required fields",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }


        let imageUrlPath = "";
        if (photo && typeof photo !== 'string' && photo instanceof File) {

            if (!ALLOWED_IMAGE_TYPES.includes(photo.type)) {
                return NextResponse.json(
                    apiResponse({
                        message: "Invalid image MIME type",
                        statusCode: STATUS_CODES.BAD_REQUEST,
                    }),
                    { status: STATUS_CODES.BAD_REQUEST }
                );
            }

            if (!ALLOWED_EXTENSIONS.includes(path.extname(photo.name).slice(1).toLowerCase())) {
                return NextResponse.json(
                    apiResponse({
                        message: `Invalid image extension. Allowed extensions: ${ALLOWED_EXTENSIONS.join(", ")}`,
                        statusCode: STATUS_CODES.BAD_REQUEST,
                    }),
                    { status: STATUS_CODES.BAD_REQUEST }
                );
            }
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
            const folderPath = path.join(process.cwd(), "public", `${event.year}`, "testimonials");
            const randomId = crypto.randomBytes(8).toString("hex");
            const fileName = `${Date.now()}-${randomId}.${extension}`;
            const filePath = path.join(folderPath, fileName);
            const publicPath = `/${event.year}/testimonials/${fileName}`;

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

                imageUrlPath = publicPath;
            } catch (fileError) {
                // Clean up if file saving fails
                console.error("File save error:", fileError);
                throw new Error("Failed to save image file");
            }
        }

        const testimonial = new Testimonial({
            name,
            organization,
            imageUrlPath,
            body,
            description,
            email,
            contentWeight,
            status: "Active",
            eventId,
            createdBy: decodedToken.id,
        });

        await testimonial.save();

        await EventOutreach.findByIdAndUpdate(eventId, {
            $push: { testimonials: testimonial._id },
        }, { new: true });

        return NextResponse.json(apiResponse({
            message: "Testimonial created successfully",
            data: testimonial,
            statusCode: STATUS_CODES.CREATEDSUCCESS,
        }));
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}