// pages/api/auth/login.js
import dbConnect from "@/Mongo/Lib/dbConnect";
import jwt from "jsonwebtoken";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import { serialize } from 'cookie';

export async function POST(req) {
    try {
        await dbConnect();
        const { email, password } = await req.json();

        if (!email || !password) {
            return new Response(JSON.stringify({ error: "Email and password are required." }), { status: 400 });
        }

        const user = await Employee.findOne({ email });
        if (!user || !(await user.matchPassword(password))) {
            return new Response(JSON.stringify({ error: "Invalid credentials." }), { status: 401 });
        }

       const token = jwt.sign(
            { 
                id: user._id, 
                username: user.username, 
                email: user.email, 
                isAdmin: user.isAdmin, 
                role: "ADMIN" 
            },
            process.env.JWT_SECRET, 
            { expiresIn: "1hr" }
        );
        const cookie = serialize('dsciAuthToken', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: 60 * 60 , // 1 hour
            path: '/',
        });
        return new Response(JSON.stringify({
            message: "Login successful!",
            token,
            role: "ADMIN",
            user: { 
                id: user._id, 
                username: user.username, 
                email: user.email 
            },
            status: "success",
            statusCode: 200,
        }), { 
            status: 200,
            headers: {
                'Set-Cookie': cookie
            }
        });
    } catch (error) {
        console.error("Error in login endpoint:", error);
        return new Response(JSON.stringify({ error: "Something went wrong. Please try again." }), { status: 500 });
    }
}