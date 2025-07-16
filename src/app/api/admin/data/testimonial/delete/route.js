import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import Testimonial from "@/Mongo/Model/DataModels/Testimonial";
import sanitizeInput from "@/Helper/sanitizeInput";

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
        
        const { searchParams } = new URL(req.url);
        const id = sanitizeInput(searchParams.get("testimonialId"));

        const testimonial = await Testimonial.findById(id);
        if (!testimonial) {
            return NextResponse.json(apiResponse({
                message: "Testimonial not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        if(testimonial.isDeleted){
            return NextResponse.json(apiResponse({
                message: "Testimonial already deleted",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        if(testimonial.isDeleted){
            return NextResponse.json(apiResponse({
                message: "Testimonial already deleted",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        testimonial.isDeleted = true;
        testimonial.deletedAt = new Date();
        testimonial.deletedBy = decodedToken.id;

        await testimonial.save();

        return NextResponse.json(apiResponse({
            message: "Testimonial deleted successfully",
            data: testimonial,
            statusCode: STATUS_CODES.DELETEDSUCCESS,
        }));
    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}
        