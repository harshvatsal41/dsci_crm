import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { handleError } from "@/Helper/errorHandler";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import Speaker from "@/Mongo/Model/DataModels/Speaker";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";

export async function DELETE(req) {
    try {
        await util.connectDB();

        const { searchParams } = new URL(req.url);
        const id = searchParams.get("speakerId");
        if (!id) {
            return NextResponse.json(apiResponse({
                message: "speakerId is required",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        const speaker = await Speaker.findById(id);
        if (!speaker) {
            return NextResponse.json(apiResponse({
                message: "Speaker not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        await speaker.updateOne({ isDeleted: true });

        return NextResponse.json(apiResponse({
            message: "Speaker deleted successfully",
            statusCode: STATUS_CODES.OK,
        }), { status: STATUS_CODES.OK });
    } catch (error) {
        const handledError = handleError(error);
        return NextResponse.json(handledError, {
            status: handledError.httpStatus || STATUS_CODES.INTERNAL_ERROR,
        });
    }
}
            
