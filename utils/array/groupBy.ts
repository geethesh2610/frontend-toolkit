/**
 * groupBy
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Groups array items into an object based on a key returned for each item.
 *
 *   Useful when transforming a flat collection into logical groups for
 *   rendering, reporting, filtering, or further data processing.
 *
 * PARAMETERS
 *   array
 *     The collection of items to group.
 *
 *   getKey
 *     Function that determines which group each item belongs to.
 *
 *     Receives:
 *       - item
 *       - index
 *
 *     Returns a string or number used as the group key.
 *
 * RETURN VALUE
 *   A record where each key represents a group and its value is an array
 *   containing all items belonging to that group.
 *
 * EXAMPLE
 *
 *   const users = [
 *     { name: 'John', department: 'Engineering' },
 *     { name: 'Jane', department: 'Design' },
 *     { name: 'Mike', department: 'Engineering' },
 *   ]
 *
 *   const grouped = groupBy(
 *     users,
 *     (user) => user.department
 *   )
 *
 *   // {
 *   //   Engineering: [
 *   //     { name: 'John', department: 'Engineering' },
 *   //     { name: 'Mike', department: 'Engineering' },
 *   //   ],
 *   //   Design: [
 *   //     { name: 'Jane', department: 'Design' },
 *   //   ],
 *   // }
 *
 * BEHAVIOR
 *   - Returns an empty object for an empty array.
 *   - Preserves the original item references.
 *   - Does not mutate the input array.
 *   - Items with the same key are placed in the same group.
 *   - Group insertion order follows the first occurrence of each key.
 *
 * KEY HANDLING
 *   The key can be a string or number.
 *
 *   Numeric keys are converted to JavaScript object property keys when
 *   stored in the resulting Record.
 *
 * ERROR BEHAVIOR
 *   If `getKey` throws, the error is intentionally allowed to propagate.
 *
 *   This is preferable to silently ignoring an item or returning incomplete
 *   data because a key-generation function failing usually indicates a
 *   programming/data error that the caller should handle.
 *
 * PERFORMANCE
 *   Time complexity: O(n)
 *   Space complexity: O(n)
 *
 *   Each item is processed exactly once.
 *
 * IMMUTABILITY
 *   The source array and its items are never modified.
 *
 * ----------------------------------------------------------------------------
 */

export function groupBy<T>(
    array: readonly T[],
    getKey: (item: T, index: number) => string | number
): Record<string, T[]> {
    return array.reduce<Record<string, T[]>>(
        (groups, item, index) => {
            const key = String(getKey(item, index))

            const group = groups[key]

            if (group) {
                group.push(item)
            } else {
                groups[key] = [item]
            }

            return groups
        },
        {}
    )
}