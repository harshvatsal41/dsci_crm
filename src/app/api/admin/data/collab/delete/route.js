import { NextResponse } from "next/server";
import Collaboration from "@/Mongo/Model/DataModels/Collaboration";
import mongoose from "mongoose";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import sanitizeInput from "@/Helper/sanitizeInput";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";



export async function POST(req){
    console.log("heiited")
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
        const collabId = sanitizeInput(searchParams.get("collaborationId"));
        const collab = await Collaboration.findById(collabId);
        if (!collab) {
            return NextResponse.json(
                apiResponse({
                    message: "Collaboration not found",
                    statusCode: STATUS_CODES.NOT_FOUND,
                }),
                { status: STATUS_CODES.NOT_FOUND }
            );
        }

        if(collab.isDeleted){
            return NextResponse.json(
                apiResponse({
                    message: "Collaboration already deleted",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        collab.deletedAt = new Date();


        
        collab.isDeleted = true;
        await collab.save();
        return NextResponse.json(
            apiResponse({
                message: "Collaboration deleted successfully",
                statusCode: STATUS_CODES.DELETESUCCESS,
            }),
            { status: STATUS_CODES.OK }
        );

    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}