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
import { updateImage } from "@/utilities/MediaUpload";

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
    const token =
      req.cookies.get("dsciAuthToken")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];
    const decodedToken = decodeTokenPayload(token);
    const userId = decodedToken?.id;

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

    const formData = await req.formData();
    const name = sanitizeInput(formData.get("name")?.toString()?.trim());
    const description = sanitizeInput(formData.get("description")?.toString()?.trim());
    const image = formData.get("image");

    if (!focusAreaId || !userId) {
      return NextResponse.json(
        apiResponse({
          message: "Missing focusAreaId or authorization",
          statusCode: STATUS_CODES.BAD_REQUEST,
        }),
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    const focusAreaDoc = await FocusArea.findById(focusAreaId);
    if (!focusAreaDoc) {
      return NextResponse.json(
        apiResponse({
          message: "FocusArea not found",
          statusCode: STATUS_CODES.NOT_FOUND,
        }),
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    if (name) focusAreaDoc.name = name;
    if (description) focusAreaDoc.description = description;
    focusAreaDoc.updatedBy = userId;

    // === HANDLE IMAGE (if provided) ===
    if (image && typeof image !== "string" && image instanceof File) {
      const event = await EventOutreach.findById(focusAreaDoc.yeaslyEventId);

      const { publicPath, savedPath } = await updateImage(
        image,
        `public/${event.year}/focusarea`,
        ALLOWED_IMAGE_TYPES,
        ALLOWED_EXTENSIONS,
        focusAreaDoc.imageUrlPath // existing image path to delete
      );

      // Delete old image if exists
      if (focusAreaDoc.imageUrlPath) {
        const oldPath = path.join(process.cwd(), "public", focusAreaDoc.imageUrlPath);
        try {
          await fs.promises.unlink(oldPath);
          console.log("Old image deleted:", oldPath);
        } catch (e) {
          console.warn("Failed to delete old image:", oldPath, e.message);
        }
      }

      focusAreaDoc.imageUrlPath = publicPath;
    }

    await focusAreaDoc.save();

    return NextResponse.json(
      apiResponse({
        message: "FocusArea updated successfully",
        data: focusAreaDoc,
        statusCode: STATUS_CODES.OK,
      }),
      { status: STATUS_CODES.OK }
    );
  } catch (error) {
    const handledError = handleError(error);
    return NextResponse.json(handledError, {
      status: handledError.httpStatus || STATUS_CODES.INTERNAL_ERROR,
    });
  }
}