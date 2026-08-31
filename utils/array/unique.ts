/**
 * unique
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Removes duplicate values from an array while preserving the order of
 *   their first occurrence.
 *
 *   This utility uses JavaScript's SameValueZero equality, the same equality
 *   semantics used by Set.
 *
 * PARAMETERS
 *   array
 *     The collection from which duplicate values should be removed.
 *
 * RETURN VALUE
 *   A new array containing only unique values.
 *
 * EXAMPLE
 *
 *   unique([1, 2, 2, 3, 1])
 *
 *   // [1, 2, 3]
 *
 * BEHAVIOR
 *   - Preserves the order of the first occurrence of each value.
 *   - Does not mutate the original array.
 *   - Returns a new array even when the input contains no duplicates.
 *   - Works with strings, numbers, booleans, bigint, symbols, objects,
 *     arrays, functions, and other JavaScript values.
 *
 * EQUALITY
 *   Values are compared using Set's SameValueZero semantics.
 *
 *   Examples:
 *
 *     unique([NaN, NaN])
 *     // [NaN]
 *
 *     unique([1, 1])
 *     // [1]
 *
 *     unique([0, -0])
 *     // [0]
 *
 * IMPORTANT — OBJECTS
 *   Objects are considered unique based on their reference, NOT their
 *   contents.
 *
 *   Example:
 *
 *     const a = { id: 1 }
 *     const b = { id: 1 }
 *
 *     unique([a, b])
 *     // [a, b]
 *
 *   Even though `a` and `b` contain the same data, they are different object
 *   references.
 *
 *   If uniqueness should be based on an object property, use `uniqueBy`
 *   instead.
 *
 * ERROR BEHAVIOR
 *   No expected runtime errors.
 *
 * PERFORMANCE
 *   Time complexity: O(n) on average.
 *   Space complexity: O(n).
 *
 *   Set provides efficient membership checks without repeatedly scanning the
 *   result array.
 *
 * IMMUTABILITY
 *   The original array is never modified.
 *
 * ----------------------------------------------------------------------------
 */

export function unique<T>(
    array: readonly T[]
): T[] {
    return Array.from(new Set(array))
}