import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import FocusArea from "@/Mongo/Model/DataModels/FocusArea";
import EventOutreach from "@/Mongo/Model/DataModels/eventOutreach";
import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { handleError } from "@/Helper/errorHandler";

export async function GET() {
    try {
        await util.connectDB();

        const focusAreas = await FocusArea.find({ isDeleted: false })
            .populate("yeaslyEventId")
            .sort({ createdAt: -1 });

        return NextResponse.json(apiResponse({
            message: "Focus areas fetched",
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

        const formData = await req.formData();

        const name = formData.get("name");
        const description = formData.get("description");
        const eventId = formData.get("eventId");
        const createdBy = formData.get("createdBy");
        const image = formData.get("image"); // should be file

        if (!image || !eventId || !createdBy) {
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

        const extension = image.name.split(".").pop();
        const folderPath = path.join(process.cwd(), "public", `${event.year}`);
        const fileName = `${focusAreaDoc._id}.${extension}`;
        const filePath = path.join(folderPath, fileName);
        const publicPath = `/${event.year}/${fileName}`;

        await mkdir(folderPath, { recursive: true });

        const buffer = Buffer.from(await image.arrayBuffer());
        await writeFile(filePath, buffer);

        focusAreaDoc.imageUrlPath = publicPath;
        await focusAreaDoc.save();

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
