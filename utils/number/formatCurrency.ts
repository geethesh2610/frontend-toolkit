/**
 * formatCurrency
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Formats a numeric value as a localized currency string using the native
 *   Intl.NumberFormat API.
 *
 *   This utility handles currency symbols, grouping separators, decimal
 *   places, and locale-specific formatting automatically.
 *
 * PARAMETERS
 *   value
 *     Numeric monetary value to format.
 *
 *   currency
 *     ISO 4217 currency code.
 *
 *     Examples:
 *       'INR'
 *       'USD'
 *       'EUR'
 *       'GBP'
 *       'JPY'
 *
 *   locale
 *     BCP 47 locale used for formatting.
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
 *     Optional Intl.NumberFormat currency configuration.
 *
 *     These options can be used to customize:
 *       - currency display
 *       - minimum/maximum fraction digits
 *       - notation
 *       - sign display
 *       - other Intl.NumberFormat behavior
 *
 * RETURN VALUE
 *   A localized currency string.
 *
 * EXAMPLES
 *
 *   formatCurrency(125000, 'INR')
 *   // '₹1,25,000.00'
 *
 *   formatCurrency(125000, 'USD', 'en-US')
 *   // '$125,000.00'
 *
 *   formatCurrency(125000, 'EUR', 'de-DE')
 *   // '125.000,00 €'
 *
 * CUSTOM CURRENCY DISPLAY
 *
 *   formatCurrency(125000, 'INR', 'en-IN', {
 *     currencyDisplay: 'code',
 *   })
 *
 *   // 'INR 1,25,000.00'
 *
 *   Supported currencyDisplay values:
 *     - 'symbol'
 *     - 'narrowSymbol'
 *     - 'code'
 *     - 'name'
 *
 * DECIMAL PLACES
 *
 *   By default, Intl determines the appropriate number of fraction digits
 *   for the selected currency.
 *
 *   To explicitly control them:
 *
 *   formatCurrency(1250.5, 'INR', 'en-IN', {
 *     minimumFractionDigits: 0,
 *     maximumFractionDigits: 0,
 *   })
 *
 *   // '₹1,251'
 *
 * BEHAVIOR
 *   - Uses native Intl currency formatting.
 *   - Respects locale-specific grouping and decimal separators.
 *   - Does not mutate the input.
 *   - Supports negative values.
 *   - Supports zero.
 *
 * ERROR BEHAVIOR
 *   Throws a TypeError when `value` is not a finite number.
 *
 *   Throws a RangeError when `currency` or `locale` is rejected by the
 *   underlying Intl.NumberFormat implementation.
 *
 *   Invalid monetary values are not silently converted to zero or an empty
 *   string because that can hide financial data problems.
 *
 * SPECIAL VALUES
 *   NaN, Infinity, and -Infinity are rejected.
 *
 * PRECISION
 *   JavaScript numbers use IEEE-754 floating-point arithmetic.
 *
 *   This utility is intended for DISPLAYING monetary values, not for
 *   performing financial calculations.
 *
 *   For financial calculations requiring exact decimal arithmetic, use an
 *   appropriate decimal/money representation before passing the result here.
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
 *   For formatting very large lists repeatedly, consider creating and
 *   reusing Intl.NumberFormat at the calling level.
 *
 * ----------------------------------------------------------------------------
 */

export interface FormatCurrencyOptions
    extends Intl.NumberFormatOptions {
    /**
     * Controls how the currency is displayed.
     *
     * Default: 'symbol'
     */
    currencyDisplay?: 'symbol' | 'narrowSymbol' | 'code' | 'name'
}

const DEFAULT_LOCALE = 'en-IN'

export function formatCurrency(
    value: number,
    currency: string,
    locale = DEFAULT_LOCALE,
    options: FormatCurrencyOptions = {}
): string {
    if (!Number.isFinite(value)) {
        throw new TypeError(
            `formatCurrency: value must be a finite number. Received: ${value}`
        )
    }

    if (typeof currency !== 'string' || currency.trim() === '') {
        throw new TypeError(
            'formatCurrency: currency must be a non-empty ISO 4217 currency code.'
        )
    }

    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency.toUpperCase(),
        ...options,
    }).format(value)
}