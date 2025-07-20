import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import Collaboration from "@/Mongo/Model/DataModels/Collaboration";
import sanitizeInput from "@/Helper/sanitizeInput";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import mongoose from "mongoose";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import CollabSubCategory from "@/Mongo/Model/DataModels/CollabSubCatagory";
import yeaslyEvent from "@/Mongo/Model/DataModels/yeaslyEvent";
import path from "path";
import fs from "fs";
import { mkdir } from "fs/promises";
import crypto from "crypto";
import { uploadImage } from "@/utilities/MediaUpload";

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp",];
const ALLOWED_EXTENSIONS = ["jpg", "jpeg", "png", "webp"];


export async function GET(req) {
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
  
      const collaborations = await Collaboration.aggregate([
        {
          $match: {
            isDeleted: false,
            yeaslyEventId: new mongoose.Types.ObjectId(eventId),
          },
        },
        {
          $lookup: {
            from: "collabsubcategories", // collection name (not model name)
            localField: "subCategory",
            foreignField: "_id",
            as: "subCategoryDetails",
          },
        },
        {
          $unwind: "$subCategoryDetails",
        },
        {
          $project: {
            _id: 1,
            title: 1,
            logoUrlPath: 1,
            websiteLink: 1,
            description: 1,
            about: 1,
            contentWeight: 1,
            yeaslyEventId: 1,
            subCategory: "$subCategoryDetails", // embedded full details
            socialMediaLinks: 1,
            createdBy: 1,
            createdAt: 1,
          },
        },
        { $sort: { contentWeight: -1, title: 1 } }, // optional sorting
      ]);
  
      return NextResponse.json(
        apiResponse({
          message: "Collaborations fetched successfully",
          data: collaborations,
          statusCode: STATUS_CODES.SUCCESS,
        }),
        { status: STATUS_CODES.SUCCESS }
      );
    } catch (error) {
      return NextResponse.json(handleError(error), {
        status: STATUS_CODES.INTERNAL_ERROR,
      });
    }
  }

  export async function POST(req) {
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
  
      const event = await EventOutreach.findById(eventId);
      if (!event) {
        return NextResponse.json(
          apiResponse({
            message: "Event not found",
            statusCode: STATUS_CODES.NOT_FOUND,
          }),
          { status: STATUS_CODES.NOT_FOUND }
        );
      }
  
      const formData = await req.formData();
  
      const title = sanitizeInput(formData.get("title"));
      const body = sanitizeInput(formData.get("body"));
      const about = sanitizeInput(formData.get("about"));
      const websiteLink = sanitizeInput(formData.get("websiteLink"));
      const description = sanitizeInput(formData.get("description"));
      const subCategory = sanitizeInput(formData.get("subCategory"));
      const contentWeight = Number(formData.get("contentWeight") || 0);
      const socialMediaRaw = formData.get("socialMediaLinks");
      const photo = formData.get("image"); // This is a File object

      const subCategoryDetails = await CollabSubCategory.findById(subCategory);
      if(!subCategoryDetails){
        return NextResponse.json(
          apiResponse({
            message: "SubCategory not found",
            statusCode: STATUS_CODES.NOT_FOUND,
          }),
          { status: STATUS_CODES.NOT_FOUND }
        );
      }
      if(subCategoryDetails.isDeleted){
        return NextResponse.json(
          apiResponse({
            message: "SubCategory not found",
            statusCode: STATUS_CODES.NOT_FOUND,
          }),
          { status: STATUS_CODES.NOT_FOUND }
        );
      }
  
      if (!title || !body || !about || !description || !subCategory) {
        return NextResponse.json(
          apiResponse({
            message: "Missing required fields",
            statusCode: STATUS_CODES.BAD_REQUEST,
          }),
          { status: STATUS_CODES.BAD_REQUEST }
        );
      }
  
      // Parse social media links
      let socialMediaLinks = [];
      if (socialMediaRaw) {
        try {
          socialMediaLinks = JSON.parse(socialMediaRaw);
          if (!Array.isArray(socialMediaLinks)) throw new Error();
        } catch (error) {
          console.log(error);
          return NextResponse.json(
            apiResponse({
              message: "Invalid format for socialMediaLinks. Must be a JSON array.",
              statusCode: STATUS_CODES.BAD_REQUEST,
            }),
            { status: STATUS_CODES.BAD_REQUEST }
          );
        }
      }
  

      let logoUrlPath = "";
       // ⚡️ Enhanced image upload handling
    try {
      const { publicPath } = await uploadImage(photo, `public/${event.year}/collaborations`, ALLOWED_IMAGE_TYPES, ALLOWED_EXTENSIONS);
      logoUrlPath = publicPath;

    } catch (error) {
      return NextResponse.json(
        apiResponse({
          message: "Image upload failed: " + error.message,
          statusCode: STATUS_CODES.INTERNAL_ERROR,
        }),
        { status: STATUS_CODES.INTERNAL_ERROR }
      );
    }
  
      const newCollab = await Collaboration.create({
        title,
        body,
        about,
        websiteLink,
        description,
        subCategory,
        contentWeight,
        socialMediaLinks,
        yeaslyEventId: event._id,
        createdBy: decodedToken.id,
        logoUrlPath,
      });

      await newCollab.save();

      await yeaslyEvent.updateOne(
        {
          _id: event._id,
          "sponsorGroups.subCategory": subCategory,
        },
        {
          $push: {
            "sponsorGroups.$[group].sponsors": newCollab._id,
          },
        },
        {
          arrayFilters: [
            {
              "group.subCategory": subCategory,
            },
          ],
        }
      );
      
      return NextResponse.json(
        apiResponse({
          message: "Collaboration created successfully",
          data: newCollab,
          statusCode: STATUS_CODES.CREATED,
        }),
        { status: STATUS_CODES.CREATED }
      );
    } catch (error) {
      return NextResponse.json(handleError(error), {
        status: STATUS_CODES.INTERNAL_ERROR,
      });
    }
  }