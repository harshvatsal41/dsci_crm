module.exports = {

"[project]/.next-internal/server/app/api/admin/data/eventoutreach/[id]/route/actions.js [app-rsc] (server actions loader, ecmascript)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
}}),
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}}),
"[externals]/mongoose [external] (mongoose, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("mongoose", () => require("mongoose"));

module.exports = mod;
}}),
"[project]/src/Mongo/Model/DataModels/yeaslyEvent.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
const EventOutreachSchema = new __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema({
    title: {
        type: String,
        required: true
    },
    year: {
        type: Number,
        required: true
    },
    edition: {
        type: Number,
        required: true
    },
    websiteURL: {
        type: String
    },
    socialMediaLinks: {
        facebook: {
            type: String
        },
        instagram: {
            type: String
        },
        twitter: {
            type: String
        },
        linkedin: {
            type: String
        },
        youtube: {
            type: String
        }
    },
    dates: {
        start: {
            type: Date,
            required: true
        },
        end: {
            type: Date,
            required: true
        }
    },
    location: {
        address: {
            type: String,
            required: true
        },
        latitude: {
            type: Number
        },
        longitude: {
            type: Number
        },
        googleMapsLink: {
            type: String,
            required: true
        },
        city: {
            type: String,
            required: true
        },
        state: {
            type: String,
            required: true
        },
        country: {
            type: String,
            required: true
        },
        pincode: {
            type: String,
            required: true
        }
    },
    description: {
        type: String
    },
    createdBy: {
        type: __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, {
    timestamps: true
});
const __TURBOPACK__default__export__ = __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].models.EventOutreach || __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].model("EventOutreach", EventOutreachSchema);
}}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}}),
"[project]/src/Helper/response.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "STATUS_CODES": (()=>STATUS_CODES),
    "apiResponse": (()=>apiResponse)
});
const STATUS_CODES = {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    INTERNAL_ERROR: 500
};
function apiResponse({ message, data = null, error = null, statusCode, status = 'success' }) {
    return {
        message,
        data,
        error,
        status,
        statusCode
    };
}
}}),
"[project]/src/Helper/errorHandler.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "AppError": (()=>AppError),
    "handleError": (()=>handleError)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Helper/response.js [app-route] (ecmascript)");
;
class AppError extends Error {
    constructor(message, statusCode = 500){
        super(message);
        this.statusCode = statusCode;
        this.status = 'failed';
    }
}
const handleError = (err)=>{
    // Mongoose Validation Error
    if (err.name === 'ValidationError') {
        return {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiResponse"])({
                message: 'Validation Error',
                error: err.errors,
                statusCode: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].BAD_REQUEST,
                status: 'failed'
            }),
            httpStatus: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].BAD_REQUEST
        };
    }
    // Mongoose CastError (Invalid ID)
    if (err.name === 'CastError') {
        return {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiResponse"])({
                message: 'Invalid ID Format',
                error: {
                    field: err.path
                },
                statusCode: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].BAD_REQUEST,
                status: 'failed'
            }),
            httpStatus: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].BAD_REQUEST
        };
    }
    // Mongoose Duplicate Key Error
    if (err.code === 11000) {
        const field = Object.keys(err.keyPattern)[0];
        return {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiResponse"])({
                message: `Duplicate value for ${field}`,
                error: {
                    field,
                    value: err.keyValue[field]
                },
                statusCode: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].BAD_REQUEST,
                status: 'failed'
            }),
            httpStatus: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].BAD_REQUEST
        };
    }
    // JWT Error
    if (err.name === 'JsonWebTokenError') {
        return {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiResponse"])({
                message: 'Invalid token',
                error: {
                    type: 'JWT_ERROR',
                    details: err.message
                },
                statusCode: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].UNAUTHORIZED,
                status: 'failed'
            }),
            httpStatus: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].UNAUTHORIZED
        };
    }
    // Custom AppError
    if (err instanceof AppError) {
        return {
            ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiResponse"])({
                message: err.message,
                error: {
                    type: 'APP_ERROR',
                    details: err.message
                },
                statusCode: err.statusCode,
                status: err.status
            }),
            httpStatus: err.statusCode
        };
    }
    // Default Error
    console.error('Error:', err);
    return {
        ...(0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiResponse"])({
            message: 'Internal Server Error',
            error: ("TURBOPACK compile-time truthy", 1) ? {
                type: 'INTERNAL_ERROR',
                details: err.message
            } : ("TURBOPACK unreachable", undefined),
            statusCode: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].INTERNAL_ERROR,
            status: 'failed'
        }),
        httpStatus: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].INTERNAL_ERROR
    };
};
}}),
"[project]/src/Mongo/Lib/dbConnect.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/mongoose [external] (mongoose, cjs)");
;
let isConnected = false; // Maintain the connection state
const connectDB = async ()=>{
    if (isConnected) {
        console.log("Already connected to MongoDB");
        return;
    }
    if (!process.env.DB_USERNAME || !process.env.DB_PASSWORD) {
        throw new Error("Database credentials are missing in environment variables");
    }
    try {
        const db = await __TURBOPACK__imported__module__$5b$externals$5d2f$mongoose__$5b$external$5d$__$28$mongoose$2c$__cjs$29$__["default"].connect(process.env.DB_URI, {
            serverSelectionTimeoutMS: 30000,
            socketTimeoutMS: 30000
        });
        isConnected = db.connection.readyState === 1; // 1 means connected
        console.log("Connected to MongoDB");
    } catch (error) {
        console.error("Error connecting to MongoDB:", error.message);
        throw error;
    }
};
const __TURBOPACK__default__export__ = connectDB;
}}),
"[project]/src/Helper/apiUtils.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>__TURBOPACK__default__export__)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Mongo$2f$Lib$2f$dbConnect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Mongo/Lib/dbConnect.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Helper/response.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$errorHandler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Helper/errorHandler.js [app-route] (ecmascript)");
;
;
;
;
// Export as a default object
const util = {
    connectDB: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Mongo$2f$Lib$2f$dbConnect$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"],
    NextResponse: __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"],
    apiResponse: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiResponse"],
    STATUS_CODES: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"],
    handleError: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$errorHandler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleError"]
};
const __TURBOPACK__default__export__ = util;
}}),
"[project]/src/app/api/admin/data/eventoutreach/[id]/route.js [app-route] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "GET": (()=>GET)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Mongo$2f$Model$2f$DataModels$2f$yeaslyEvent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Mongo/Model/DataModels/yeaslyEvent.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Helper/response.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$errorHandler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Helper/errorHandler.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$apiUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Helper/apiUtils.js [app-route] (ecmascript)");
;
;
;
;
;
async function GET(req, { params }) {
    try {
        await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$apiUtils$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].connectDB();
        const { id } = params;
        const event = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Mongo$2f$Model$2f$DataModels$2f$yeaslyEvent$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].findById(id);
        if (!event) {
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiResponse"])({
                message: "Event not found",
                data: null,
                statusCode: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].NOT_FOUND
            }), {
                status: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].NOT_FOUND
            });
        }
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json((0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["apiResponse"])({
            message: "Event fetched successfully",
            data: event,
            statusCode: __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$response$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["STATUS_CODES"].OK
        }));
    } catch (error) {
        const handledError = (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$errorHandler$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["handleError"])(error);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json(handledError, {
            status: handledError.httpStatus
        });
    }
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__ef814d15._.js.map