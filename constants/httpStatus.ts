/**
 * HTTP Status Codes
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Centralized constants for commonly used HTTP response status codes.
 *
 * WHY
 *   Avoids scattering magic numbers such as `200`, `401`, `404`, and `500`
 *   throughout API clients, error handling, hooks, and UI code.
 *
 * USAGE
 *
 *   import { HTTP_STATUS } from '@/constants/httpStatus'
 *
 *   if (response.status === HTTP_STATUS.OK) {
 *       // Handle successful response
 *   }
 *
 *   if (response.status === HTTP_STATUS.UNAUTHORIZED) {
 *       // Redirect to login
 *   }
 *
 *   if (response.status === HTTP_STATUS.NOT_FOUND) {
 *       // Show not-found state
 *   }
 *
 *   if (response.status >= HTTP_STATUS.INTERNAL_SERVER_ERROR) {
 *       // Handle server error
 *   }
 *
 * NOTES
 *   - Values follow the standard HTTP status code definitions.
 *   - The list focuses on statuses commonly encountered by frontend
 *     applications.
 *   - The object is immutable at runtime through `as const`.
 * ----------------------------------------------------------------------------
 */

export const HTTP_STATUS = {
    // -------------------------------------------------------------------------
    // 1xx — Informational
    // -------------------------------------------------------------------------

    CONTINUE: 100,
    SWITCHING_PROTOCOLS: 101,

    // -------------------------------------------------------------------------
    // 2xx — Success
    // -------------------------------------------------------------------------

    OK: 200,
    CREATED: 201,
    ACCEPTED: 202,
    NO_CONTENT: 204,
    PARTIAL_CONTENT: 206,

    // -------------------------------------------------------------------------
    // 3xx — Redirection
    // -------------------------------------------------------------------------

    MULTIPLE_CHOICES: 300,
    MOVED_PERMANENTLY: 301,
    FOUND: 302,
    SEE_OTHER: 303,
    NOT_MODIFIED: 304,
    TEMPORARY_REDIRECT: 307,
    PERMANENT_REDIRECT: 308,

    // -------------------------------------------------------------------------
    // 4xx — Client Errors
    // -------------------------------------------------------------------------

    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_ALLOWED: 405,
    NOT_ACCEPTABLE: 406,
    REQUEST_TIMEOUT: 408,
    CONFLICT: 409,
    GONE: 410,
    UNPROCESSABLE_ENTITY: 422,
    TOO_MANY_REQUESTS: 429,

    // -------------------------------------------------------------------------
    // 5xx — Server Errors
    // -------------------------------------------------------------------------

    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504,
} as const

/**
 * Union of all supported HTTP status code values.
 *
 * Example:
 *
 *   const status: HttpStatus = response.status
 */
export type HttpStatus = (typeof HTTP_STATUS)[keyof typeof HTTP_STATUS]