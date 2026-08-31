/**
 * normalizeError
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Converts an unknown error value into a predictable, application-friendly
 *   error structure.
 *
 * WHY
 *   Errors can come from many different sources:
 *
 *     - Native JavaScript Error instances
 *     - Fetch/API errors
 *     - Backend error objects
 *     - Validation errors
 *     - Strings
 *     - Third-party libraries
 *     - Unknown values thrown by application code
 *
 *   Handling every possible shape throughout the application quickly becomes
 *   repetitive and inconsistent.
 *
 *   This utility creates one normalized structure that can be consumed by
 *   API layers, hooks, UI components, logging, and error handling code.
 *
 * PARAMETERS
 *   error
 *     The unknown value that needs to be normalized.
 *
 *   fallbackMessage
 *     Optional message used when the error does not contain a meaningful
 *     message. Defaults to `'An unexpected error occurred.'`.
 *
 * RETURN VALUE
 *   A `NormalizedError` object containing:
 *
 *     message
 *       Human-readable error message.
 *
 *     status
 *       HTTP status code when one can be safely identified.
 *
 *     code
 *       Application/API error code when available.
 *
 *     details
 *       Additional error information when available.
 *
 *     cause
 *       The original error value for debugging/logging purposes.
 *
 * IMPORTANT
 *   `details` and `cause` should generally NOT be displayed directly to
 *   users. They may contain internal or sensitive information.
 *
 * USAGE
 *
 *   try {
 *     await fetchStatements()
 *   } catch (error: unknown) {
 *     const normalized = normalizeError(error)
 *
 *     console.error(normalized)
 *
 *     if (normalized.status === 401) {
 *       // Handle authentication failure
 *     }
 *
 *     showError(normalized.message)
 *   }
 *
 * API ERROR EXAMPLE
 *
 *   Input:
 *
 *   {
 *     message: 'Statement not found',
 *     code: 'STATEMENT_NOT_FOUND',
 *     status: 404,
 *     details: {
 *       statementId: '123'
 *     }
 *   }
 *
 *   Output:
 *
 *   {
 *     message: 'Statement not found',
 *     code: 'STATEMENT_NOT_FOUND',
 *     status: 404,
 *     details: {
 *       statementId: '123'
 *     },
 *     cause: <original object>
 *   }
 *
 * SSR / BROWSER CONSIDERATIONS
 *   No browser APIs are used. Safe in browser, SSR, Node.js, and tests.
 *
 * SECURITY
 *   The normalized object retains the original value through `cause` and may
 *   retain additional data through `details`.
 *
 *   Do not serialize or expose the complete normalized error directly to the
 *   client or user-facing UI without reviewing its contents.
 *
 * SIDE EFFECTS
 *   None. This is a pure utility.
 * ----------------------------------------------------------------------------
 */

export interface NormalizedError {
    message: string
    status?: number
    code?: string
    details?: unknown
    cause: unknown
}

const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred.'

/**
 * Checks whether a value is a non-null object.
 */
function isObject(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null
}

/**
 * Reads a meaningful string property from an unknown object.
 */
function getStringProperty(
    object: Record<string, unknown>,
    key: string
): string | undefined {
    const value = object[key]

    if (typeof value !== 'string') {
        return undefined
    }

    const trimmed = value.trim()

    return trimmed || undefined
}

/**
 * Reads a valid HTTP status code from an unknown object.
 *
 * Only values in the standard HTTP status-code range are accepted.
 */
function getStatus(object: Record<string, unknown>): number | undefined {
    const value = object.status

    if (
        typeof value === 'number' &&
        Number.isInteger(value) &&
        value >= 100 &&
        value <= 599
    ) {
        return value
    }

    return undefined
}

/**
 * Normalizes an unknown error into a predictable application error object.
 *
 * @param error - Unknown value to normalize.
 * @param fallbackMessage - Message used when no meaningful message exists.
 * @returns A normalized error object.
 */
export function normalizeError(
    error: unknown,
    fallbackMessage: string = DEFAULT_ERROR_MESSAGE
): NormalizedError {
    // -------------------------------------------------------------------------
    // Native Error
    // -------------------------------------------------------------------------

    if (error instanceof Error) {
        return {
            message: error.message.trim() || fallbackMessage,
            cause: error,
        }
    }

    // -------------------------------------------------------------------------
    // String error
    // -------------------------------------------------------------------------

    if (typeof error === 'string') {
        return {
            message: error.trim() || fallbackMessage,
            cause: error,
        }
    }

    // -------------------------------------------------------------------------
    // Object / API error
    // -------------------------------------------------------------------------

    if (isObject(error)) {
        const message =
            getStringProperty(error, 'message') ??
            getStringProperty(error, 'error') ??
            fallbackMessage

        const code =
            getStringProperty(error, 'code') ??
            getStringProperty(error, 'errorCode')

        const status = getStatus(error)

        const details = error.details

        return {
            message,
            ...(status !== undefined && { status }),
            ...(code !== undefined && { code }),
            ...(details !== undefined && { details }),
            cause: error,
        }
    }

    // -------------------------------------------------------------------------
    // Unknown / unsupported value
    // -------------------------------------------------------------------------

    return {
        message: fallbackMessage,
        cause: error,
    }
}