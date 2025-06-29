import { apiResponse, STATUS_CODES } from '@/Helper/response';

export class AppError extends Error {
    constructor(message, statusCode = 500) {
        super(message);
        this.statusCode = statusCode;
        this.status = 'failed';
    }
}

export const handleError = (err) => {
    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        return {
            ...apiResponse({
                message: 'Validation Error',
                error: err.errors,
                statusCode: STATUS_CODES.BAD_REQUEST,
                status: 'failed'
            }),
            httpStatus: STATUS_CODES.BAD_REQUEST
        };
    }

    // Mongoose CastError (Invalid ID)
    if (err.name === 'CastError') {
        return {
            ...apiResponse({
                message: 'Invalid ID Format',
                error: { field: err.path },
                statusCode: STATUS_CODES.BAD_REQUEST,
                status: 'failed'
            }),
            httpStatus: STATUS_CODES.BAD_REQUEST
        };
    }

    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return {
            ...apiResponse({
                message: `Duplicate value for ${field}`,
                error: { field, value: err.keyValue[field] },
                statusCode: STATUS_CODES.BAD_REQUEST,
                status: 'failed'
            }),
            httpStatus: STATUS_CODES.BAD_REQUEST
        };
    }

    // JWT Error
    if (err.name === 'JsonWebTokenError') {
        return {
            ...apiResponse({
                message: 'Invalid token',
                error: { type: 'JWT_ERROR', details: err.message },
                statusCode: STATUS_CODES.UNAUTHORIZED,
                status: 'failed'
            }),
            httpStatus: STATUS_CODES.UNAUTHORIZED
        };
    }

    // Custom AppError
    if (err instanceof AppError) {
        return {
            ...apiResponse({
                message: err.message,
                error: { type: 'APP_ERROR', details: err.message },
                statusCode: err.statusCode,
                status: err.status
            }),
            httpStatus: err.statusCode
        };
    }

    // Default Error
    console.error('Error:', err);
    return {
        ...apiResponse({
            message: 'Internal Server Error',
            error: process.env.NODE_ENV === 'development' ? 
                { type: 'INTERNAL_ERROR', details: err.message } : 
                { type: 'INTERNAL_ERROR' },
            statusCode: STATUS_CODES.INTERNAL_ERROR,
            status: 'failed'
        }),
        httpStatus: STATUS_CODES.INTERNAL_ERROR
    };
}; 