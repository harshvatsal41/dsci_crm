'use client';

import { store } from "@/Redux/Store/store";
import {toast} from "sonner";
import Cookies from "js-cookie";

/**
 * A universal fetch wrapper with token support, error handling, and optional toast suppression.
 *
 * @param {string} url - API endpoint
 * @param {string} method - HTTP method ("GET", "POST", etc.)
 * @param {object|null} body - Request payload
 * @param {object} extraHeaders - Any additional headers to merge
 * @param {boolean} suppressToast - If true, disables toast notifications (useful when handling errors manually)
 * @returns {Promise<any>} - Returns parsed JSON response or null
 */
export const FetchWithAuth = async (
  url,
  method = "GET",
  body = null,
  extraHeaders = {},
  suppressToast = false
) => {
  if (typeof window === "undefined") {
    throw new Error("FetchWithAuth can only be used in the browser");
  }
  
  const token = localStorage.getItem("dsciAuthToken") || Cookies.get("dsciAuthToken") || "";
  const loginPath = "/administration/login"; 
  let headers = {
    ...(token && { Authorization: `Bearer ${token}` }),
    ...extraHeaders,
  };

  let options = {
    method,
    headers,
    credentials: "include",
  };

  if (body) {
    if (body instanceof FormData) {
      // Let browser set Content-Type with boundary
      delete headers["Content-Type"];
      options.body = body;
    } else if (headers["Content-Type"] === "application/x-www-form-urlencoded") {
      options.body = new URLSearchParams(body).toString();
    } else {
      headers["Content-Type"] = "application/json";
      options.body = JSON.stringify(body);
    }
  }

  try {
    const response = await fetch(url, options);

    // Handle token expiration
    if (response.status === 401) {
      toast.error("Your session has expired. Please login again.");
      store.dispatch({ type: "auth/logout" });
      localStorage.removeItem("dsciAuthToken");
      window.location.href = `${loginPath}?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    // Handle empty response (204 No Content)
    if (response.status === 204) return null;

    const responseData = await response.json();

    if (!response.ok) {
      const message = responseData?.error || responseData?.message || "Something went wrong";
      toast.error(message);
      // throw new Error(message);
    }else{
      toast.success(responseData?.message || "Request successful");
      return responseData;
    }
  } catch (error) {
    const finalMessage = error.message || "Network error";
    toast.error(finalMessage);
    // throw new Error(finalMessage);
  }
};