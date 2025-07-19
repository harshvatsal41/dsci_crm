import fs from "fs";
import path from "path";
import crypto from "crypto";
import { mkdir } from "fs/promises";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { NextResponse } from "next/server";
import sanitizeInput from "@/Helper/sanitizeInput";

export async function uploadImage(file, baseFolderPath, ALLOWED_IMAGE_TYPES, ALLOWED_EXTENSIONS) {
    try {
      validateImage(file, ALLOWED_IMAGE_TYPES, ALLOWED_EXTENSIONS);
  
      let ext = file.type.split("/")[1].toLowerCase();
      const randomId = crypto.randomBytes(8).toString("hex");
      const fileName = `${Date.now()}-${randomId}.${ext}`;
      const folderPath = path.join(process.cwd(), baseFolderPath);
      const savedPath = path.join(folderPath, fileName);
      const publicPath = path.join("/", baseFolderPath.replace(/^public[\\/]/, ""), fileName);
  
      await mkdir(folderPath, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.promises.writeFile(savedPath, buffer);
  
      return { publicPath, savedPath, fileName };
    } catch (error) {
      throw new Error("Image upload failed: " + error.message);
    }
  }
  

  export async function updateImage(file, baseFolderPath, ALLOWED_IMAGE_TYPES, ALLOWED_EXTENSIONS) {
    try {       
      validateImage(file, ALLOWED_IMAGE_TYPES, ALLOWED_EXTENSIONS);
  
      const extension = file.type.split("/")[1].toLowerCase();
      const randomId = crypto.randomBytes(8).toString("hex");
      const fileName = `${Date.now()}-${randomId}.${extension}`;
      const folderPath = path.join(process.cwd(), baseFolderPath);
      const savedPath = path.join(folderPath, fileName);
      const publicPath = path.join("/", baseFolderPath.replace(/^public[\\/]/, ""), fileName);
  
      await mkdir(folderPath, { recursive: true });
      const buffer = Buffer.from(await file.arrayBuffer());
      await fs.promises.writeFile(savedPath, buffer);
  
      return { publicPath, savedPath, fileName };
    } catch (error) {

        return NextResponse.json(apiResponse({
            message: "Image upload failed: " + error.message,
            statusCode: STATUS_CODES.INTERNAL_ERROR,
        }), { status: STATUS_CODES.INTERNAL_ERROR });
    }
}
  
function validateImage(file, allowedTypes, allowedExts) {


    if (!file || typeof file === "string" || !(file instanceof File)) {
        return NextResponse.json(apiResponse({
            message: "Image must be a valid file",
            statusCode: STATUS_CODES.BAD_REQUEST,
        }), { status: STATUS_CODES.BAD_REQUEST });
    }
  
    const ext = path.extname(sanitizeInput(file.name)).slice(1).toLowerCase();
    if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(apiResponse({
            message: "Invalid image MIME type",
            statusCode: STATUS_CODES.BAD_REQUEST,
        }), { status: STATUS_CODES.BAD_REQUEST });
    }
  
    return ext;
  }
  