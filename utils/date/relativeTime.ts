/**
 * relativeTime
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Converts a date/time value into a human-readable relative time such as:
 *
 *     "just now"
 *     "5 minutes ago"
 *     "2 hours ago"
 *     "3 days ago"
 *     "in 2 days"
 *
 *   Uses the native Intl.RelativeTimeFormat API for localization.
 *
 * PARAMETERS
 *   value
 *     The date/time to compare against `now`.
 *
 *     Supported values:
 *       - Date
 *       - string
 *       - number (Unix timestamp in milliseconds)
 *
 *   options
 *     Optional configuration.
 *
 *     locale
 *       Locale used for the relative-time output.
 *       Default: 'en-IN'
 *
 *     now
 *       Reference timestamp in milliseconds.
 *       Defaults to the current time.
 *
 *       This is particularly useful for:
 *         - Testing
 *         - SSR
 *         - Deterministic output
 *
 *     numeric
 *       Controls whether values such as "1 day ago" are used or whether
 *       Intl can use language-specific words such as "yesterday".
 *
 *       Default: 'always'
 *
 *     timeZone
 *       Optional IANA timezone.
 *
 *       NOTE:
 *       Relative time is calculated from timestamps, so timezone generally
 *       does not affect the calculation. This option is intentionally not
 *       used for the difference calculation.
 *
 * RETURN VALUE
 *   A localized relative-time string.
 *
 * EXAMPLES
 *
 *   relativeTime(Date.now() - 30_000)
 *   // "30 seconds ago"
 *
 *   relativeTime(Date.now() - 5 * 60_000)
 *   // "5 minutes ago"
 *
 *   relativeTime(Date.now() - 2 * 60 * 60_000)
 *   // "2 hours ago"
 *
 *   relativeTime(Date.now() + 2 * 86_400_000)
 *   // "in 2 days"
 *
 * UNIT SELECTION
 *   The function automatically selects the most appropriate unit:
 *
 *     < 60 seconds     → seconds
 *     < 60 minutes     → minutes
 *     < 24 hours       → hours
 *     < 7 days         → days
 *     < 4 weeks        → weeks
 *     < 12 months      → months
 *     otherwise        → years
 *
 * BEHAVIOR
 *   - Past dates produce values such as "5 minutes ago".
 *   - Future dates produce values such as "in 5 minutes".
 *   - Zero difference produces "in 0 seconds" with the default numeric mode.
 *   - The original Date object is never modified.
 *
 * ERROR BEHAVIOR
 *   Invalid date values throw a RangeError.
 *
 *   This is intentional. Returning an empty string for malformed API data
 *   can hide data problems.
 *
 * SSR / NEXT.JS
 *   Safe during SSR.
 *
 *   The default `now` uses `Date.now()`, so output naturally changes with
 *   time. For deterministic server/client rendering, pass an explicit
 *   `now` value or calculate relative time on the client.
 *
 * PERFORMANCE
 *   Time complexity: O(1)
 *   Space complexity: O(1)
 *
 * ----------------------------------------------------------------------------
 */

export type RelativeTimeInput = Date | string | number

export interface RelativeTimeOptions {
    /**
     * Locale used for formatting.
     * Default: 'en-IN'.
     */
    locale?: string

    /**
     * Reference timestamp in milliseconds.
     * Defaults to Date.now().
     */
    now?: number

    /**
     * Controls whether Intl uses numeric values or language-specific
     * relative words such as "yesterday".
     *
     * Default: 'always'.
     */
    numeric?: 'always' | 'auto'
}

type RelativeUnit =
    | 'second'
    | 'minute'
    | 'hour'
    | 'day'
    | 'week'
    | 'month'
    | 'year'

const SECOND = 1_000
const MINUTE = 60 * SECOND
const HOUR = 60 * MINUTE
const DAY = 24 * HOUR
const WEEK = 7 * DAY
const MONTH = 30 * DAY
const YEAR = 365 * DAY

function toTimestamp(value: RelativeTimeInput): number {
    if (value instanceof Date) {
        return value.getTime()
    }

    if (typeof value === 'number') {
        return value
    }

    return Date.parse(value)
}

function getRelativeUnit(
    difference: number
): {
    value: number
    unit: RelativeUnit
} {
    const absoluteDifference = Math.abs(difference)

    if (absoluteDifference < MINUTE) {
        return {
            value: Math.round(difference / SECOND),
            unit: 'second',
        }
    }

    if (absoluteDifference < HOUR) {
        return {
            value: Math.round(difference / MINUTE),
            unit: 'minute',
        }
    }

    if (absoluteDifference < DAY) {
        return {
            value: Math.round(difference / HOUR),
            unit: 'hour',
        }
    }

    if (absoluteDifference < WEEK) {
        return {
            value: Math.round(difference / DAY),
            unit: 'day',
        }
    }

    if (absoluteDifference < MONTH) {
        return {
            value: Math.round(difference / WEEK),
            unit: 'week',
        }
    }

    if (absoluteDifference < YEAR) {
        return {
            value: Math.round(difference / MONTH),
            unit: 'month',
        }
    }

    return {
        value: Math.round(difference / YEAR),
        unit: 'year',
    }
}

export function relativeTime(
    value: RelativeTimeInput,
    options: RelativeTimeOptions = {}
): string {
    const {
        locale = 'en-IN',
        now = Date.now(),
        numeric = 'always',
    } = options

    const timestamp = toTimestamp(value)

    if (Number.isNaN(timestamp)) {
        throw new RangeError(
            `relativeTime: Invalid date value. Received: ${String(value)}`
        )
    }

    if (!Number.isFinite(now)) {
        throw new RangeError(
            `relativeTime: "now" must be a finite timestamp. Received: ${now}`
        )
    }

    const difference = timestamp - now

    const { value: relativeValue, unit } = getRelativeUnit(difference)

    return new Intl.RelativeTimeFormat(locale, {
        numeric,
    }).format(relativeValue, unit)
}