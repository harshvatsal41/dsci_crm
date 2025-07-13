import FocusArea from "@/Mongo/Model/DataModels/FocusArea";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { NextResponse } from "next/server";
import { handleError } from "@/Helper/errorHandler";
import mongoose from "mongoose";


export async function POST(req) {
    try {
        await util.connectDB();
        const token = req.cookies.get("dsciAuthToken")?.value || req.headers.get("Authorization")?.split(" ")[1];
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
        const focusAreaId = searchParams.get("focusAreaId");

        if (!mongoose.isValidObjectId(focusAreaId)) {
            return NextResponse.json(apiResponse({
                message: "Invalid ID Format",
                statusCode: STATUS_CODES.BAD_REQUEST,
                error: { field: "_id" }
            }), { status: STATUS_CODES.BAD_REQUEST });
        }
        
        const focusArea = await FocusArea.findById(focusAreaId);
        if (!focusArea) {
            return NextResponse.json(apiResponse({
                message: "Focus area not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }
        
        focusArea.isDeleted = true;
        focusArea.deletedAt = new Date();
        focusArea.deletedBy = decodedToken.id;
        
        await focusArea.save();
        
        return NextResponse.json(apiResponse({
            message: "Focus area deleted successfully",
            data: focusArea,
            statusCode: STATUS_CODES.DELETEDSUCCESS,
        }));
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}