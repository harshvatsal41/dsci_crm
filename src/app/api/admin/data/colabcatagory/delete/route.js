import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import CollabSubCategory from "@/Mongo/Model/DataModels/CollabSubCatagory";
import sanitizeInput from "@/Helper/sanitizeInput";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import mongoose from "mongoose";


export async function POST(req){
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

        const user = await Employee.findById(decodedToken.id);
        if (!user) {
            return NextResponse.json(apiResponse({
                message: "User not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        const { searchParams } = new URL(req.url);
        const subCatagoryId = sanitizeInput(searchParams.get("subCatagoryId"));

        if (!subCatagoryId) {
            return NextResponse.json(apiResponse({
                message: "Sub Catagory ID is required",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        const subCatagory = await CollabSubCategory.findById(subCatagoryId);
        if (!subCatagory) {
            return NextResponse.json(apiResponse({
                message: "Sub Catagory not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        if(subCatagory.isDeleted){
            return NextResponse.json(apiResponse({
                message: "Sub Catagory already deleted",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        subCatagory.isDeleted = true;
        subCatagory.deletedAt = new Date();
        subCatagory.deletedBy = user._id;

        await subCatagory.save();

        return NextResponse.json(apiResponse({
            message: "Sub Catagory deleted successfully",
            data: subCatagory,
            statusCode: STATUS_CODES.DELETESUCCESS,
        }), { status: STATUS_CODES.DELETESUCCESS });
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}