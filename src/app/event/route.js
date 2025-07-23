import { NextResponse } from "next/server";
import { apiResponse, STATUS_CODES } from "@/Helper/response";

export async function GET(req) {
    try {
        return NextResponse.json(apiResponse({
            message: "Event List",
            data: [],
            statusCode: STATUS_CODES.SUCCESS,
        }), { status: STATUS_CODES.SUCCESS });
    } catch (error) {
        console.error("Error fetching events:", error);
        return NextResponse.json(apiResponse({
            message: "Failed to fetch events",
            statusCode: STATUS_CODES.INTERNAL_ERROR,
        }), { status: STATUS_CODES.INTERNAL_ERROR });
    }
}
