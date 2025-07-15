import connectDB from "@/Mongo/Lib/dbConnect";
import { NextResponse } from "next/server";
import { apiResponse, STATUS_CODES } from "@/Helper/response";
import { handleError } from "@/Helper/errorHandler";

// Export as a default object
const util = {
  connectDB,
  NextResponse,
  apiResponse,
  STATUS_CODES,
  handleError
};

export default util;
