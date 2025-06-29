import { NextResponse } from 'next/server';
import { isTokenExpired } from '@/Helper/jwtValidator';

export function middleware(request) {
    console.log("Middleware triggered");

    let token = request.cookies.get('dsciAuthToken');
    console.log(token);
    const protectedRoutes = ['/administration/profile', '/administration/dashboard'];


    if (protectedRoutes.some(route => request.nextUrl.pathname.startsWith(route))) {
        if (!token || isTokenExpired(token.value)) {
            console.log("redirecting back")
            return NextResponse.redirect(new URL('/logout', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/administration/dashboard:path*'],
};

