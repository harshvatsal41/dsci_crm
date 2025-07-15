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

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp",];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];

export async function GET(req, { params }) {
  try {
    await util.connectDB();
    const { id } = await params;
    const focusAreaId = sanitizeInput(id);
    const focusArea = await FocusArea.findById(focusAreaId);
    if (!focusArea) {
      return NextResponse.json(
        apiResponse({ message: "Focus area not found", statusCode: 404 }),
        { status: 404 }
      );
    }

    return NextResponse.json(
      apiResponse({
        data: focusArea,
        statusCode: STATUS_CODES.SUCCESS,
      })
    );
  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, {
      status: handledError.httpStatus || 500,
    });
  }
}

export async function POST(req, { params }) {
  try {
    await util.connectDB();

    const { id } = await params;
    const focusAreaId = sanitizeInput(id);
    const token = req.cookies.get("dsciAuthToken")?.value || req.headers.get("Authorization")?.split(" ")[1];
    const decodedToken = decodeTokenPayload(token);
    const userId = decodedToken?.id;

    const contentType = req.headers.get("content-type") || "";
    if (!contentType.startsWith("multipart/form-data")) {
      return NextResponse.json(apiResponse({
        message: "Content-Type must be multipart/form-data",
        statusCode: STATUS_CODES.BAD_REQUEST
      }), { status: STATUS_CODES.BAD_REQUEST });
    }

    const formData = await req.formData();
    const name = sanitizeInput(formData.get("name")?.toString()?.trim());
    const description = sanitizeInput(formData.get("description")?.toString()?.trim());
    const image = formData.get("image");

    if (!focusAreaId || !userId) {
      return NextResponse.json(apiResponse({
        message: "Missing focusAreaId or authorization",
        statusCode: STATUS_CODES.BAD_REQUEST
      }), { status: STATUS_CODES.BAD_REQUEST });
    }

    const focusAreaDoc = await FocusArea.findById(focusAreaId);
    if (!focusAreaDoc) {
      return NextResponse.json(apiResponse({
        message: "FocusArea not found",
        statusCode: STATUS_CODES.NOT_FOUND
      }), { status: STATUS_CODES.NOT_FOUND });
    }

    if (name) focusAreaDoc.name = name;
    if (description) focusAreaDoc.description = description;
    focusAreaDoc.updatedBy = userId;

    // If new image is uploaded
    if (image && typeof image !== "string" && image instanceof File) {
      const originalFilename = image.name || "image";
      const sanitizedFilename = originalFilename
        .replace(/[^a-zA-Z0-9\-._]/g, "_")
        .replace(/\s+/g, "_")
        .replace(/_{2,}/g, "_")
        .substring(0, 100);

      const extension = path.extname(sanitizedFilename).slice(1).toLowerCase();

      if (!ALLOWED_IMAGE_TYPES.includes(image.type) || !ALLOWED_EXTENSIONS.includes(extension)) {
        return NextResponse.json(apiResponse({
          message: `Invalid image type or extension`,
          statusCode: STATUS_CODES.BAD_REQUEST
        }), { status: STATUS_CODES.BAD_REQUEST });
      }

      const event = await EventOutreach.findById(focusAreaDoc.yeaslyEventId);
      const folderPath = path.join(process.cwd(), "public", `${event.year}`, "focusarea");
      const randomId = crypto.randomBytes(8).toString("hex");
      const fileName = `${Date.now()}-${randomId}.${extension}`;
      const filePath = path.join(folderPath, fileName);
      const publicPath = `/${event.year}/focusarea/${fileName}`;

      try {
        await mkdir(folderPath, { recursive: true });

        const buffer = Buffer.from(await image.arrayBuffer());
        await fs.promises.writeFile(filePath, buffer);

        // Delete old image if it exists
        if (focusAreaDoc.imageUrlPath) {
          const oldPath = path.join(process.cwd(), "public", focusAreaDoc.imageUrlPath);
          try { await unlink(oldPath); } catch (e) { console.warn("Old image not found:", oldPath); }
        }

        focusAreaDoc.imageUrlPath = publicPath;
      } catch (fileError) {
        console.error("Failed to save image:", fileError);
        return NextResponse.json(apiResponse({
          message: "Failed to save image",
          statusCode: STATUS_CODES.INTERNAL_ERROR
        }), { status: STATUS_CODES.INTERNAL_ERROR });
      }
    }

    await focusAreaDoc.save();

    return NextResponse.json(apiResponse({
      message: "FocusArea updated successfully",
      data: focusAreaDoc,
      statusCode: STATUS_CODES.OK
    }), { status: STATUS_CODES.OK });

  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, {
      status: handledError.httpStatus || STATUS_CODES.INTERNAL_ERROR,
    });
  }
}