import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import Collaboration from "@/Mongo/Model/DataModels/Collaboration";
import sanitizeInput from "@/Helper/sanitizeInput";


export async function GET(req){
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
        const eventId = sanitizeInput(searchParams.get("eventId"));

        if (!eventId) {
            return NextResponse.json(apiResponse({
                message: "Event ID is required",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        const event = await EventOutreach.findById(eventId);
        if (!event) {
            return NextResponse.json(apiResponse({
                message: "Event not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        let filter = {
            isDeleted: false,
        };

        filter.yeaslyEventId = event._id;

        const collaborations = await Collaboration.find(filter);

        return NextResponse.json(apiResponse({
            message: "Collaborations fetched successfully",
            data: collaborations,
            statusCode: STATUS_CODES.SUCCESS,
        }), { status: STATUS_CODES.SUCCESS });
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}