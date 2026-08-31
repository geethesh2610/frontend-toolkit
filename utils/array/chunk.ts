/**
 * chunk
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Splits an array into smaller arrays (chunks) of a specified maximum size.
 *
 *   The original array is never mutated.
 *
 * PARAMETERS
 *   array
 *     The array to split.
 *
 *   size
 *     Maximum number of items allowed in each chunk.
 *
 *     Must be a positive finite integer.
 *
 * RETURN VALUE
 *   A new array containing smaller arrays.
 *
 * EXAMPLE
 *
 *   chunk([1, 2, 3, 4, 5], 2)
 *
 *   // [
 *   //   [1, 2],
 *   //   [3, 4],
 *   //   [5],
 *   // ]
 *
 * BEHAVIOR
 *   - Returns `[]` when the input array is empty.
 *   - The final chunk may contain fewer items than `size`.
 *   - The original array is not modified.
 *   - Works with any array type through TypeScript generics.
 *
 * ERROR BEHAVIOR
 *   Throws a `RangeError` when `size` is not a positive integer.
 *
 *   Examples:
 *
 *     chunk(items, 0)
 *     chunk(items, -1)
 *     chunk(items, 1.5)
 *     chunk(items, Infinity)
 *
 *   All of these are invalid because a chunk size must be a positive
 *   integer.
 *
 * PERFORMANCE
 *   Time complexity: O(n)
 *   Space complexity: O(n)
 *
 *   Each input item is copied into exactly one output chunk.
 *
 * IMMUTABILITY
 *   The source array is never modified.
 *
 * ----------------------------------------------------------------------------
 */

export function chunk<T>(
    array: readonly T[],
    size: number
): T[][] {
    if (
        !Number.isFinite(size) ||
        !Number.isInteger(size) ||
        size <= 0
    ) {
        throw new RangeError(
            `chunk: size must be a positive integer. Received: ${size}`
        )
    }

    if (array.length === 0) {
        return []
    }

    const result: T[][] = []

    for (let index = 0; index < array.length; index += size) {
        result.push(
            array.slice(index, index + size)
        )
    }

    return result
}