import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import Ticket from "@/Mongo/Model/DataModels/Ticket";
import sanitizeInput from "@/Helper/sanitizeInput";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import { fillOffset } from "framer-motion";

export async function GET(req) {
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
        const eventId = sanitizeInput(searchParams.get("eventId"));

        if (!eventId) {
            return NextResponse.json(
                apiResponse({
                    message: "Event ID is required",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        const filter = {
            isDeleted: false,
        };

        

        const event = await EventOutreach.findById(eventId);
        if (!event) {
            return NextResponse.json(
                apiResponse({
                    message: "Event not found",
                    statusCode: STATUS_CODES.NOT_FOUND,
                }),
                { status: STATUS_CODES.NOT_FOUND }
            );
        }

        if (eventId) {
            filter.yeaslyEventId = event._id;
        }

        const tickets = await Ticket.find(filter);

        return NextResponse.json(
            apiResponse({
                message: "Tickets fetched successfully",
                data: tickets,
                statusCode: STATUS_CODES.SUCCESS,
            }),
            { status: STATUS_CODES.SUCCESS }
        );
    } catch (error) {
        console.error(error);

        handleError(error);
        return NextResponse.json(
            apiResponse({
                message: error.message || "Internal server error",
                httpStatus: error.statusCode || 500,
            })
        );
    }
}

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
        const eventId = sanitizeInput(searchParams.get("eventId"));

        if (!eventId) {
            return NextResponse.json(
                apiResponse({
                    message: "Event ID is required",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        const event = await EventOutreach.findById(eventId);
        if (!event) {
            return NextResponse.json(
                apiResponse({
                    message: "Event not found",
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
        const price = sanitizeInput(formData.get("price") || "").trim();
        const originalPrice = sanitizeInput(formData.get("originalPrice") || "").trim();
        const discountPercentage = sanitizeInput(formData.get("discountPercentage") || "").trim();
        const availableStatus = ["active", "inactive", "soldOut"].includes(formData.get("availableStatus"))
        ? formData.get("availableStatus")
        : "inactive";
        const accessIncludes = JSON.parse(formData.get("accessIncludes") || "[]");
        const validityPeriod = JSON.parse(formData.get("validityPeriod") || "{}");
        const applicableDate = sanitizeInput(formData.get("applicableDate") || "").trim();
        const passType = sanitizeInput(formData.get("passType") || "").trim();
        const venue = sanitizeInput(formData.get("venue") || "").trim();
        const yeaslyEventId = sanitizeInput(formData.get("yeaslyEventId") || "").trim();
        const createdBy = decodedToken.id;

        filter = {
            isDeleted: false,
        };

        filter.paymentUrl = paymentUrl;
        ticketDoc = await Ticket.find(filter);
        if (ticketDoc){
            return NextResponse.json(
                apiResponse({
                    message: "Ticket already exists with this payment link",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // Calculate expected discounted price
        const expectedPrice = originalPrice - Math.round(originalPrice * (discountPercentage / 100));

        // Validate discounted price
        if (Number(price) !== Number(expectedPrice)) {
            return NextResponse.json(
                apiResponse({
                    message: `Expected price after ${discountPercentage}% discount is ${expectedPrice}, but received ${price}`,
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        if (!Array.isArray(priceReference)) throw new Error("priceReference must be an array");

        if (!Array.isArray(accessIncludes)) throw new Error("accessIncludes must be an array");

        if (typeof validityPeriod !== 'object') throw new Error("validityPeriod must be an object");




        const ticket = await Ticket.create({
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
            createdBy,
            yeaslyEventId:eventId,
        });


        await EventOutreach.findByIdAndUpdate(eventId, {
            $push: { ticketIds: ticket._id },
        });

        return NextResponse.json(
            apiResponse({
                message: "Ticket created successfully",
                data: ticket,
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