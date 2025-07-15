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


export async function POST(req) {
    try {
        await util.connectDB();

        const token = req.cookies.get("dsciAuthToken")?.value || req.headers.get("Authorization")?.split(" ")[1];
        const decodedToken = decodeTokenPayload(token);


        const { searchParams } = new URL(req.url);
        const speakerId = sanitizeInput(searchParams.get("speakerId"));
        if (!speakerId) {
            return NextResponse.json(apiResponse({
                message: "speakerId is required",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        if (!decodedToken?.id) {
            return NextResponse.json(apiResponse({
                message: "Unauthorized",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        const contentType = req.headers.get("content-type") || "";
        if (!contentType.startsWith("multipart/form-data")) {
            return NextResponse.json(apiResponse({
                message: "Content-Type must be multipart/form-data",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        let formData;
        try {
            formData = await req.formData();
        } catch (error) {
            return NextResponse.json(apiResponse({
                message: "Invalid form data format",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        if (!speakerId) {
            return NextResponse.json(apiResponse({
                message: "Speaker ID is required for update",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        const speaker = await Speaker.findById(speakerId);
        if (!speaker) {
            return NextResponse.json(apiResponse({
                message: "Speaker not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        // Fields to update
        const fieldsToUpdate = {
            name: sanitizeInput(formData.get("name") || "").trim(),
            title: sanitizeInput(formData.get("title") || "").trim(),
            organization: sanitizeInput(formData.get("organization") || "").trim(),
            position: sanitizeInput(formData.get("position") || "").trim(),
            bio: sanitizeInput(formData.get("bio") || "").trim(),
            phone: sanitizeInput(formData.get("phone") || "").trim(),
            emailOfficial: sanitizeInput(formData.get("emailOfficial") || "").trim(),
            emailPersonal: sanitizeInput(formData.get("emailPersonal") || "").trim(),
            gender: sanitizeInput(formData.get("gender") || "").trim(),
            internalNote: sanitizeInput(formData.get("internalNote") || "").trim(),
            dob: sanitizeInput(formData.get("dob") || "").trim(),
            experience: parseInt(formData.get("experience") || "0"),
            yeaslyEventId: sanitizeInput(formData.get("yeaslyEventId") || "").trim(),
            updatedBy: decodedToken.id,
        };

        try {
            fieldsToUpdate.expertise = JSON.parse(formData.get("expertise") || "[]");
            fieldsToUpdate.socialLinks = JSON.parse(formData.get("socialLinks") || "{}");
            fieldsToUpdate.awards = JSON.parse(formData.get("awards") || "[]");
        } catch (e) {
            return NextResponse.json(apiResponse({
                message: "Invalid JSON in expertise, socialLinks, or awards",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        if (!Array.isArray(fieldsToUpdate.expertise)) {
            return NextResponse.json(apiResponse({
                message: "Expertise must be an array",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        if (fieldsToUpdate.dob) {
            fieldsToUpdate.dob = new Date(fieldsToUpdate.dob);
        }

        const event = await EventOutreach.findById(fieldsToUpdate.yeaslyEventId);
        if (!event) {
            return NextResponse.json(apiResponse({
                message: "Event not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        // Photo upload handling
        const photo = formData.get("photo");
        if (photo && typeof photo !== "string" && photo instanceof File) {
            const originalFilename = photo.name || "speaker-photo";
            const sanitizedFilename = originalFilename
                .replace(/[^a-zA-Z0-9\-._]/g, "_")
                .replace(/\s+/g, "_")
                .replace(/_{2,}/g, "_")
                .substring(0, 100);

            const extension = path.extname(sanitizedFilename).slice(1).toLowerCase();
            if (!ALLOWED_IMAGE_TYPES.includes(photo.type) || !ALLOWED_EXTENSIONS.includes(extension)) {
                return NextResponse.json(apiResponse({
                    message: "Invalid image type or extension",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }), { status: STATUS_CODES.BAD_REQUEST });
            }

            const folderPath = path.join(process.cwd(), "public", `${event.year}`, "speakers");
            const randomId = crypto.randomBytes(8).toString("hex");
            const fileName = `${Date.now()}-${randomId}.${extension}`;
            const filePath = path.join(folderPath, fileName);
            const publicPath = `/${event.year}/speakers/${fileName}`;

            try {
                await mkdir(folderPath, { recursive: true });
                const buffer = Buffer.from(await photo.arrayBuffer());
                await fs.promises.writeFile(filePath, buffer);

                // Delete old image
                if (speaker.photoUrl) {
                    const oldPath = path.join(process.cwd(), "public", speaker.photoUrl);
                    try { await fs.promises.unlink(oldPath); } catch (e) { console.warn("Old image not found."); }
                }

                fieldsToUpdate.photoUrl = publicPath;
            } catch (error) {
                return NextResponse.json(apiResponse({
                    message: "Failed to save updated speaker photo",
                    statusCode: STATUS_CODES.INTERNAL_SERVER_ERROR,
                }), { status: STATUS_CODES.INTERNAL_SERVER_ERROR });
            }
        }

        // Update speaker
        Object.assign(speaker, fieldsToUpdate);
        await speaker.save();

        return NextResponse.json(apiResponse({
            message: "Speaker updated successfully",
            data: speaker,
            statusCode: STATUS_CODES.OK,
        }), { status: STATUS_CODES.OK });

    } catch (error) {
        const handledError = handleError(error);
        return NextResponse.json(handledError, {
            status: handledError.httpStatus || STATUS_CODES.INTERNAL_ERROR,
        });
    }
}
