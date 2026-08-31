/**
 * capitalize
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Capitalizes the first character of a string while leaving the remaining
 *   characters unchanged.
 *
 * PARAMETERS
 *   value
 *     The string to capitalize.
 *
 * RETURN VALUE
 *   A new string with its first character converted to uppercase.
 *
 * EXAMPLES
 *
 *   capitalize('hello')
 *   // 'Hello'
 *
 *   capitalize('hello world')
 *   // 'Hello world'
 *
 *   capitalize('hello WORLD')
 *   // 'Hello WORLD'
 *
 *   capitalize('HELLO')
 *   // 'HELLO'
 *
 *   capitalize('123hello')
 *   // '123hello'
 *
 *   capitalize('')
 *   // ''
 *
 * BEHAVIOR
 *   - Only the first character is changed.
 *   - Existing capitalization of the remaining characters is preserved.
 *   - Leading whitespace is preserved.
 *   - Empty strings return an empty string.
 *
 * IMPORTANT
 *   This is intentionally different from title-casing.
 *
 *     capitalize('hello WORLD')
 *     → 'Hello WORLD'
 *
 *   It does NOT produce:
 *
 *     'Hello World'
 *
 *   Use `camelToTitle()` or another title-case utility when the entire string
 *   needs to be converted into a readable title.
 *
 * UNICODE
 *   Uses JavaScript's native Unicode-aware string casing behavior for the
 *   first UTF-16 code unit.
 *
 * ERROR BEHAVIOR
 *   Throws a TypeError when the supplied value is not a string.
 *
 * PERFORMANCE
 *   Time complexity: O(n)
 *   Space complexity: O(n)
 *
 * ----------------------------------------------------------------------------
 */

export function capitalize(value: string): string {
    if (typeof value !== 'string') {
        throw new TypeError(
            `capitalize: value must be a string. Received: ${typeof value}`
        )
    }

    if (value.length === 0) {
        return value
    }

    return value.charAt(0).toUpperCase() + value.slice(1)
}