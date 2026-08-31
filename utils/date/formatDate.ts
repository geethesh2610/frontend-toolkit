/**
 * formatDate
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Formats a date into a human-readable localized date string using the
 *   native Intl.DateTimeFormat API.
 *
 *   This utility is intended for common application-level date display
 *   without requiring a date library.
 *
 * PARAMETERS
 *   value
 *     Date value to format.
 *
 *     Supported values:
 *       - Date
 *       - string
 *       - number (Unix timestamp in milliseconds)
 *
 *   options
 *     Optional Intl.DateTimeFormat configuration.
 *
 *     By default:
 *
 *       {
 *         day: '2-digit',
 *         month: 'short',
 *         year: 'numeric',
 *       }
 *
 *     This produces output similar to:
 *
 *       21 Aug 2026
 *
 *   locale
 *     Locale used for formatting.
 *
 *     Default:
 *
 *       'en-IN'
 *
 *     Pass another locale when required:
 *
 *       'en-US'
 *       'en-GB'
 *       'de-DE'
 *       'fr-FR'
 *
 *   timeZone
 *     Optional IANA timezone.
 *
 *     Examples:
 *
 *       'Asia/Kolkata'
 *       'UTC'
 *       'America/New_York'
 *
 *     If omitted, the runtime's local timezone is used.
 *
 * RETURN VALUE
 *   Formatted date string.
 *
 * EXAMPLES
 *
 *   formatDate(new Date())
 *   // "21 Aug 2026"
 *
 *   formatDate('2026-08-21T10:30:00Z')
 *   // "21 Aug 2026"
 *
 *   formatDate(1787308200000)
 *   // "21 Aug 2026"
 *
 * CUSTOM FORMAT
 *
 *   formatDate(date, {
 *     day: 'numeric',
 *     month: 'long',
 *     year: 'numeric',
 *   })
 *
 *   // "21 August 2026"
 *
 * TIMEZONE
 *
 *   formatDate(date, {}, 'Asia/Kolkata')
 *
 *   // Date is formatted using India Standard Time.
 *
 * ERROR BEHAVIOR
 *   Invalid date values throw a RangeError.
 *
 *   This is intentional. Silently returning an empty string can hide invalid
 *   backend data and make debugging considerably harder.
 *
 *   Example:
 *
 *     formatDate('invalid-date')
 *
 *     // RangeError: formatDate: Invalid date value.
 *
 * SSR / NEXT.JS
 *   Safe to use during SSR.
 *
 *   Intl.DateTimeFormat is available in modern JavaScript runtimes.
 *
 *   IMPORTANT:
 *   When server and client use different timezones and `timeZone` is not
 *   explicitly supplied, the rendered output can differ during hydration.
 *
 *   For deterministic SSR output, provide an explicit `timeZone`, commonly
 *   `'UTC'`, when appropriate for the application.
 *
 * PERFORMANCE
 *   A new Intl.DateTimeFormat instance is created for each call.
 *
 *   This is appropriate for a simple utility. If formatting thousands of
 *   dates repeatedly in a render-heavy operation, create and reuse an
 *   Intl.DateTimeFormat instance at the calling level instead.
 *
 * DATE INPUT
 *   Numeric values are interpreted as Unix timestamps in milliseconds,
 *   matching the native JavaScript Date constructor.
 *
 * ----------------------------------------------------------------------------
 */

export type DateInput = Date | string | number

export interface FormatDateOptions
    extends Intl.DateTimeFormatOptions { }

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
}

const DEFAULT_LOCALE = 'en-IN'

function toDate(value: DateInput): Date {
    if (value instanceof Date) {
        return new Date(value.getTime())
    }

    return new Date(value)
}

export function formatDate(
    value: DateInput,
    options: FormatDateOptions = DEFAULT_OPTIONS,
    locale = DEFAULT_LOCALE,
    timeZone?: string
): string {
    const date = toDate(value)

    if (Number.isNaN(date.getTime())) {
        throw new RangeError(
            `formatDate: Invalid date value. Received: ${String(value)}`
        )
    }

    const formatterOptions: Intl.DateTimeFormatOptions =
        timeZone
            ? {
                ...options,
                timeZone,
            }
            : options

    return new Intl.DateTimeFormat(
        locale,
        formatterOptions
    ).format(date)
}