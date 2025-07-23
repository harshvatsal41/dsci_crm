import { NextRequest, NextResponse } from "next/server";
import Role from "@/Mongo/Model/AcessModels/Role";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import sanitizeInput from "@/Helper/sanitizeInput";
import util from "@/Helper/apiUtils";

// GET all roles - only Admin
export async function GET(req) {
  try {
    await util.connectDB();

    const token =
      req.cookies.get("dsciAuthToken")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

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

    const employee = await Employee.findById(decodedToken.id);
    if (!employee) {
      return NextResponse.json(
        apiResponse({
          message: "Unauthorized: Employee not found",
          statusCode: STATUS_CODES.UNAUTHORIZED,
        }),
        { status: STATUS_CODES.UNAUTHORIZED }
      );
    }

    const role = await Role.findById(employee.role);
    if (!role || role.name !== "Admin") {
      return NextResponse.json(
        apiResponse({
          message: "Unauthorized: Only Admins can view all roles",
          statusCode: STATUS_CODES.UNAUTHORIZED,
        }),
        { status: STATUS_CODES.UNAUTHORIZED }
      );
    }

    const roles = await Role.find();
    return NextResponse.json(apiResponse({ data: roles }));
  } catch (error) {
    console.error("Error fetching roles:", error);
    return NextResponse.json(
      apiResponse({
        message: "Failed to fetch roles",
        statusCode: STATUS_CODES.INTERNAL_ERROR,
      }),
      { status: STATUS_CODES.INTERNAL_ERROR }
    );
  }
}

// POST a new role
export async function POST(req) {
  try {
    await util.connectDB();

    const token =
      req.cookies.get("dsciAuthToken")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    const decodedToken = decodeTokenPayload(token);
    if (!decodedToken?.id) {
      return NextResponse.json(
        apiResponse({
          message: "Unauthorized: Invalid token",
          statusCode: STATUS_CODES.UNAUTHORIZED,
        }),
        { status: STATUS_CODES.UNAUTHORIZED }
      );
    }

    const employee = await Employee.findById(decodedToken.id);
    if (!employee) {
      return NextResponse.json(
        apiResponse({
          message: "Unauthorized: Employee not found",
          statusCode: STATUS_CODES.UNAUTHORIZED,
        }),
        { status: STATUS_CODES.UNAUTHORIZED }
      );
    }

    const role = await Role.findById(employee.role);
    if (!role || role.name !== "Admin") {
      return NextResponse.json(
        apiResponse({
          message: "Unauthorized: Only Admins can create roles",
          statusCode: STATUS_CODES.UNAUTHORIZED,
        }),
        { status: STATUS_CODES.UNAUTHORIZED }
      );
    }

    const formData = await req.formData();
    const name = sanitizeInput(formData.get("name"));
    const description = sanitizeInput(formData.get("description"));
    const permissionsRaw = sanitizeInput(formData.get("permissions"));

    console.log(name, description, permissionsRaw);

    if (!name || !permissionsRaw) {
      return NextResponse.json(
        apiResponse({
          message: "Missing required fields",
          statusCode: STATUS_CODES.BAD_REQUEST,
        }),
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    let permissions;
    try {
      permissions = JSON.parse(permissionsRaw);
    } catch (err) {
      return NextResponse.json(
        apiResponse({
          message: "Invalid permissions JSON",
          statusCode: STATUS_CODES.BAD_REQUEST,
        }),
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    if(name == "Admin"){
      return NextResponse.json(
        apiResponse({
          message: "Admin role cannot be created",
          statusCode: STATUS_CODES.BAD_REQUEST,
        }),
        { status: STATUS_CODES.BAD_REQUEST }
      );
    }

    const newRole = await Role.create({
      name,
      description,
      permissions,
      isFixed: false,
      createdBy: decodedToken.id,
      createdAt: new Date(),
    });

    return NextResponse.json(
      apiResponse({
        data: newRole,
        message: "Role created successfully",
        statusCode: STATUS_CODES.CREATED,
      }),
      { status: STATUS_CODES.CREATED }
    );
  } catch (error) {
    console.error("Error creating role:", error);
    return NextResponse.json(
      apiResponse({
        message: "Failed to create role",
        statusCode: STATUS_CODES.INTERNAL_ERROR,
      }),
      { status: STATUS_CODES.INTERNAL_ERROR }
    );
  }
}
