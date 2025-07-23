import { NextResponse } from "next/server";
import util from "@/Helper/apiUtils";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import Role from "@/Mongo/Model/AcessModels/Role";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import sanitizeInput from "@/Helper/sanitizeInput";

export async function POST(req) {
  try {
    await util.connectDB();

    // Get token from cookie or Authorization header
    const token =
      req.cookies.get("dsciAuthToken")?.value ||
      req.headers.get("Authorization")?.split(" ")[1];

    const decodedToken = decodeTokenPayload(token);
    if (!decodedToken?.id) {
      return NextResponse.json(apiResponse({
        message: "Unauthorized: Invalid token",
        statusCode: STATUS_CODES.UNAUTHORIZED,
      }), { status: STATUS_CODES.UNAUTHORIZED });
    }

    // Find the employee
    const employee = await Employee.findById(decodedToken.id);
    if (!employee) {
      return NextResponse.json(apiResponse({
        message: "Unauthorized: Employee not found",
        statusCode: STATUS_CODES.UNAUTHORIZED,
      }), { status: STATUS_CODES.UNAUTHORIZED });
    }

    // Ensure only Admins can update roles
    const userRole = await Role.findById(employee.role);
    if (!userRole || userRole.name !== "Admin") {
      return NextResponse.json(apiResponse({
        message: "Unauthorized: Only Admins can update roles",
        statusCode: STATUS_CODES.UNAUTHORIZED,
      }), { status: STATUS_CODES.UNAUTHORIZED });
    }

    // Get roleId from query string
    const { searchParams } = new URL(req.url);
    const roleId = sanitizeInput(searchParams.get("roleId"));

    if (!roleId) {
      return NextResponse.json(apiResponse({
        message: "Missing roleId in query",
        statusCode: STATUS_CODES.BAD_REQUEST,
      }), { status: STATUS_CODES.BAD_REQUEST });
    }

    // Parse form-data
    const formData = await req.formData();
    const name = formData.get("name");
    const description = formData.get("description");
    const permissionsRaw = formData.get("permissions");

    if (!name || !permissionsRaw) {
      return NextResponse.json(apiResponse({
        message: "Missing required fields: name or permissions",
        statusCode: STATUS_CODES.BAD_REQUEST,
      }), { status: STATUS_CODES.BAD_REQUEST });
    }

    // Parse permissions JSON
    let permissions;
    try {
      permissions = JSON.parse(permissionsRaw);
    } catch (err) {
      return NextResponse.json(apiResponse({
        message: "Invalid permissions format (must be JSON string)",
        statusCode: STATUS_CODES.BAD_REQUEST,
      }), { status: STATUS_CODES.BAD_REQUEST });
    }

    // Fetch and validate role to be updated
    const existingRole = await Role.findById(roleId);
    if (!existingRole || existingRole.name === "Admin" || existingRole.isFixed) {
      return NextResponse.json(apiResponse({
        message: "Role not found or cannot be updated (Admin/Fixed role)",
        statusCode: STATUS_CODES.FORBIDDEN,
      }), { status: STATUS_CODES.FORBIDDEN });
    }

    // Update role
    const updatedRole = await Role.findByIdAndUpdate(roleId, {
      name,
      description,
      permissions,
      isFixed: false,
      updateBy: decodedToken.id,
    }, { new: true });

    return NextResponse.json(apiResponse({
      data: updatedRole,
      message: "Role updated successfully",
      statusCode: STATUS_CODES.UPDATESUCCESS,
    }), { status: STATUS_CODES.UPDATESUCCESS });

  } catch (err) {
    console.error("Role update error:", err);
    return NextResponse.json(apiResponse({
      message: "Something went wrong",
      statusCode: STATUS_CODES.INTERNAL_ERROR,
    }), { status: STATUS_CODES.INTERNAL_ERROR });
  }
}
