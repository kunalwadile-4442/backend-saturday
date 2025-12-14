export const MESSAGES = {
  // Success Messages
  SUCCESS: {
    REGISTER: "User registered successfully",
    LOGIN: "Login successful",
    LOGOUT: "Logout successful",
    GUEST_TOKEN: "Guest token generated successfully",
    DATA_FETCHED: "Data fetched successfully",
    DATA_CREATED: "Data created successfully",
    DATA_UPDATED: "Data updated successfully",
    DATA_DELETED: "Data deleted successfully",
    SOCKET_CONNECTED: "Socket connected successfully",
    SOCKET_DISCONNECTED: "Socket disconnected successfully",
  },

  // Error Messages
  ERROR: {
    INTERNAL_SERVER: "Internal server error",
    INVALID_CREDENTIALS: "Invalid email or password",
    USER_EXISTS: "User already exists",
    USER_NOT_FOUND: "User not found",
    UNAUTHORIZED: "Unauthorized access",
    FORBIDDEN: "Forbidden: Insufficient permissions",
    INVALID_TOKEN: "Invalid or expired token",
    TOKEN_REQUIRED: "Access token required",
    VALIDATION_ERROR: "Validation error",
    NOT_FOUND: "Resource not found",
    MISSING_FIELDS: "Required fields are missing",
    INVALID_ID: "Invalid ID format",
    DATABASE_ERROR: "Database operation failed",
    SOCKET_AUTH_FAILED: "Socket authentication failed",
  },

  // Validation Messages
  VALIDATION: {
    EMAIL_REQUIRED: "Email is required",
    EMAIL_INVALID: "Invalid email format",
    PASSWORD_REQUIRED: "Password is required",
    PASSWORD_MIN: "Password must be at least 6 characters",
    NAME_REQUIRED: "Name is required",
    ROLE_INVALID: "Invalid role",
  },

  SOCKET: {
    SERVICE_NOT_FOUND: "service_not_found",
    ACTION_NOT_FOUND: "action_not_found",
    VALIDATION_FAILED: "validation_failed",
    UG_COURSES_FOUND: "ug_courses_found",
    COURSE_CREATED: "course_created_successfully",
    COURSE_UPDATED: "course_updated_successfully",
    COURSE_DELETED: "course_deleted_successfully",
    COURSE_NOT_FOUND: "course_not_found",
    USERS_FOUND: "users_found",
    USER_UPDATED: "User details updated successfully",
    USER_NOT_FOUND: "user_not_found",
    USER_FOUND: "user_found",
    FAILED_TO_FETCH: "failed_to_fetch",
    FAILED_TO_CREATE: "failed_to_create",
    FAILED_TO_UPDATE: "failed_to_update",
    FAILED_TO_DELETE: "failed_to_delete",
  },

  // Auth Messages
  AUTH: {
    UNAUTHORIZED: "Unauthorized access",
    INVALID_TOKEN: "Invalid or expired token",
    TOKEN_EXPIRED: "Token has expired",
    NO_TOKEN: "No authentication token provided",
  },
}
