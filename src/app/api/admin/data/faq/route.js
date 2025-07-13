import Faq from "@/Mongo/Model/DataModels/Faq";
import util from "@/Helper/apiUtils";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { NextResponse } from "next/server";
import { handleError } from "@/Helper/errorHandler";
import sanitizeInput from "@/Helper/sanitizeInput";

export async function GET(req) {
    try {
        await util.connectDB();
        const token = req.cookies.get("dsciAuthToken")?.value || req.headers.get("Authorization")?.split(" ")[1];

        const decodedToken = decodeTokenPayload(token);


        const { searchParams } = new URL(req.url);
        const eventId = sanitizeInput(searchParams.get("eventId"));

        const filter = {
            isDeleted: false,
        };

        if (eventId) {
            filter.eventId = eventId;
        }

        const faqs = await Faq.find(filter);

        return NextResponse.json(apiResponse({
            message: "Faqs fetched successfully",
            data: faqs,
            statusCode: STATUS_CODES.OK,
        }));
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
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

        const { searchParams } = new URL(req.url);
        const eventId = sanitizeInput(searchParams.get("eventId"));

        const formData = await req.formData();
        const question = sanitizeInput(formData.get("question")?.toString().trim());
        const answer = sanitizeInput(formData.get("answer")?.toString().trim());

        if (!question || !answer || !eventId) {
            return NextResponse.json(apiResponse({
                message: "Missing required fields",
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

        const faq = await Faq.create({
            question,
            answer,
            eventId,
            createdBy: decodedToken.id,
        });

        await EventOutreach.findByIdAndUpdate(
            eventId,
            { $push: { faqIds: faq._id } },
            { new: true }
        );

        return NextResponse.json(apiResponse({
            message: "Faq created successfully",
            data: faq,
            statusCode: STATUS_CODES.CREATED,
        }), { status: STATUS_CODES.CREATED });
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}