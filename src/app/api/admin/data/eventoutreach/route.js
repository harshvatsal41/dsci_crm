import EventOutreach from "@/Mongo/Model/DataModels/yeaslyEvent";
import { NextResponse } from "next/server";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { handleError } from "@/Helper/errorHandler";
import util from '@/Helper/apiUtils';

export async function GET() {
    try {
    await util.connectDB();
        
        const events = await EventOutreach.find({}).sort({ createdAt: -1 });
        // console.log('Fetched events:', events);
        
        return NextResponse.json(
            apiResponse({
                message: "Events fetched successfully",
                data: events,
                statusCode: STATUS_CODES.OK
            })
        );
    } catch (error) {
        const handledError = handleError(error);
        return NextResponse.json(
            handledError,
            { status: handledError.httpStatus }
        );
    }
}

export async function POST(request) {
    try {
        await util.connectDB();
        
        // Check for form-data instead of application/json
        const contentType = request.headers.get('content-type');
        if (!contentType || !contentType.includes('multipart/form-data')) {
            return NextResponse.json(
                apiResponse({
                    message: "Invalid content type. Expected multipart/form-data",
                    statusCode: STATUS_CODES.BAD_REQUEST
                }),
                { status: STATUS_CODES.BAD_REQUEST }
            );
        }
        
        // Parse FormData
        const formData = await request.formData();
        const body = {};
        
        // Convert FormData to object
        for (const [key, value] of formData.entries()) {
            // Handle nested objects
            if (key.includes('.')) {
                const [parent, child] = key.split('.');
                if (!body[parent]) body[parent] = {};
                body[parent][child] = value;
            } else {
                // Parse JSON strings for complex objects
                if (['dates', 'location', 'socialMediaLinks'].includes(key)) {
                    try {
                        body[key] = JSON.parse(value);
                    } catch (e) {
                        body[key] = value;
                    }
                } else {
                    body[key] = value;
                }
            }
        }
        
        // Rest of your validation and creation logic remains the same...
        const newEvent = await EventOutreach.create(body);
        
        return NextResponse.json(
            apiResponse({
                message: "Event created successfully",
                data: newEvent,
                statusCode: STATUS_CODES.CREATED
            }),
            { status: STATUS_CODES.CREATED }
        );
    } catch (error) {
        console.error('Error in POST:', error);
        const handledError = handleError(error);
        return NextResponse.json(
            handledError,
            { status: handledError.httpStatus }
        );
    }
}