import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import CollabSubCategory from "@/Mongo/Model/DataModels/CollabSubCatagory";
import sanitizeInput from "@/Helper/sanitizeInput";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import Employee from "@/Mongo/Model/AcessModels/Employee";

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

        const user = await Employee.findById(decodedToken.id);
        if (!user) {
            return NextResponse.json(apiResponse({
                message: "User not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        let filter = {
            isDeleted: false,
        };

        filter.yeaslyEventId = event._id;

        const collaborationsCatagory = await CollabSubCategory.find(filter);

        return NextResponse.json(apiResponse({
            message: "CollaborationsCatagory fetched successfully",
            data: collaborationsCatagory,
            statusCode: STATUS_CODES.SUCCESS,
        }), { status: STATUS_CODES.SUCCESS });
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

        const user = await Employee.findById(decodedToken.id);
        if (!user) {
            return NextResponse.json(apiResponse({
                message: "User not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
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

        const formData = await req.formData();
        const title = sanitizeInput(formData.get("title"));
        const type = sanitizeInput(formData.get("type"));

        if (!title || !type) {
            return NextResponse.json(apiResponse({
                message: "Title and type are required",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        const collaborationsCatagory = await CollabSubCategory.create({
            title,
            type,
            yeaslyEventId: event._id,
            createdBy: user._id,
        });

        await EventOutreach.findByIdAndUpdate(eventId,{
            $push: {
                sponsorGroups: {
                    subCategory: collaborationsCatagory._id,
                    sponsors: []
                }
            }
        });

        return NextResponse.json(apiResponse({
            message: "CollaborationsCatagory created successfully",
            data: collaborationsCatagory,
            statusCode: STATUS_CODES.CREATED,
        }), { status: STATUS_CODES.CREATED });
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}