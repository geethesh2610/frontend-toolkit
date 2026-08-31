/**
 * formatNumber
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Formats a numeric value into a localized human-readable string using
 *   the native Intl.NumberFormat API.
 *
 *   This is the general-purpose number formatter. For monetary values,
 *   use `formatCurrency()` instead.
 *
 * PARAMETERS
 *   value
 *     The numeric value to format.
 *
 *   locale
 *     Optional BCP 47 locale used for formatting.
 *
 *     Default:
 *       'en-IN'
 *
 *     Examples:
 *       'en-IN'
 *       'en-US'
 *       'en-GB'
 *       'de-DE'
 *
 *   options
 *     Optional Intl.NumberFormat configuration.
 *
 *     Common options:
 *       - minimumFractionDigits
 *       - maximumFractionDigits
 *       - useGrouping
 *       - notation
 *       - compactDisplay
 *       - signDisplay
 *
 * RETURN VALUE
 *   A localized formatted number string.
 *
 * EXAMPLES
 *
 *   formatNumber(1234567)
 *   // '12,34,567'
 *
 *   formatNumber(1234567, 'en-US')
 *   // '1,234,567'
 *
 *   formatNumber(1234567.456)
 *   // '12,34,567.456'
 *
 * DECIMAL PLACES
 *
 *   formatNumber(1234.5678, 'en-IN', {
 *     maximumFractionDigits: 2,
 *   })
 *
 *   // '1,234.57'
 *
 * MINIMUM DECIMAL PLACES
 *
 *   formatNumber(1234.5, 'en-IN', {
 *     minimumFractionDigits: 2,
 *   })
 *
 *   // '1,234.50'
 *
 * COMPACT NOTATION
 *
 *   formatNumber(1500000, 'en-IN', {
 *     notation: 'compact',
 *   })
 *
 *   // Locale-dependent compact representation.
 *
 * BEHAVIOR
 *   - Uses native Intl.NumberFormat.
 *   - Respects locale-specific grouping and decimal separators.
 *   - Does not mutate the input.
 *   - Supports negative numbers and zero.
 *   - Does not perform currency formatting.
 *
 * ERROR BEHAVIOR
 *   Throws a TypeError when `value` is not a finite number.
 *
 *   Throws a RangeError if the supplied locale or Intl options are invalid.
 *
 *   Invalid numeric values are not silently converted to zero or an empty
 *   string because doing so can hide incorrect API or application data.
 *
 * SPECIAL VALUES
 *   NaN, Infinity, and -Infinity are rejected.
 *
 * PRECISION
 *   This utility formats a JavaScript number. It does not provide arbitrary
 *   precision arithmetic.
 *
 *   Perform calculations separately and pass the resulting number here.
 *
 * SSR / NEXT.JS
 *   Safe during SSR.
 *
 *   For deterministic server/client rendering, use the same locale and
 *   formatting options on both sides.
 *
 * PERFORMANCE
 *   Creates a new Intl.NumberFormat instance for each invocation.
 *
 *   This is appropriate for normal application-level formatting.
 *   For formatting very large collections repeatedly, create and reuse
 *   Intl.NumberFormat at the calling level.
 *
 * ----------------------------------------------------------------------------
 */

export interface FormatNumberOptions
    extends Intl.NumberFormatOptions { }

const DEFAULT_LOCALE = 'en-IN'

export function formatNumber(
    value: number,
    locale = DEFAULT_LOCALE,
    options: FormatNumberOptions = {}
): string {
    if (!Number.isFinite(value)) {
        throw new TypeError(
            `formatNumber: value must be a finite number. Received: ${value}`
        )
    }

    return new Intl.NumberFormat(
        locale,
        options
    ).format(value)
}