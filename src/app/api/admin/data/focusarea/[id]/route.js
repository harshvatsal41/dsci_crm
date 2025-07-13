import { NextResponse } from "next/server";
import FocusArea from "@/Mongo/Model/DataModels/FocusArea";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import util from "@/Helper/apiUtils";
import path from "path";
import fs from "fs/promises";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { handleError } from "@/Helper/errorHandler";
import { decodeTokenPayload } from "@/Helper/jwtValidator";

export async function GET(req, { params }) {
  try {
    await util.connectDB();
    const { id } = await params;

    const focusArea = await FocusArea.findById(id);
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

    // Authentication
    const token = req.cookies.get("dsciAuthToken")?.value || req.headers.get("Authorization")?.split(" ")[1];
    const decodedToken = decodeTokenPayload(token);

    // Get existing focus area
    const existingFocusArea = await FocusArea.findById(id);
    if (!existingFocusArea) {
      return NextResponse.json(
        apiResponse({ message: "Focus area not found", statusCode: 404 }),
        { status: 404 }
      );
    }

    // Parse form data
    const formData = await req.formData();
    const name = (formData.get("name") || "").trim();
    const description = (formData.get("description") || "").trim();
    const image = formData.get("image");

    // Prepare update data
    const updateData = { name, description };

    // Handle image update if provided
    if (image && image instanceof File) {
      // Validate image
      if (!ALLOWED_IMAGE_TYPES.includes(image.type)) {
        return NextResponse.json(
          apiResponse({
            message: "Invalid image type",
            statusCode: STATUS_CODES.BAD_REQUEST,
          }),
          { status: STATUS_CODES.BAD_REQUEST }
        );
      }

      // Delete old image
      if (existingFocusArea.imageUrlPath) {
        const oldPath = path.join(process.cwd(), "public", existingFocusArea.imageUrlPath);
        await fs.unlink(oldPath).catch(() => {});
      }

      // Save new image
      const event = await EventOutreach.findById(existingFocusArea.yearlyEventId);
      const extension = path.extname(image.name).slice(1);
      const folderPath = path.join(process.cwd(), "public", `${event.year}`, "focusarea");
      const randomId = crypto.randomBytes(8).toString("hex");
      const fileName = `${Date.now()}-${randomId}.${extension}`;
      const filePath = path.join(folderPath, fileName);
      const publicPath = `/${event.year}/focusarea/${fileName}`;

      await fs.mkdir(folderPath, { recursive: true });
      const buffer = Buffer.from(await image.arrayBuffer());
      await fs.writeFile(filePath, buffer);

      updateData.imageUrlPath = publicPath;
    }

    // Update focus area
    const updatedFocusArea = await FocusArea.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );

    return NextResponse.json(
      apiResponse({
        message: "Focus area updated successfully",
        data: updatedFocusArea,
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