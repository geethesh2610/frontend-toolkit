/**
 * truncate
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Truncates a string to a maximum length and appends an ellipsis when the
 *   original string exceeds that limit.
 *
 *   The returned string will never exceed the requested maximum length.
 *
 * EXAMPLES
 *
 *   truncate('Hello World', 8)
 *   // 'Hello...'
 *
 *   truncate('Hello World', 20)
 *   // 'Hello World'
 *
 *   truncate('Hello World', 5)
 *   // 'He...'
 *
 * PARAMETERS
 *   value
 *     The string to truncate.
 *
 *   maxLength
 *     Maximum length of the final returned string, including the ellipsis.
 *
 *     Must be a non-negative integer.
 *
 *   options
 *     Optional configuration.
 *
 *     omission
 *       String appended when truncation occurs.
 *       Default: '...'
 *
 * RETURN VALUE
 *   The original string if it already fits within maxLength.
 *
 *   Otherwise, a truncated string ending with the configured omission.
 *
 * BEHAVIOR
 *   - Does not modify the original string.
 *   - Does not add an omission when truncation is unnecessary.
 *   - The returned string never exceeds maxLength.
 *   - If maxLength is smaller than the omission length, the omission itself
 *     is truncated to fit.
 *
 * EXAMPLES
 *
 *   truncate('Hello World', 11)
 *   // 'Hello World'
 *
 *   truncate('Hello World', 10)
 *   // 'Hello W...'
 *
 *   truncate('Hello World', 8)
 *   // 'Hello...'
 *
 *   truncate('Hello World', 5)
 *   // 'He...'
 *
 * CUSTOM OMISSION
 *
 *   truncate('Hello World', 9, {
 *     omission: '…',
 *   })
 *   // 'Hello Wo…'
 *
 * EDGE CASES
 *
 *   truncate('', 10)
 *   // ''
 *
 *   truncate('Hello', 5)
 *   // 'Hello'
 *
 *   truncate('Hello', 0)
 *   // ''
 *
 *   truncate('Hello', 2)
 *   // '..'
 *
 * ERROR BEHAVIOR
 *   Throws a TypeError when `value` is not a string.
 *
 *   Throws a RangeError when maxLength is not a non-negative integer.
 *
 *   Throws a TypeError when omission is not a string.
 *
 * UNICODE
 *   JavaScript string length is based on UTF-16 code units.
 *
 *   This implementation therefore does not guarantee that every Unicode
 *   grapheme cluster (such as an emoji composed of multiple code points)
 *   remains visually intact.
 *
 *   For normal UI text truncation this is usually sufficient. For strict
 *   grapheme-aware truncation, use Intl.Segmenter.
 *
 * PERFORMANCE
 *   Time complexity: O(n)
 *   Space complexity: O(n)
 *
 * ----------------------------------------------------------------------------
 */

export interface TruncateOptions {
    /**
     * String appended when truncation occurs.
     *
     * Default: '...'
     */
    omission?: string
}

export function truncate(
    value: string,
    maxLength: number,
    options: TruncateOptions = {}
): string {
    if (typeof value !== 'string') {
        throw new TypeError(
            `truncate: value must be a string. Received: ${typeof value}`
        )
    }

    if (!Number.isInteger(maxLength) || maxLength < 0) {
        throw new RangeError(
            `truncate: maxLength must be a non-negative integer. Received: ${maxLength}`
        )
    }

    const { omission = '...' } = options

    if (typeof omission !== 'string') {
        throw new TypeError(
            `truncate: omission must be a string. Received: ${typeof omission}`
        )
    }

    if (value.length <= maxLength) {
        return value
    }

    if (maxLength === 0) {
        return ''
    }

    if (omission.length >= maxLength) {
        return omission.slice(0, maxLength)
    }

    const contentLength = maxLength - omission.length

    return value.slice(0, contentLength) + omission
}