/**
 * uniqueBy
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Removes duplicate items from an array based on a value derived from each
 *   item.
 *
 *   The first item encountered for each unique key is preserved.
 *
 * PARAMETERS
 *   array
 *     The collection from which duplicate items should be removed.
 *
 *   getKey
 *     Function used to determine the uniqueness key for each item.
 *
 *     Receives:
 *       - item
 *       - index
 *
 *     Returns any value that can be used as a Map key.
 *
 * RETURN VALUE
 *   A new array containing only the first occurrence of each unique key.
 *
 * EXAMPLE
 *
 *   const users = [
 *     { id: 1, name: 'John' },
 *     { id: 2, name: 'Jane' },
 *     { id: 1, name: 'John Updated' },
 *   ]
 *
 *   const result = uniqueBy(
 *     users,
 *     (user) => user.id
 *   )
 *
 *   // [
 *   //   { id: 1, name: 'John' },
 *   //   { id: 2, name: 'Jane' },
 *   // ]
 *
 * BEHAVIOR
 *   - Preserves the first occurrence of each unique key.
 *   - Preserves the original array order.
 *   - Does not mutate the original array.
 *   - Returns a new array.
 *   - Supports any key type accepted by JavaScript's Map.
 *
 * KEY EQUALITY
 *   Keys are compared using Map's SameValueZero semantics.
 *
 *   This means, for example:
 *
 *     NaN === NaN
 *     // false
 *
 *   but Map treats two NaN keys as the same key.
 *
 * OBJECT KEYS
 *   If `getKey` returns an object, uniqueness is based on the object's
 *   reference, not its contents.
 *
 *   For example:
 *
 *     uniqueBy(items, item => item.metadata)
 *
 *   only considers two items duplicates if they reference the same
 *   `metadata` object.
 *
 *   If uniqueness needs to be based on object contents, return a stable
 *   primitive key instead.
 *
 * EXAMPLES
 *
 *   uniqueBy(users, user => user.id)
 *
 *   uniqueBy(products, product => product.category)
 *
 *   uniqueBy(items, item => `${item.type}:${item.id}`)
 *
 * ERROR BEHAVIOR
 *   If `getKey` throws, the error is intentionally allowed to propagate.
 *
 *   Silently ignoring an item when its uniqueness key cannot be calculated
 *   could produce incomplete or misleading data.
 *
 * PERFORMANCE
 *   Time complexity: O(n) on average.
 *   Space complexity: O(n).
 *
 *   A Set is used for efficient key membership checks.
 *
 * IMMUTABILITY
 *   The original array and its items are never modified.
 *
 * ----------------------------------------------------------------------------
 */

export function uniqueBy<T, K>(
    array: readonly T[],
    getKey: (item: T, index: number) => K
): T[] {
    const seen = new Set<K>()
    const result: T[] = []

    for (let index = 0; index < array.length; index++) {
        const item = array[index]
        const key = getKey(item, index)

        if (seen.has(key)) {
            continue
        }

        seen.add(key)
        result.push(item)
    }

    return result
}