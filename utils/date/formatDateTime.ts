/**
 * formatDateTime
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Formats a date and time into a localized, human-readable string using
 *   the native Intl.DateTimeFormat API.
 *
 *   This utility is intended for displaying timestamps consistently across
 *   an application without requiring a date library.
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
 *     Default:
 *
 *       {
 *         day: '2-digit',
 *         month: 'short',
 *         year: 'numeric',
 *         hour: '2-digit',
 *         minute: '2-digit',
 *       }
 *
 *     Example output:
 *
 *       21 Aug 2026, 03:30 PM
 *
 *   locale
 *     Locale used for formatting.
 *
 *     Default:
 *
 *       'en-IN'
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
 *   A formatted date-time string.
 *
 * EXAMPLES
 *
 *   formatDateTime(new Date())
 *   // "21 Aug 2026, 03:30 PM"
 *
 *   formatDateTime('2026-08-21T10:00:00Z')
 *   // "21 Aug 2026, 03:30 PM"
 *
 * CUSTOM FORMAT
 *
 *   formatDateTime(date, {
 *     day: 'numeric',
 *     month: 'long',
 *     year: 'numeric',
 *     hour: '2-digit',
 *     minute: '2-digit',
 *     second: '2-digit',
 *   })
 *
 * TIMEZONE
 *
 *   formatDateTime(
 *     date,
 *     {},
 *     'en-IN',
 *     'Asia/Kolkata'
 *   )
 *
 * ERROR BEHAVIOR
 *   Invalid date values throw a RangeError.
 *
 *   This is intentional. Returning an empty string or silently replacing
 *   invalid dates can hide malformed API data.
 *
 * SSR / NEXT.JS
 *   Safe to use during SSR.
 *
 *   IMPORTANT:
 *   If no explicit timezone is supplied, server and client environments with
 *   different timezones can produce different output. This can cause
 *   hydration mismatches in SSR applications.
 *
 *   For deterministic server-rendered output, provide an explicit timezone
 *   when appropriate.
 *
 * PERFORMANCE
 *   Creates an Intl.DateTimeFormat instance for each invocation.
 *
 *   This is appropriate for normal application-level formatting.
 *
 *   For formatting very large collections repeatedly, create and reuse an
 *   Intl.DateTimeFormat instance at the calling level instead.
 *
 * DATE INPUT
 *   Numeric values are interpreted as Unix timestamps in milliseconds,
 *   matching the native JavaScript Date constructor.
 *
 * ----------------------------------------------------------------------------
 */

export type DateTimeInput = Date | string | number

export interface FormatDateTimeOptions
    extends Intl.DateTimeFormatOptions { }

const DEFAULT_OPTIONS: Intl.DateTimeFormatOptions = {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
}

const DEFAULT_LOCALE = 'en-IN'

function toDate(value: DateTimeInput): Date {
    if (value instanceof Date) {
        return new Date(value.getTime())
    }

    return new Date(value)
}

export function formatDateTime(
    value: DateTimeInput,
    options: FormatDateTimeOptions = DEFAULT_OPTIONS,
    locale = DEFAULT_LOCALE,
    timeZone?: string
): string {
    const date = toDate(value)

    if (Number.isNaN(date.getTime())) {
        throw new RangeError(
            `formatDateTime: Invalid date value. Received: ${String(value)}`
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