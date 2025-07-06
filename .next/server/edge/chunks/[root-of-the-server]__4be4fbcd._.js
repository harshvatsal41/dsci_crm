(globalThis.TURBOPACK = globalThis.TURBOPACK || []).push(["chunks/[root-of-the-server]__4be4fbcd._.js", {

"[externals]/node:buffer [external] (node:buffer, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:buffer", () => require("node:buffer"));

module.exports = mod;
}}),
"[externals]/node:async_hooks [external] (node:async_hooks, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("node:async_hooks", () => require("node:async_hooks"));

module.exports = mod;
}}),
"[project]/src/Helper/jwtValidator.js [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "isTokenExpired": (()=>isTokenExpired),
    "verifyToken": (()=>verifyToken)
});
var __TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/node:buffer [external] (node:buffer, cjs)");
const isTokenExpired = (token)=>{
    if (!token || typeof token !== 'string') return true;
    try {
        const decoded = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(token.split('.')[1], 'base64').toString());
        const expiryTime = decoded.exp * 1000; // Convert to milliseconds
        return expiryTime < Date.now();
    } catch (error) {
        console.error('Error decoding token:', error);
        return true;
    }
};
const verifyToken = (token)=>{
    if (!token || typeof token !== 'string') {
        console.error('Invalid token provided:', token);
        return null;
    }
    try {
        const tokenParts = token.split('.');
        if (tokenParts.length !== 3) {
            console.error('Invalid token format:', token);
            return null;
        }
        const decoded = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$node$3a$buffer__$5b$external$5d$__$28$node$3a$buffer$2c$__cjs$29$__["Buffer"].from(tokenParts[1], 'base64').toString());
        return decoded;
    } catch (error) {
        console.error('Error decoding token:', error);
        return null;
    }
} //
 // export const isTokenExpired = (token) => {
 //     // Check if token is valid
 //     if (!token || typeof token !== 'string') {
 //         console.error('Invalid token provided:', token);
 //         return true; // Or handle the case as you see fit (e.g., return false or throw error)
 //     }
 //
 //     try {
 //         // Ensure the token contains three parts (header, payload, signature)
 //         const tokenParts = token.split('.');
 //         if (tokenParts.length !== 3) {
 //             console.error('Invalid token format:', token);
 //             return true;
 //         }
 //
 //         // Decode the payload (second part) of the JWT
 //         const decoded = JSON.parse(Buffer.from(tokenParts[1], 'base64').toString());
 //
 //         // Check if the decoded token has an expiry time
 //         const expiryTime = decoded.exp * 1000; // Convert expiry time to milliseconds
 //         return expiryTime < Date.now();
 //     } catch (error) {
 //         console.error('Error decoding token:', error);
 //         return true; // Return true if an error occurs while decoding
 //     }
 // };
;
}}),
"[project]/src/middleware.js [middleware-edge] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "config": (()=>config),
    "middleware": (()=>middleware)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$api$2f$server$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__$3c$module__evaluation$3e$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/api/server.js [middleware-edge] (ecmascript) <module evaluation>");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/esm/server/web/spec-extension/response.js [middleware-edge] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$jwtValidator$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/Helper/jwtValidator.js [middleware-edge] (ecmascript)");
;
;
function middleware(request) {
    console.log("Middleware triggered");
    let token = request.cookies.get('dsciAuthToken');
    console.log(token);
    const protectedRoutes = [
        '/administration/profile',
        '/administration/dashboard'
    ];
    if (protectedRoutes.some((route)=>request.nextUrl.pathname.startsWith(route))) {
        if (!token || (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$Helper$2f$jwtValidator$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["isTokenExpired"])(token.value)) {
            console.log("redirecting back");
            return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].redirect(new URL('/logout', request.url));
        }
    }
    return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$esm$2f$server$2f$web$2f$spec$2d$extension$2f$response$2e$js__$5b$middleware$2d$edge$5d$__$28$ecmascript$29$__["NextResponse"].next();
}
const config = {
    matcher: [
        '/administration/dashboard:path*'
    ]
};
}}),
}]);

//# sourceMappingURL=%5Broot-of-the-server%5D__4be4fbcd._.js.map