import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import sanitizeInput from "@/Helper/sanitizeInput";
import Collaboration from "@/Mongo/Model/DataModels/Collaboration";
import EventOutreach from "@/Mongo/Model/DataModels/EventOutreach";
import CollabSubCategory from "@/Mongo/Model/DataModels/CollabSubCategory";
import fs from "fs";
import path from "path";
import { mkdir } from "fs/promises";
import crypto from "crypto";
import { uploadImage } from "@/utilities/MediaUpload";

const ALLOWED_EXTENSIONS = ["png", "jpg", "jpeg", "webp"];
const ALLOWED_IMAGE_TYPES = ["image/png", "image/jpeg", "image/webp"];

export async function PUT(req) {
  try {
    await util.connectDB();

    const token =
      req.cookies.get("dsciAuthToken")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

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
    const collabId = sanitizeInput(searchParams.get("id"));

    if (!collabId) {
      return NextResponse.json(
        apiResponse({
          message: "Collaboration ID is required",
          statusCode: STATUS_CODES.BAD_REQUEST,
        }),
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    const existingCollab = await Collaboration.findById(collabId);
    if (!existingCollab || existingCollab.isDeleted) {
      return NextResponse.json(
        apiResponse({
          message: "Collaboration not found",
          statusCode: STATUS_CODES.NOT_FOUND,
        }),
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    const event = await EventOutreach.findById(existingCollab.yeaslyEventId);
    if (!event) {
      return NextResponse.json(
        apiResponse({
          message: "Associated event not found",
          statusCode: STATUS_CODES.NOT_FOUND,
        }),
        { status: STATUS_CODES.NOT_FOUND }
      );
    }

    const formData = await req.formData();
    const updatedFields = {
      title: sanitizeInput(formData.get("title")),
      body: sanitizeInput(formData.get("body")),
      about: sanitizeInput(formData.get("about")),
      websiteLink: sanitizeInput(formData.get("websiteLink")),
      description: sanitizeInput(formData.get("description")),
      contentWeight: Number(formData.get("contentWeight") || 0),
    };

    const newSubCategory = sanitizeInput(formData.get("subCategory"));

    // Social Media Links
    const socialMediaRaw = formData.get("socialMediaLinks");
    if (socialMediaRaw) {
      try {
        const parsed = JSON.parse(socialMediaRaw);
        if (!Array.isArray(parsed)) throw new Error();
        updatedFields.socialMediaLinks = parsed;
      } catch {
        return NextResponse.json(
          apiResponse({
            message: "Invalid format for socialMediaLinks",
            statusCode: STATUS_CODES.BAD_REQUEST,
          }),
          { status: STATUS_CODES.BAD_REQUEST }
        );
      }
    }

    if (newSubCategory && newSubCategory !== existingCollab.subCategory.toString()) {
        const subCatDoc = await CollabSubCategory.findById(newSubCategory);
        if (!subCatDoc || subCatDoc.isDeleted) {
          return NextResponse.json(
            apiResponse({
              message: "Invalid SubCategory",
              statusCode: STATUS_CODES.BAD_REQUEST,
            }),
            { status: STATUS_CODES.BAD_REQUEST }
          );
        }
  
        // Remove from old group
        await EventOutreach.updateOne(
          {
            _id: event._id,
            "sponsorGroups.subCategory": existingCollab.subCategory,
          },
          {
            $pull: {
              "sponsorGroups.$[group].sponsors": existingCollab._id,
            },
          },
          {
            arrayFilters: [{ "group.subCategory": existingCollab.subCategory }],
          }
        );
  
        // Add to new group
        await EventOutreach.updateOne(
          {
            _id: event._id,
            "sponsorGroups.subCategory": newSubCategory,
          },
          {
            $push: {
              "sponsorGroups.$[group].sponsors": existingCollab._id,
            },
          },
          {
            arrayFilters: [{ "group.subCategory": newSubCategory }],
          }
        );
  
        updatedFields.subCategory = newSubCategory;
      }

    // Image Upload
    const photo = formData.get("image");
    try {
      const { publicPath } = await uploadImage(photo, `public/${event.year}/collaborations`, ALLOWED_IMAGE_TYPES, ALLOWED_EXTENSIONS, existingCollab.logoUrlPath);
      updatedFields.logoUrlPath = publicPath;

      
    } catch (error) {
      return NextResponse.json(
        apiResponse({
          message: "Image upload failed: " + error.message,
          statusCode: STATUS_CODES.INTERNAL_ERROR,
        }),
        { status: STATUS_CODES.INTERNAL_ERROR }
      );
    }
    
    // Final update
    const updated = await Collaboration.findByIdAndUpdate(
      collabId,
      { $set: updatedFields },
      { new: true }
    );

    return NextResponse.json(
      apiResponse({
        message: "Collaboration updated successfully",
        data: updated,
        statusCode: STATUS_CODES.SUCCESS,
      }),
      { status: STATUS_CODES.SUCCESS }
    );
  } catch (err) {
    return NextResponse.json(handleError(err), {
      status: STATUS_CODES.INTERNAL_ERROR,
    });
  }
}
