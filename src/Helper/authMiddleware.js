import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { apiResponse, STATUS_CODES } from "./response";
import { AppError } from "./errorHandler";

const JWT_SECRET_KEY = process.env.JWT_SECRET;

export const validateAuthToken = async (req) => {
    try {
        const token = req.cookies.get("rsvAuthToken")?.value;
        if (!token) {
            throw new AppError("Authentication token is required", STATUS_CODES.UNAUTHORIZED);
        }                

        try {
            const decoded = jwt.verify(token, JWT_SECRET_KEY);
            if (!decoded) {
                throw new AppError("Invalid authentication token", STATUS_CODES.UNAUTHORIZED);
            }

            if (!decoded.role || !['admin', 'superadmin'].includes(decoded.role)) {
                throw new AppError("You don't have permission to perform this action", STATUS_CODES.FORBIDDEN);
            }
            
            req.user = {
                id: decoded.id,
                email: decoded.email,
                role: decoded.role
            };

            return true;
        } catch (error) {
            if (error instanceof AppError) throw error;
            throw new AppError("Invalid or expired token", STATUS_CODES.UNAUTHORIZED);
        }
    } catch (error) {
        throw error;
    }
};

// Higher order function to wrap route handlers with authentication
export const withAuth = (handler) => async (req) => {
    try {
        await validateAuthToken(req);
        return handler(req);
    } catch (error) {
        const response = apiResponse({
            message: error.message,
            error: { type: 'AUTH_ERROR', details: error.message },
            status: 'failed',
            statusCode: error.statusCode || STATUS_CODES.UNAUTHORIZED
        });
        return NextResponse.json(response, { 
            status: error.statusCode || STATUS_CODES.UNAUTHORIZED 
        });
    }
}; 