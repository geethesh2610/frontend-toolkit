/**
 * isError
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Safely determines whether an unknown value is a native JavaScript Error.
 *
 * WHY
 *   Values caught in a `catch` block are `unknown` in TypeScript when using
 *   strict settings. JavaScript also allows anything to be thrown:
 *
 *     throw new Error('Something went wrong')
 *     throw 'Something went wrong'
 *     throw { message: 'Something went wrong' }
 *     throw null
 *
 *   This utility provides a consistent type guard for safely narrowing an
 *   unknown value to `Error`.
 *
 * PARAMETERS
 *   value
 *     Any unknown value that needs to be checked.
 *
 * RETURN VALUE
 *   `true`  → the value is an instance of `Error`.
 *   `false` → the value is not an `Error`.
 *
 * TYPE NARROWING
 *   When this function returns `true`, TypeScript knows that the value is
 *   an `Error`, allowing safe access to:
 *
 *     error.message
 *     error.name
 *     error.stack
 *
 * USAGE
 *
 *   try {
 *     await fetchData()
 *   } catch (error: unknown) {
 *     if (isError(error)) {
 *       console.error(error.message)
 *     }
 *   }
 *
 * IMPORTANT
 *   This function intentionally checks for a real `Error` instance.
 *   An arbitrary object containing a `message` property is NOT considered
 *   an Error. Handling arbitrary API error shapes belongs in `normalizeError`.
 *
 * SSR / BROWSER CONSIDERATIONS
 *   No browser APIs are used. Safe in browser, SSR, Node.js, and tests.
 *
 * SIDE EFFECTS
 *   None. This is a pure utility.
 * ----------------------------------------------------------------------------
 */

/**
 * Determines whether a value is a native JavaScript Error.
 *
 * @param value - Unknown value to check.
 * @returns `true` when the value is an Error; otherwise `false`.
 */
export function isError(value: unknown): value is Error {
    return value instanceof Error
}