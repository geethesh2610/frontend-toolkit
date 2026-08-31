/**
 * getErrorMessage
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Safely extracts a human-readable error message from an unknown value.
 *
 * WHY
 *   In TypeScript, values caught in a `catch` block are `unknown`.
 *   JavaScript also allows anything to be thrown:
 *
 *     throw new Error('Something went wrong')
 *     throw 'Something went wrong'
 *     throw { message: 'Something went wrong' }
 *     throw null
 *
 *   This utility provides one consistent way to obtain a safe message without
 *   repeatedly writing error-shape checks throughout the application.
 *
 * PARAMETERS
 *   error
 *     The unknown value that was thrown or returned as an error.
 *
 *   fallback
 *     Optional message returned when a meaningful message cannot be extracted.
 *     Defaults to `'An unexpected error occurred.'`.
 *
 * RETURN VALUE
 *   A human-readable string.
 *
 * BEHAVIOR
 *   The utility handles the following common cases:
 *
 *     Error instance
 *       → returns `error.message`
 *
 *     String
 *       → returns the string itself
 *
 *     Object with a string `message`
 *       → returns the message
 *
 *     Object with a non-string `message`
 *       → returns the fallback
 *
 *     null / undefined / primitive values
 *       → returns the fallback unless the value itself is a string
 *
 *   Empty or whitespace-only messages are treated as invalid and use the
 *   fallback instead.
 *
 * SECURITY
 *   This utility does not expose an object's entire contents or stringify
 *   arbitrary objects. This is intentional because error objects can contain
 *   sensitive information such as tokens, request data, or internal details.
 *
 * USAGE
 *
 *   try {
 *     await fetchData()
 *   } catch (error: unknown) {
 *     const message = getErrorMessage(error)
 *     setError(message)
 *   }
 *
 *   With a custom fallback:
 *
 *   const message = getErrorMessage(
 *     error,
 *     'Unable to load the requested data.'
 *   )
 *
 * SSR / BROWSER CONSIDERATIONS
 *   No browser APIs are used. Safe in browser, SSR, Node.js, and tests.
 *
 * SIDE EFFECTS
 *   None. This is a pure utility.
 * ----------------------------------------------------------------------------
 */

const DEFAULT_ERROR_MESSAGE = 'An unexpected error occurred.'

/**
 * Extracts a safe, human-readable message from an unknown error value.
 *
 * @param error - Unknown value thrown or returned as an error.
 * @param fallback - Message used when no meaningful message can be extracted.
 * @returns A human-readable error message.
 */
export function getErrorMessage(
    error: unknown,
    fallback: string = DEFAULT_ERROR_MESSAGE
): string {
    if (typeof error === 'string') {
        const message = error.trim()

        return message || fallback
    }

    if (error instanceof Error) {
        const message = error.message.trim()

        return message || fallback
    }

    if (
        typeof error === 'object' &&
        error !== null &&
        'message' in error &&
        typeof error.message === 'string'
    ) {
        const message = error.message.trim()

        return message || fallback
    }

    return fallback
}