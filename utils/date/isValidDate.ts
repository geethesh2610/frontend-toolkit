/**
 * isValidDate
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Determines whether a value can be converted into a valid JavaScript Date.
 *
 *   This is a non-throwing validation utility intended for form validation,
 *   API data validation, conditional rendering, and defensive date handling.
 *
 * PARAMETERS
 *   value
 *     The value to validate.
 *
 *     Supported values:
 *       - Date
 *       - string
 *       - number (Unix timestamp in milliseconds)
 *
 * RETURN VALUE
 *   `true`  → the value represents a valid date.
 *   `false` → the value is invalid.
 *
 * EXAMPLES
 *
 *   isValidDate(new Date())
 *   // true
 *
 *   isValidDate('2026-08-21')
 *   // true
 *
 *   isValidDate('2026-08-21T10:30:00Z')
 *   // true
 *
 *   isValidDate('invalid-date')
 *   // false
 *
 *   isValidDate(NaN)
 *   // false
 *
 *   isValidDate(new Date('invalid'))
 *   // false
 *
 * BEHAVIOR
 *   - Does not mutate a Date object supplied by the caller.
 *   - Invalid Date objects return `false`.
 *   - Invalid timestamps return `false`.
 *   - Invalid date strings return `false`.
 *   - `NaN`, `Infinity`, and `-Infinity` return `false`.
 *
 * IMPORTANT
 *   JavaScript date parsing is implementation-dependent for some non-standard
 *   date strings.
 *
 *   Prefer standardized formats such as:
 *
 *     '2026-08-21'
 *     '2026-08-21T10:30:00Z'
 *
 *   Avoid relying on ambiguous formats such as:
 *
 *     '08/21/2026'
 *     '21/08/2026'
 *
 *   when data comes from an API or external source.
 *
 * DATE-ONLY VALUES
 *   A string such as '2026-08-21' is considered valid if JavaScript can parse
 *   it successfully. This utility validates the value; it does not determine
 *   whether the date should be interpreted in UTC or a specific local
 *   timezone.
 *
 * ERROR BEHAVIOR
 *   This function never throws for normal invalid input.
 *
 *   Any value that cannot represent a valid date returns `false`.
 *
 * PERFORMANCE
 *   Time complexity: O(1)
 *   Space complexity: O(1)
 *
 * ----------------------------------------------------------------------------
 */

export type DateValue = Date | string | number

export function isValidDate(value: DateValue): boolean {
    if (value instanceof Date) {
        return !Number.isNaN(value.getTime())
    }

    if (typeof value === 'number') {
        return Number.isFinite(value) && !Number.isNaN(new Date(value).getTime())
    }

    if (typeof value === 'string') {
        if (value.trim() === '') {
            return false
        }

        const timestamp = Date.parse(value)

        return !Number.isNaN(timestamp)
    }

    return false
}