'use client';

import { store } from "@/Redux/Store/store";
import toast from "react-hot-toast";

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

  const token = localStorage.getItem("rsvAuthToken") || Cookies.get("dsciAuthToken") || "";
  const loginPath = "/administration/login"; // Simplified to only use admin login path

  const headers = {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
    ...extraHeaders,
  };

  const options = {
    method,
    headers,
    credentials: "include",
    ...(body && { body: JSON.stringify(body) }),
  };

  try {
    const response = await fetch(url, options);

    // Handle token expiration
    if (response.status === 401) {
      store.dispatch({ type: "auth/logout" });
      localStorage.removeItem("rsvAuthToken");
      if (!suppressToast) toast.error("Your session has expired. Please login again.");
      window.location.href = `${loginPath}?redirect=${encodeURIComponent(window.location.pathname)}`;
      return;
    }

    // Handle empty response (204 No Content)
    if (response.status === 204) return null;

    const responseData = await response.json();

    if (!response.ok) {
      const message = responseData?.error || responseData?.message || "Something went wrong";
      // if (!suppressToast) toast.error(message);
      throw new Error(message);
    }

    return responseData;
  } catch (error) {
    const finalMessage = error.message || "Network error";
    // if (!suppressToast) toast.error(finalMessage);
    throw new Error(finalMessage);
  }
};