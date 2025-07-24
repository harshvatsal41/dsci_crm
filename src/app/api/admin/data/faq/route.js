import Faq from "@/Mongo/Model/DataModels/Faq";
import util from "@/Helper/apiUtils";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { NextResponse } from "next/server";
import { handleError } from "@/Helper/errorHandler";
import sanitizeInput from "@/Helper/sanitizeInput";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import decodeTokenPayload from "@/Helper/jwtValidator";
import sanitizeInput from "@/Helper/sanitizeInput";

export async function GET(req) {
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

        const user = await Employee.findById(decodedToken.id);
        if (!user) {
            return NextResponse.json(apiResponse({
                message: "User not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }


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
            return NextResponse.json(apiResponse({
                message: "Unauthorized: Invalid or missing token",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        const formData = await req.formData();

        const title = sanitizeInput(formData.get("title"));
        const description = sanitizeInput(formData.get("description"));
        const yeaslyEventId = sanitizeInput(formData.get("yeaslyEventId"));
        const day = sanitizeInput(formData.get("day"));
        const date = new Date(sanitizeInput(formData.get("date")));
        const type = sanitizeInput(formData.get("type"));
        const startTime = new Date(sanitizeInput(formData.get("startTime")));
        const endTime = new Date(sanitizeInput(formData.get("endTime")));

        const category = JSON.parse(sanitizeInput(formData.get("category"))); // expects stringified array
        const rawSession = sanitizeInput(formData.get("session")); // expects JSON stringified session array
        const session = rawSession ? JSON.parse(rawSession) : [];

        if (isNaN(date.getTime()) || isNaN(startTime.getTime()) || isNaN(endTime.getTime())) {
            return NextResponse.json(apiResponse({
                message: "Invalid date/time format",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        if (endTime <= startTime) {
            return NextResponse.json(apiResponse({
                message: "End time must be after start time",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        const sanitizedSessions = session.map(sessionItem => ({
            sessionTitle: sanitizeInput(sessionItem.sessionTitle),
            sessionDescription: sanitizeInput(sessionItem.sessionDescription),
            sessionInstructions: sessionItem.sessionInstructions?.map(sanitizeInput),
            sessionLocation: sanitizeInput(sessionItem.sessionLocation),
            sessionSpeakers: sessionItem.sessionSpeakers?.map(sanitizeInput),
            sessionCollaborations: sessionItem.sessionCollaborations?.map(collab => ({
                head: sanitizeInput(collab.head),
                company: sanitizeInput(collab.company),
            })),
            tags: sessionItem.tags?.map(sanitizeInput)
        }));

        const agendaData = {
            title,
            description,
            yeaslyEventId,
            day,
            date,
            type,
            startTime,
            endTime,
            category,
            session: sanitizedSessions,
            createdBy: decodedToken.id
        };

        const newAgenda = await Agenda.create(agendaData);

        const populatedAgenda = await Agenda.findById(newAgenda._id)
            .populate("yeaslyEventId")
            .populate("createdBy", "name email")
            .populate("session.sessionSpeakers", "name designation")
            .populate("session.sessionCollaborations.company", "companyName logo");

        return NextResponse.json(apiResponse({
            message: "Agenda created successfully",
            data: populatedAgenda,
            statusCode: STATUS_CODES.CREATED,
        }), { status: STATUS_CODES.CREATED });

    } catch (error) {
        console.error("POST /api/agenda error:", error);

        if (error.code === 11000) {
            return NextResponse.json(apiResponse({
                message: "Agenda with similar details already exists",
                statusCode: STATUS_CODES.CONFLICT,
            }), { status: STATUS_CODES.CONFLICT });
        }

        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return NextResponse.json(apiResponse({
                message: `Validation error: ${messages.join(', ')}`,
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        return NextResponse.json(apiResponse({
            message: error.message || "Internal server error",
            statusCode: error.statusCode || STATUS_CODES.INTERNAL_ERROR,
        }), { status: error.statusCode || STATUS_CODES.INTERNAL_ERROR });
    }
}