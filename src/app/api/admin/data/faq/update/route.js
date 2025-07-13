import Faq from "@/Mongo/Model/DataModels/Faq";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { NextResponse } from "next/server";
import { handleError } from "@/Helper/errorHandler";
import sanitizeInput from "@/Helper/sanitizeInput";

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
        const faqId = sanitizeInput(searchParams.get("faqId"));

        const faq = await Faq.findById(faqId);
        if (!faq) {
            return NextResponse.json(apiResponse({
                message: "Faq not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        const formData = await req.formData();
        const question = sanitizeInput(formData.get("question")?.toString().trim());
        const answer = sanitizeInput(formData.get("answer")?.toString().trim());

        if (!question || !answer) {
            return NextResponse.json(apiResponse({
                message: "Missing required fields",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        faq.question = question;
        faq.answer = answer;
        faq.updatedBy = decodedToken.id;

        await faq.save();

        return NextResponse.json(apiResponse({
            message: "Faq updated successfully",
            data: faq,
            statusCode: STATUS_CODES.OK,
        }));
    } catch (error) {
        console.log(error);
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}