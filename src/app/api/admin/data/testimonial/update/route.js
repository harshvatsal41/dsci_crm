import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import Testimonial from "@/Mongo/Model/DataModels/Testimonial";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import path from "path";
import fs from "fs";
import { mkdir } from "fs/promises";
import crypto from "crypto";
import sanitizeInput from "@/Helper/sanitizeInput";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export async function POST(req) {
    try {
        await util.connectDB();

        const token = req.cookies.get("dsciAuthToken")?.value || req.headers.get("Authorization")?.split(" ")[1];
        const decodedToken = decodeTokenPayload(token);
        if (!decodedToken?.id) {
            return NextResponse.json(apiResponse({
                message: "Unauthorized: Invalid or missing token",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        const { searchParams } = new URL(req.url);
        const id = sanitizeInput(searchParams.get("testimonialId"));
        if (!id) {
            return NextResponse.json(apiResponse({
                message: "testimonialId is required",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return NextResponse.json(apiResponse({
                message: "Testimonial not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        const event = await EventOutreach.findById(testimonial.eventId);
        if (!event) {
            return NextResponse.json(apiResponse({
                message: "Associated event not found",
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

        testimonial.name = name || testimonial.name;
        testimonial.organization = organization || testimonial.organization;
        testimonial.body = body || testimonial.body;
        testimonial.description = description || testimonial.description;
        testimonial.email = email || testimonial.email;
        testimonial.contentWeight = contentWeight || testimonial.contentWeight;
        testimonial.updatedBy = decodedToken.id;

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
            if (testimonial.imageUrlPath) {
                const oldPath = path.join(process.cwd(), "public", testimonial.imageUrlPath);
                if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
            }

            // Save new photo
            const folderPath = path.join(process.cwd(), "public", `${event.year}`, "testimonials");
            const randomId = crypto.randomBytes(8).toString("hex");
            const fileName = `${Date.now()}-${randomId}.${extension}`;
            const filePath = path.join(folderPath, fileName);
            const publicPath = `/${event.year}/testimonials/${fileName}`;

            await mkdir(folderPath, { recursive: true });
            const buffer = Buffer.from(await photo.arrayBuffer());
            const fileStream = fs.createWriteStream(filePath);

            await new Promise((resolve, reject) => {
                fileStream.write(buffer, (error) => {
                    if (error) reject(error);
                    else resolve();
                });
            });

            testimonial.imageUrlPath = publicPath;
        }

        await testimonial.save();

        return NextResponse.json(apiResponse({
            message: "Testimonial updated successfully",
            data: testimonial,
            statusCode: STATUS_CODES.UPDATESUCCESS,
        }));
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}
