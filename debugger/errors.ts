/**
 * ERROR DEBUGGER
 *
 * PURPOSE
 * -------
 * Utilities for safely inspecting, normalizing, and logging JavaScript errors.
 *
 * This is especially useful because frontend code can receive many different
 * things in a catch block:
 *
 *     catch (error: unknown) {
 *         // error could be Error, string, object, null, etc.
 *     }
 *
 * Helps answer:
 * - What went wrong?
 * - What type of error is this?
 * - What is the actual error message?
 * - Where did the error occur?
 * - Is there a stack trace?
 * - Is there a nested/cause error?
 * - What useful information can be extracted from an unknown value?
 *
 * AVAILABLE FUNCTIONS
 * -------------------
 *
 * errors.normalize(error)
 *   Converts an unknown value into a consistent ErrorInfo object.
 *   Returns: ErrorInfo
 *
 * errors.isError(value)
 *   Checks whether a value is an Error instance.
 *   Returns: boolean
 *
 * errors.message(error)
 *   Safely extracts an error message.
 *   Returns: string
 *
 * errors.stack(error)
 *   Safely extracts a stack trace.
 *   Returns: string | null
 *
 * errors.log(error, context?)
 *   Prints a structured error to the console.
 *   Returns: ErrorInfo
 *
 * errors.toError(error)
 *   Converts an unknown thrown value into an Error instance.
 *   Returns: Error
 *
 *
 * BASIC USAGE
 * -----------
 *
 * try {
 *     await loadUsers();
 * } catch (error: unknown) {
 *     const info = errors.normalize(error);
 *
 *     console.log(info);
 * }
 *
 *
 * SAFE ERROR MESSAGE
 * ------------------
 *
 * try {
 *     await saveUser();
 * } catch (error: unknown) {
 *     console.log(errors.message(error));
 * }
 *
 *
 * CONVERT UNKNOWN ERROR
 * ---------------------
 *
 * catch (error: unknown) {
 *     const normalizedError = errors.toError(error);
 *
 *     console.log(normalizedError.message);
 * }
 *
 *
 * LOG ERROR
 * ---------
 *
 * catch (error: unknown) {
 *     errors.log(error, "UserProfile");
 * }
 *
 * Output:
 *
 * [31 Aug 2026, 11:40:20 AM] [ERROR] [UserProfile]
 * Failed to load user
 *
 *
 * NORMALIZED ERROR
 * ----------------
 *
 * errors.normalize(error)
 *
 * Returns:
 *
 * {
 *     name: "TypeError",
 *     message: "Cannot read properties of undefined",
 *     stack: "...",
 *     type: "Error",
 *     cause: undefined,
 *     original: error
 * }
 *
 *
 * IMPORTANT
 * ---------
 * Always treat caught values as unknown:
 *
 *     catch (error: unknown)
 *
 * Do not assume:
 *
 *     error.message
 *
 * exists.
 *
 * ERROR TYPES
 * -----------
 * The debugger recognizes:
 *
 * - Error
 * - TypeError
 * - RangeError
 * - ReferenceError
 * - SyntaxError
 * - URIError
 * - EvalError
 * - DOMException
 * - strings
 * - numbers
 * - booleans
 * - plain objects
 * - null
 * - undefined
 *
 *
 * CAUSE
 * -----
 * Modern JavaScript errors can contain a nested cause:
 *
 *     new Error("Failed to load user", {
 *         cause: originalError,
 *     });
 *
 * normalize() preserves this information.
 *
 *
 * IMMUTABILITY
 * ------------
 * The original error/value is never modified.
 *
 * SECURITY
 * --------
 * Error messages and stacks can contain URLs, user information, request
 * details, or other sensitive application data.
 *
 * Do not send normalized errors to external systems without reviewing what
 * information is being exposed.
 *
 * BROWSER SUPPORT
 * ---------------
 * Uses standard JavaScript Error and DOMException APIs.
 *
 * Designed for modern browsers.
 */

export interface ErrorInfo {
    readonly name: string;
    readonly message: string;
    readonly stack: string | null;
    readonly type: string;
    readonly cause: unknown;
    readonly original: unknown;
}

function getObjectName(value: object): string {
    try {
        const constructor = Object.getPrototypeOf(value)?.constructor;

        if (
            typeof constructor === "function" &&
            typeof constructor.name === "string" &&
            constructor.name
        ) {
            return constructor.name;
        }
    } catch {
        // Fall back to the object's tag.
    }

    return Object.prototype.toString
        .call(value)
        .slice(8, -1);
}

function getErrorMessage(value: unknown): string {
    if (value instanceof Error) {
        return value.message || value.name || "Unknown error";
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "message" in value
    ) {
        try {
            const message = (value as Record<string, unknown>).message;

            if (typeof message === "string" && message.trim()) {
                return message;
            }
        } catch {
            // Continue with fallback handling.
        }
    }

    if (typeof value === "string") {
        return value;
    }

    if (value === null) {
        return "null";
    }

    if (value === undefined) {
        return "undefined";
    }

    try {
        const stringValue = String(value);

        if (stringValue !== "[object Object]") {
            return stringValue;
        }
    } catch {
        // Continue with fallback.
    }

    return "Unknown error";
}

function getErrorStack(value: unknown): string | null {
    if (value instanceof Error) {
        return typeof value.stack === "string"
            ? value.stack
            : null;
    }

    if (
        typeof value === "object" &&
        value !== null &&
        "stack" in value
    ) {
        try {
            const stack = (value as Record<string, unknown>).stack;

            return typeof stack === "string"
                ? stack
                : null;
        } catch {
            return null;
        }
    }

    return null;
}

function getErrorCause(value: unknown): unknown {
    if (
        typeof value === "object" &&
        value !== null &&
        "cause" in value
    ) {
        try {
            return (value as Record<string, unknown>).cause;
        } catch {
            return undefined;
        }
    }

    return undefined;
}

function getErrorType(value: unknown): string {
    if (value instanceof Error) {
        return value.constructor.name || "Error";
    }

    if (
        typeof DOMException !== "undefined" &&
        value instanceof DOMException
    ) {
        return "DOMException";
    }

    if (value === null) {
        return "null";
    }

    if (value === undefined) {
        return "undefined";
    }

    if (typeof value === "object") {
        return getObjectName(value);
    }

    return typeof value;
}

export function isError(value: unknown): value is Error {
    return value instanceof Error;
}

export function message(error: unknown): string {
    return getErrorMessage(error);
}

export function stack(error: unknown): string | null {
    return getErrorStack(error);
}

export function normalize(error: unknown): ErrorInfo {
    return {
        name:
            error instanceof Error
                ? error.name || "Error"
                : getErrorType(error),

        message: getErrorMessage(error),

        stack: getErrorStack(error),

        type: getErrorType(error),

        cause: getErrorCause(error),

        original: error,
    };
}

export function toError(error: unknown): Error {
    if (error instanceof Error) {
        return error;
    }

    const normalized = normalize(error);

    const convertedError = new Error(
        normalized.message,
    );

    convertedError.name = normalized.name;

    if (normalized.cause !== undefined) {
        Object.defineProperty(
            convertedError,
            "cause",
            {
                value: normalized.cause,
                enumerable: false,
                configurable: true,
            },
        );
    }

    return convertedError;
}

export function log(
    error: unknown,
    context?: string,
): ErrorInfo {
    const normalized = normalize(error);
    const trimmedContext = context?.trim();

    if (context !== undefined && !trimmedContext) {
        throw new TypeError(
            '[debugger/errors] "context" must be a non-empty string.',
        );
    }

    const contextText = trimmedContext
        ? ` [${ trimmedContext }]`
        : "";

    console.error(
        `[${
    new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    }).format(new Date())
}][ERROR]${ contextText } `,
        {
            name: normalized.name,
            type: normalized.type,
            message: normalized.message,
            stack: normalized.stack,
            cause: normalized.cause,
        },
    );

    return normalized;
}

export const errors = {
    normalize,
    isError,
    message,
    stack,
    toError,
    log,
};