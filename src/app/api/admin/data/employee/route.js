import { NextResponse } from "next/server";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { decodeTokenPayload } from "@/Helper/jwtValidator";
import Employee from "@/Mongo/Model/AcessModels/Employee";
import sanitizeInput from "@/Helper/sanitizeInput";
import util from "@/Helper/apiUtils";
import Role from "@/Mongo/Model/AcessModels/Role";

// ==========================
// GET: Get All Employees (Admin Only)
// ==========================
export async function GET(req) {
    try {
        await util.connectDB();

        const token =
            req.cookies.get("dsciAuthToken")?.value ||
            req.headers.get("Authorization")?.split(" ")[1];

        const decodedToken = decodeTokenPayload(token);
        if (!decodedToken?.id) {
            return NextResponse.json(apiResponse({
                message: "Unauthorized: Invalid or missing token",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        const employeeAdmin = await Employee.findById(decodedToken.id);
        if (!employeeAdmin) {
            return NextResponse.json(apiResponse({
                message: "Unauthorized: Employee not found",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        const roleAdmin = await Role.findById(employeeAdmin.role);
        if (!roleAdmin || roleAdmin.name !== "Admin") {
            return NextResponse.json(apiResponse({
                message: "Unauthorized: Only Admins can view all employees",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        const employees = await Employee.find();
        return NextResponse.json(apiResponse({
            data: employees,
            statusCode: STATUS_CODES.SUCCESS,
        }), { status: STATUS_CODES.SUCCESS });

    } catch (error) {
        console.error("Error fetching employees:", error);
        return NextResponse.json(apiResponse({
            message: "Failed to fetch employees",
            statusCode: STATUS_CODES.INTERNAL_ERROR,
        }), { status: STATUS_CODES.INTERNAL_ERROR });
    }
}

// ==========================
// POST: Update Employee by ID (Admin Only)
// ==========================
export async function POST(req) {
    try {
        await util.connectDB();

        const token =
            req.cookies.get("dsciAuthToken")?.value ||
            req.headers.get("Authorization")?.split(" ")[1];

        const decodedToken = decodeTokenPayload(token);
        if (!decodedToken?.id) {
            return NextResponse.json(apiResponse({
                message: "Unauthorized: Invalid or missing token",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        const employeeAdmin = await Employee.findById(decodedToken.id);
        if (!employeeAdmin) {
            return NextResponse.json(apiResponse({
                message: "Unauthorized: Employee not found",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        const roleAdmin = await Role.findById(employeeAdmin.role);
        if (!roleAdmin || roleAdmin.name !== "Admin") {
            return NextResponse.json(apiResponse({
                message: "Unauthorized: Only Admins can update employees",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        const { searchParams } = new URL(req.url);
        const employeeId = searchParams.get("employeeId");

        if (!employeeId) {
            return NextResponse.json(apiResponse({
                message: "Missing employeeId",
                statusCode: STATUS_CODES.BAD_REQUEST,
            }), { status: STATUS_CODES.BAD_REQUEST });
        }

        const employee = await Employee.findById(employeeId);
        if (!employee) {
            return NextResponse.json(apiResponse({
                message: "Employee not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }

        if(employee.isSuperAdmin){
            return NextResponse.json(apiResponse({
                message: "Unauthorized: Super Admin cannot be updated",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        const formData = await req.formData();

        const isVerified = formData.get("isVerified");
        const roleId = formData.get("roleId");
        const role = await Role.findById(roleId);
        if(!role){
            return NextResponse.json(apiResponse({
                message: "Role not found",
                statusCode: STATUS_CODES.NOT_FOUND,
            }), { status: STATUS_CODES.NOT_FOUND });
        }
        if(role.isFixed || role.isDeleted || role.name === "Admin"){
            return NextResponse.json(apiResponse({
                message: "Unauthorized: Fixed roles cannot be updatedor assighned to the Person",
                statusCode: STATUS_CODES.UNAUTHORIZED,
            }), { status: STATUS_CODES.UNAUTHORIZED });
        }

        employee.role = role._id;
        employee.isVerified = isVerified;

        await employee.save(); // ✅ Await save!

        return NextResponse.json(apiResponse({
            message: "Employee updated successfully",
            data: employee,
            statusCode: STATUS_CODES.SUCCESS,
        }), { status: STATUS_CODES.SUCCESS });

    } catch (error) {
        console.error("Error updating employee:", error);
        return NextResponse.json(apiResponse({
            message: "Failed to update employee",
            statusCode: STATUS_CODES.INTERNAL_ERROR,
        }), { status: STATUS_CODES.INTERNAL_ERROR });
    }
}
