import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import { NextResponse } from "next/server";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { handleError } from "@/Helper/errorHandler";
import util from "@/Helper/apiUtils";
import sanitizeInput from "@/Helper/sanitizeInput";

// This function gets called with route parameters
export async function GET(req, { params }) {
    try {
        await util.connectDB();

        const { id } = await params;
        const eventId = sanitizeInput(id);
        const event = await EventOutreach.findById(eventId);

        if (!event) {
            return NextResponse.json(
                apiResponse({
                    message: "Event not found",
                    data: null,
                    statusCode: STATUS_CODES.NOT_FOUND
                }),
                { status: STATUS_CODES.NOT_FOUND }
            );
        }

        return NextResponse.json(
            apiResponse({
                message: "Event fetched successfully",
                data: event,
                statusCode: STATUS_CODES.OK
            })
        );
    } catch (error) {
        const handledError = handleError(error);
        return NextResponse.json(handledError, {
            status: handledError.httpStatus
        });
    }
}
