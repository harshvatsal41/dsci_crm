import Faq from "@/Mongo/Model/DataModels/Faq";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { NextResponse } from "next/server";
import { handleError } from "@/Helper/errorHandler";


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
        const faqId = searchParams.get("faqId");

        const faq = await Faq.findById(faqId);
        if (!faq) {
            return NextResponse.json(apiResponse({
                message: "Faq not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        faq.isDeleted = true;
        faq.deletedAt = new Date();
        faq.deletedBy = decodedToken.id;

        await faq.save();

        return NextResponse.json(apiResponse({
            message: "Faq deleted successfully",
            data: faq,
            statusCode: STATUS_CODES.OK,
        }));

    } catch (error) {
        return NextResponse.json(handleError(error), {
            status: STATUS_CODES.INTERNAL_ERROR,
        });
    }
}
