import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import Ticket from "@/Mongo/Model/DataModels/Ticket";
import sanitizeInput from "@/Helper/sanitizeInput";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";



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

        const formData = await req.formData();
        const name = sanitizeInput(formData.get("name") || "").trim();
        const subHeading = sanitizeInput(formData.get("subHeading") || "").trim();
        const paymentUrl = sanitizeInput(formData.get("paymentUrl") || "").trim();
        const priceReference = JSON.parse(formData.get("priceReference") || "[]");
        const price = parseInt(sanitizeInput(formData.get("price") || "0"));
        const originalPrice = parseInt(sanitizeInput(formData.get("originalPrice") || "0"));
        const discountPercentage = parseInt(sanitizeInput(formData.get("discountPercentage") || "0"));
        const availableStatus = ["active", "inactive", "soldOut"].includes(formData.get("availableStatus"))
            ? formData.get("availableStatus")
            : "inactive";
        const accessIncludes = JSON.parse(formData.get("accessIncludes") || "[]");
        const validityPeriod = JSON.parse(formData.get("validityPeriod") || "{}");
        const applicableDate = sanitizeInput(formData.get("applicableDate") || "").trim();
        const passType = sanitizeInput(formData.get("passType") || "").trim();
        const venue = sanitizeInput(formData.get("venue") || "").trim();
        const updatedBy = decodedToken.id;

        // Validate price
        const expectedPrice = originalPrice - Math.round(originalPrice * (discountPercentage / 100));
        if (price !== expectedPrice) {
            return NextResponse.json(
                apiResponse({
                    message: `Expected price after ${discountPercentage}% discount is ${expectedPrice}, but received ${price}`,
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // Validate types
        if (!Array.isArray(priceReference)) throw new Error("priceReference must be an array");
        if (!Array.isArray(accessIncludes)) throw new Error("accessIncludes must be an array");
        if (typeof validityPeriod !== "object") throw new Error("validityPeriod must be an object");

        const updatedTicket = await Ticket.findByIdAndUpdate(ticketId, {
            name,
            subHeading,
            paymentUrl,
            priceReference,
            price,
            originalPrice,
            discountPercentage,
            availableStatus,
            accessIncludes,
            validityPeriod,
            applicableDate,
            passType,
            venue,
            updatedBy,
        }, { new: true });

        return NextResponse.json(
            apiResponse({
                message: "Ticket updated successfully",
                data: updatedTicket,
                statusCode: STATUS_CODES.SUCCESS,
            }),
            { status: STATUS_CODES.SUCCESS }
        );
    } catch (error) {
        handleError(error);
        return NextResponse.json(
            apiResponse({
                message: error.message || STATUS_CODES.INTERNAL_ERROR,
                statusCode: STATUS_CODES.INTERNAL_ERROR,
            }),
            { status: STATUS_CODES.INTERNAL_ERROR }
        );
    }
}
