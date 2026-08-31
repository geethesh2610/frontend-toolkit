/**
 * formatPercentage
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Formats a decimal percentage value into a localized percentage string
 *   using the native Intl.NumberFormat API.
 *
 *   The input is expected to be in decimal form:
 *
 *     0.75  → 75%
 *     0.5   → 50%
 *     1     → 100%
 *     0.125 → 12.5%
 *
 * PARAMETERS
 *   value
 *     Percentage value represented as a decimal between 0 and 1.
 *
 *     Examples:
 *       0.25  → 25%
 *       0.5   → 50%
 *       0.875 → 87.5%
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
 *       - signDisplay
 *       - useGrouping
 *
 *     The `style` option is intentionally controlled by this utility and
 *     cannot be overridden.
 *
 * RETURN VALUE
 *   A localized percentage string.
 *
 * EXAMPLES
 *
 *   formatPercentage(0.75)
 *   // '75%'
 *
 *   formatPercentage(0.756)
 *   // '75.6%'
 *
 *   formatPercentage(1)
 *   // '100%'
 *
 * DECIMAL PLACES
 *
 *   formatPercentage(0.7567, 'en-IN', {
 *     maximumFractionDigits: 2,
 *   })
 *
 *   // '75.67%'
 *
 *   formatPercentage(0.5, 'en-IN', {
 *     minimumFractionDigits: 2,
 *   })
 *
 *   // '50.00%'
 *
 * NEGATIVE VALUES
 *   Negative percentages are supported.
 *
 *   formatPercentage(-0.25)
 *   // '-25%'
 *
 * VALUES GREATER THAN 1
 *   Values greater than 1 are allowed because Intl percentage formatting
 *   multiplies the input by 100.
 *
 *   formatPercentage(1.5)
 *   // '150%'
 *
 *   If the application requires percentages to always be between 0% and
 *   100%, validate or clamp the value separately using `clamp()`.
 *
 * BEHAVIOR
 *   - Uses native Intl.NumberFormat percentage formatting.
 *   - Does not mutate the input.
 *   - Respects locale-specific percentage formatting.
 *   - Preserves negative values.
 *   - Does not silently convert invalid numbers.
 *
 * ERROR BEHAVIOR
 *   Throws a TypeError when `value` is not a finite number.
 *
 *   Throws a RangeError if the supplied locale or Intl options are invalid.
 *
 *   NaN, Infinity, and -Infinity are rejected.
 *
 * PRECISION
 *   This utility is for DISPLAY formatting only.
 *
 *   It does not perform percentage calculations.
 *
 *   Calculate the percentage separately:
 *
 *     const percentage = completed / total
 *
 *   Then:
 *
 *     formatPercentage(percentage)
 *
 * SSR / NEXT.JS
 *   Safe during SSR.
 *
 *   For deterministic server/client rendering, use the same locale and
 *   Intl options on both sides.
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

export interface FormatPercentageOptions
    extends Omit<Intl.NumberFormatOptions, 'style'> { }

const DEFAULT_LOCALE = 'en-IN'

export function formatPercentage(
    value: number,
    locale = DEFAULT_LOCALE,
    options: FormatPercentageOptions = {}
): string {
    if (!Number.isFinite(value)) {
        throw new TypeError(
            `formatPercentage: value must be a finite number. Received: ${value}`
        )
    }

    return new Intl.NumberFormat(locale, {
        ...options,
        style: 'percent',
    }).format(value)
}