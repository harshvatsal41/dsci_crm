import { NextResponse } from 'next/server';
import { isTokenExpired } from '@/Helper/jwtValidator';

export function middleware(request) {
    console.log("Middleware triggered");

    const token =  request.cookies.get("dsciAuthToken")?.value || request.headers.get("Authorization")?.split(" ")[1];
    const path = request.nextUrl.pathname;
    const isApiRoute = path.startsWith("/api/admin/data/");

    console.log("Token:", token);

    if (!token || isTokenExpired(token)) {
        if (isApiRoute) {
            return NextResponse.json(
                {
                    message: "Token not found or expired",
                    statusCode: 401,
                    status: "failed",
                },
                { status: 401 }
            );
        }
        else {
            return NextResponse.redirect(new URL('/logout', request.url));
        }
    }

    const protectedRoutes = ['/administration/profile', '/administration/dashboard'];


    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        if (!token || isTokenExpired(token)) {
            console.log("redirecting back")
            return NextResponse.redirect(new URL('/logout', request.url));
        }
    }

    return NextResponse.next();
}


export const config = {
    matcher: ['/administration/dashboard:path*','/api/admin/data/:path*'],
};
