import dbConnect from "@/Mongo/Lib/dbConnect";
import jwt from "jsonwebtoken";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import Role from "@/Mongo/Model/AcessModels/Role";
import { serialize } from "cookie";
import { NextResponse } from "next/server";
import { apiResponse } from "@/Helper/response";
import { STATUS_CODES } from "@/Helper/response";

function transformPermissions(permissionsObj) {
  const result = {};
  for (const [module, actions] of Object.entries(permissionsObj)) {
    const allowedActions = [];
    for (const [action, isAllowed] of Object.entries(actions)) {
      if (isAllowed) allowedActions.push(action);
    }
    if (allowedActions.length) {
      result[module] = allowedActions;
    }
  }
  return result;
}

export async function POST(req) {
  try {
    await dbConnect();
    const { email, password } = await req.json();

    if (!email || !password) {
      return new Response(JSON.stringify({ error: "Email and password are required." }), { status: 400 });
    }

    const user = await Employee.findOne({ email }).populate("role");

    if(!user.isVerified || user.isDeleted){
        return NextResponse.json(apiResponse({
                message: "User is not verified Yet please verify the account and set The password or the account had been suspended",
                statusCode: STATUS_CODES.FORBIDDEN,
              }), { status: STATUS_CODES.FORBIDDEN });
    }

    if (!user || !(await user.matchPassword(password))) {
      return NextResponse.json(apiResponse({
        message: "Invalid credentials.",
        statusCode: STATUS_CODES.NOT_FOUND,
      }), { status: STATUS_CODES.NOT_FOUND });
    }

    // Transform permissions
    const transformedPermissions = user.role ? transformPermissions(user.role.permissions) : {};

    // Create JWT
    const token = jwt.sign(
      {
        id: user._id,
        username: user.username,
        email: user.email,
        isSuperAdmin: user.isSuperAdmin,
        role: user.role?.name || "User",
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    // Cookie setup
    const cookie = serialize("dsciAuthToken", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 60 * 60, // 1 hour
      path: "/",
    });
    console.log(transformedPermissions)

    return new Response(
      JSON.stringify({
        message: "Login successful!",
        token,
        role: user.role?.name || "User",
        user: {
          id: user._id,
          username: user.username,
          email: user.email,
          isSuperAdmin: user.isSuperAdmin,
          permissions: transformedPermissions,
        },
        status: "success",
        statusCode: 200,
      }),
      {
        status: 200,
        headers: {
          "Set-Cookie": cookie,
        },
      }
    );
  } catch (error) {
    return NextResponse.json(apiResponse({
      message: "Something went wrong. Please try again.",
      statusCode: STATUS_CODES.INTERNAL_ERROR,
    }), { status: STATUS_CODES.INTERNAL_ERROR });
  }
}
