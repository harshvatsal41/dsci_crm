import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import CollabSubCategory from "@/Mongo/Model/DataModels/CollabSubCatagory";
import sanitizeInput from "@/Helper/sanitizeInput";
import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import Employee from "@/Mongo/Model/AcessModels/Employee";


export async function POST(req){
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
        const subCatagoryId = sanitizeInput(searchParams.get("subCatagoryId"));

        const formData = await req.formData();
        const title = sanitizeInput(formData.get("title"));
        const type = sanitizeInput(formData.get("type"));

        const eventId = sanitizeInput(formData.get("eventId"));

        if (!subCatagoryId || !title || !type || !eventId) {
            return NextResponse.json(apiResponse({
                message: "Sub Catagory ID, title, type and event ID are required",
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

       

        const collaborationsCatagory = await CollabSubCategory.findById(subCatagoryId);
        if (!collaborationsCatagory) {
            return NextResponse.json(apiResponse({
                message: "CollaborationsCatagory not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        if(collaborationsCatagory.isDeleted){
            return NextResponse.json(apiResponse({
                message: "CollaborationsCatagory already deleted you can't update the deleted catagory",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        collaborationsCatagory.title = title;
        collaborationsCatagory.type = type;
        collaborationsCatagory.updatedBy = user._id;

        await collaborationsCatagory.save();

        return NextResponse.json(apiResponse({
            message: "CollaborationsCatagory updated successfully",
            data: collaborationsCatagory,
            statusCode: STATUS_CODES.UPDATESUCCESS,
        }), { status: STATUS_CODES.UPDATESUCCESS });
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}   