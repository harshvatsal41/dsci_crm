export const STATUS_CODES = {
  OK: 200,
  CREATED: 201,
  UPDATESUCCESS: 202,
  DELETESUCCESS: 203,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_ERROR: 500,
  CONFLICT: 409,
};

export function apiResponse({ message, data = null, error = null, statusCode, status = 'success' }) {
  return {
    message,
    data,
    error,
    status,
    statusCode,
  };
} 