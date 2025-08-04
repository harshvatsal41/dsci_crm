import { NextResponse } from "next/server";
import Agenda from "@/Mongo/Model/DataModels/Agenda";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import util from "@/Helper/apiUtils";
import handleError from "@/Helper/errorHandler";
import sanitizeInput from "@/Helper/sanitizeInput";
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
                message: "Unauthorized: Employee not found",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        const { searchParams } = new URL(req.url);
        const agendaId = sanitizeInput(searchParams.get("agendaId"));

        const agenda = await Agenda.findById(agendaId);
        if (!agenda) {
            return NextResponse.json(apiResponse({
                message: "Agenda not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        agenda.isDeleted = true;
        agenda.updatedBy = user._id;

        await agenda.save();

        return NextResponse.json(apiResponse({
            message: "Agenda deleted successfully",
            data: agenda,
            statusCode: STATUS_CODES.DELETESUCCESS,
        }), { status: STATUS_CODES.DELETESUCCESS });
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}
        