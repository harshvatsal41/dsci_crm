import { NextResponse } from "next/server";
import dbConnect from "@/Mongo/Lib/dbConnect";
import sanitizeInput from "@/Helper/sanitizeInput";
import { apiResponse, STATUS_CODES } from "@/Helper/response";  
import { decodeTokenPayload } from "@/Helper/jwtValidator"; 
import util from "@/Helper/apiUtils";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import handleError from "@/Helper/errorHandler";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import Speaker from "@/Mongo/Model/DataModels/Speaker";
import Company from "@/Mongo/Model/DataModels/Collaboration";
import Agenda from "@/Mongo/Model/DataModels/Agenda";


export const dynamic = "force-dynamic";
function validateSessions(sessions) {
    if (!Array.isArray(sessions)) return null;
    
    for (const session of sessions) {
        if (!session.sessionSpeakers || session.sessionSpeakers.length === 0) {
            return {
                message: "Each session must have at least one speaker",
                field: "session.sessionSpeakers"
            };
        }
        
        if (session.sessionCollaborations) {
            for (const collab of session.sessionCollaborations) {
                if (!collab.company) {
                    return {
                        message: "Each collaboration must specify a company",
                        field: "session.sessionCollaborations.company"
                    };
                }
            }
        }
    }
    return null;
}

function validateRequiredFields(body, requiredFields) {
    return requiredFields.filter((field) => !body[field]);
}

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

        const { searchParams } = new URL(req.url);
        const eventId = sanitizeInput(searchParams.get("eventId"));

        if (!eventId) {
            return NextResponse.json(apiResponse({
                message: "Missing required query parameter: eventId",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        const agendas = await Agenda.find({ yeaslyEventId: eventId, isDeleted: false })

        return NextResponse.json(apiResponse({
            message: "Agendas fetched successfully",
            data: agendas,
            statusCode: STATUS_CODES.SUCCESS,
        }), { status: STATUS_CODES.SUCCESS });

    } catch (error) {
        console.error("GET /api/agenda error:", error);
        return NextResponse.json(
            apiResponse({
                message: error.message || "Internal server error",
                statusCode: error.statusCode || STATUS_CODES.INTERNAL_ERROR,
            }), {
            status: error.statusCode || STATUS_CODES.INTERNAL_ERROR,
        });
    }
}

export async function POST(req) {
    try {
        await dbConnect();

        // Authentication
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

        // Parse form data
        const formData = await req.formData();
        const rawData = {
            title: formData.get("title"),
            description: formData.get("description"),
            yeaslyEventId: formData.get("yeaslyEventId"),
            day: formData.get("day"),
            date: formData.get("date"),
            type: formData.get("type"),
            startTime: formData.get("startTime"),
            endTime: formData.get("endTime"),
            category: formData.get("category"),
            session: formData.get("session"),
        };

        // Convert stringified JSON fields
        try {
            if (rawData.category) rawData.category = JSON.parse(rawData.category);
            if (rawData.session) rawData.session = JSON.parse(rawData.session);
        } catch (e) {
            return NextResponse.json(
                apiResponse({
                    message: "Invalid JSON format in category or session fields",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // Validate required fields
        const requiredFields = [
            "title", "yeaslyEventId", "day", "date", 
            "category", "type", "startTime", "endTime"
        ];
        
        const missingFields = validateRequiredFields(rawData, requiredFields);
        if (missingFields.length > 0) {
            return NextResponse.json(
                apiResponse({
                    message: `Missing required fields: ${missingFields.join(", ")}`,
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // Validate sessions
        const sessionError = validateSessions(rawData.session);
        if (sessionError) {
            return NextResponse.json(
                apiResponse({
                    message: sessionError.message,
                    field: sessionError.field,
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // Sanitize and transform data
        const agendaData = {
            title: sanitizeInput(rawData.title),
            description: rawData.description ? sanitizeInput(rawData.description) : undefined,
            yeaslyEventId: sanitizeInput(rawData.yeaslyEventId),
            day: sanitizeInput(rawData.day),
            date: new Date(rawData.date),
            category: rawData.category.map(cat => sanitizeInput(cat)),
            type: sanitizeInput(rawData.type),
            startTime: new Date(rawData.startTime),
            endTime: new Date(rawData.endTime),
            session: rawData.session?.map(s => ({
                sessionTitle: s.sessionTitle ? sanitizeInput(s.sessionTitle) : undefined,
                sessionDescription: s.sessionDescription ? sanitizeInput(s.sessionDescription) : undefined,
                sessionInstructions: s.sessionInstructions?.map(inst => sanitizeInput(inst)),
                sessionLocation: s.sessionLocation ? sanitizeInput(s.sessionLocation) : undefined,
                sessionSpeakers: s.sessionSpeakers.map(spk => sanitizeInput(spk)),
                sessionCollaborations: s.sessionCollaborations?.map(c => ({
                    head: c.head ? sanitizeInput(c.head) : undefined,
                    company: sanitizeInput(c.company)
                })),
                tags: s.tags?.map(t => sanitizeInput(t))
            })),
            createdBy: decodedToken.id
        };

        // Validate time logic
        if (agendaData.endTime <= agendaData.startTime) {
            return NextResponse.json(
                apiResponse({
                    message: "End time must be after start time",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // Check for time conflicts
        const timeConflict = await Agenda.findOne({
            yeaslyEventId: agendaData.yeaslyEventId,
            $or: [
                { 
                    startTime: { $lt: agendaData.endTime }, 
                    endTime: { $gt: agendaData.startTime } 
                }
            ]
        });

        // if (timeConflict) {
        //     return NextResponse.json(
        //         apiResponse({
        //             message: `Time slot conflicts with "${timeConflict.title}" (${timeConflict.startTime.toLocaleTimeString()} - ${timeConflict.endTime.toLocaleTimeString()})`,
        //             conflictingItem: {
        //                 id: timeConflict._id,
        //                 title: timeConflict.title,
        //                 startTime: timeConflict.startTime,
        //                 endTime: timeConflict.endTime
        //             },
        //             statusCode: STATUS_CODES.CONFLICT,
        //         }),
        //         { status: STATUS_CODES.CONFLICT }
        //     );
        // }

        // Create agenda
        const newAgenda = await Agenda.create(agendaData);

        // Populate references for response
        const populatedAgenda = newAgenda;

        return NextResponse.json(
            apiResponse({
                message: "Agenda created successfully",
                data: populatedAgenda,
                statusCode: STATUS_CODES.CREATED,
            }),
            { status: STATUS_CODES.CREATED }
        );

    } catch (error) {
        console.error("POST /api/agenda error:", error);

        // Handle duplicate key errors
        if (error.code === 11000) {
            return NextResponse.json(
                apiResponse({
                    message: "Agenda with similar details already exists",
                    statusCode: STATUS_CODES.CONFLICT,
                }),
                { status: STATUS_CODES.CONFLICT }
            );
        }

        // Handle validation errors
        if (error.name === 'ValidationError') {
            const messages = Object.values(error.errors).map(val => val.message);
            return NextResponse.json(
                apiResponse({
                    message: `Validation error: ${messages.join(", ")}`,
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        // Handle CastError (invalid ID format)
        if (error.name === 'CastError') {
            return NextResponse.json(
                apiResponse({
                    message: `Invalid ID format for ${error.path}`,
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        return NextResponse.json(
            apiResponse({
                message: "Internal server error",
                statusCode: STATUS_CODES.INTERNAL_ERROR,
            }),
            { status: STATUS_CODES.INTERNAL_ERROR }
        );
    }
}