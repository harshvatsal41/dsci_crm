import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import FocusArea from "@/Mongo/Model/DataModels/FocusArea";
import EventOutreach from "@/Mongo/Model/DataModels/eventOutreach";
import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { handleError } from "@/Helper/errorHandler";


export async function GET(req, { params }) {
    try {
        await util.connectDB();

        const { id } = await params;
        const focusArea = await FocusArea.findById(id).populate("yeaslyEventId");

        if (!focusArea || focusArea.isDeleted) {
            return NextResponse.json(apiResponse({
                message: "Not found",
                data: null,
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        return NextResponse.json(apiResponse({
            message: "FocusArea found",
            data: focusArea,
            statusCode: STATUS_CODES.OK,
        }));
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_SERVER_ERROR,
        });
    }
}
