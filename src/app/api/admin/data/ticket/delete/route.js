import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import Ticket from "@/Mongo/Model/DataModels/Ticket";
import sanitizeInput from "@/Helper/sanitizeInput";
import Employee from "@/Mongo/Model/AcessModels/Employee";

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

        const user = await Employee.findById(decodedToken.id);
        if (!user) {
            return NextResponse.json(
                apiResponse({
                    message: "Unauthorized: User not found",
                    statusCode: STATUS_CODES.UNAUTHORIZED,
                }),
                { status: STATUS_CODES.UNAUTHORIZED }
            );
        }

        const { searchParams } = new URL(req.url);
        const ticketId = sanitizeInput(searchParams.get("ticketId"));

        if (!ticketId) {
            return NextResponse.json(
                apiResponse({
                    message: "Ticket ID is required",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        const ticketDoc = await Ticket.findById(ticketId);
        if (!ticketDoc) {
            return NextResponse.json(
                apiResponse({
                    message: "Ticket not found",
                    statusCode: STATUS_CODES.NOT_FOUND,
                }),
                { status: STATUS_CODES.NOT_FOUND }
            );
        }

        // Soft delete
        ticketDoc.isDeleted = true;
        ticketDoc.deletedAt = new Date();
        ticketDoc.deletedBy = decodedToken.id;

        await ticketDoc.save();

        return NextResponse.json(
            apiResponse({
                message: "Ticket deleted successfully",
                statusCode: STATUS_CODES.SUCCESSDELETE,
            }),
            { status: STATUS_CODES.SUCCESSDELETE }
        );
    } catch (error) {
        handleError(error);
        return NextResponse.json(
            apiResponse({
                message: error.message || "Internal server error",
                statusCode: STATUS_CODES.INTERNAL_ERROR,
            }),
            { status: STATUS_CODES.INTERNAL_ERROR }
        );
    }
}
