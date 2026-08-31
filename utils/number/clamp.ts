/**
 * clamp
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Restricts a number to a specified inclusive range.
 *
 *   If the value is below the minimum, the minimum is returned.
 *   If the value is above the maximum, the maximum is returned.
 *   Otherwise, the original value is returned.
 *
 * PARAMETERS
 *   value
 *     The number to constrain.
 *
 *   min
 *     The minimum allowed value.
 *
 *   max
 *     The maximum allowed value.
 *
 * RETURN VALUE
 *   A number guaranteed to be within the inclusive range [min, max].
 *
 * EXAMPLES
 *
 *   clamp(50, 0, 100)
 *   // 50
 *
 *   clamp(-10, 0, 100)
 *   // 0
 *
 *   clamp(150, 0, 100)
 *   // 100
 *
 *   clamp(75, 10, 50)
 *   // 50
 *
 * COMMON USE CASES
 *   - Progress values
 *   - Pagination limits
 *   - Opacity values
 *   - Numeric input constraints
 *   - UI dimensions
 *   - Animation values
 *   - Calculated percentages
 *
 * BEHAVIOR
 *   The bounds are inclusive:
 *
 *     clamp(0, 0, 100)   → 0
 *     clamp(100, 0, 100) → 100
 *
 *   The original value is returned when it is already within the range.
 *
 * ERROR BEHAVIOR
 *   Throws a RangeError when:
 *
 *     - min > max
 *
 *   Throws a TypeError when any argument is not a finite number.
 *
 *   Explicit validation prevents silent and difficult-to-debug behavior
 *   caused by values such as NaN or Infinity.
 *
 * IMMUTABILITY
 *   Numbers are primitive values, so there is no mutation involved.
 *
 * PERFORMANCE
 *   Time complexity: O(1)
 *   Space complexity: O(1)
 *
 * ----------------------------------------------------------------------------
 */

export function clamp(
    value: number,
    min: number,
    max: number
): number {
    if (
        !Number.isFinite(value) ||
        !Number.isFinite(min) ||
        !Number.isFinite(max)
    ) {
        throw new TypeError(
            `clamp: value, min, and max must be finite numbers. ` +
            `Received value=${value}, min=${min}, max=${max}`
        )
    }

    if (min > max) {
        throw new RangeError(
            `clamp: min must be less than or equal to max. ` +
            `Received min=${min}, max=${max}`
        )
    }

    return Math.min(Math.max(value, min), max)
}