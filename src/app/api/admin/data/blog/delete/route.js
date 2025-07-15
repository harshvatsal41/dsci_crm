import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import { handleError } from "@/Helper/errorHandler";
import Blog from "@/Mongo/Model/DataModels/Blog";
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
        const blogId = sanitizeInput(searchParams.get("blogId"));

        if (!blogId) {
            return NextResponse.json(
                apiResponse({
                    message: "Blog ID is required",
                    statusCode: STATUS_CODES.BAD_REQUEST,
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }

        const blog = await Blog.findById(blogId);
        if (!blog) {
            return NextResponse.json(
                apiResponse({
                    message: "Blog not found",
                    statusCode: STATUS_CODES.NOT_FOUND,
                }),
                { status: STATUS_CODES.NOT_FOUND }
            );
        }

        blog.isDeleted = true;
        blog.deletedAt = new Date();
        blog.deletedBy = decodedToken.id;

        await blog.save();

        return NextResponse.json(
            apiResponse({
                message: "Blog deleted successfully",
                statusCode: STATUS_CODES.DELETESUCCESS,
            }),
            { status: STATUS_CODES.DELETESUCCESS }
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

