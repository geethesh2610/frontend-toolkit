/**
 * pick
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Creates a new object containing only the specified properties from the
 *   source object.
 *
 *   The original object is never mutated.
 *
 * PARAMETERS
 *   object
 *     The source object.
 *
 *   keys
 *     One or more property names to include in the returned object.
 *
 * RETURN VALUE
 *   A new object containing only the requested properties.
 *
 * TYPE SAFETY
 *   The returned type automatically contains only the selected keys.
 *
 * EXAMPLES
 *
 *   const user = {
 *     id: 1,
 *     name: 'John',
 *     email: 'john@example.com',
 *     password: 'secret',
 *   }
 *
 *   const result = pick(user, ['id', 'name'])
 *
 *   // {
 *   //   id: 1,
 *   //   name: 'John',
 *   // }
 *
 * MULTIPLE KEYS
 *
 *   pick(user, ['id', 'email'])
 *
 *   // {
 *     id: 1,
 *     email: 'john@example.com',
 *   }
 *
 * IMMUTABILITY
 *   The source object is never modified.
 *
 * SHALLOW COPY
 *   This utility performs a shallow copy.
 *
 *   Nested objects and arrays are not cloned.
 *
 *     const user = {
 *       name: 'John',
 *       address: {
 *         city: 'Kochi',
 *       },
 *     }
 *
 *   const result = pick(user, ['address'])
 *
 *   result.address === user.address
 *   // true
 *
 * USE CASES
 *   - Creating API payloads with only required fields.
 *   - Selecting fields for table/list rendering.
 *   - Creating view models from larger API responses.
 *   - Removing unrelated properties before passing data to another function.
 *   - Selecting fields for logging or serialization.
 *
 * ERROR BEHAVIOR
 *   Throws a TypeError if the supplied object is null or undefined.
 *
 *   An empty keys array returns a new empty object.
 *
 *   Requested keys that do not exist at runtime are simply not included.
 *
 * PERFORMANCE
 *   Time complexity: O(k), where k is the number of requested keys.
 *   Space complexity: O(k).
 *
 * ----------------------------------------------------------------------------
 */

export function pick<
    T extends Record<PropertyKey, unknown>,
    K extends keyof T
>(
    object: T,
    keys: readonly K[]
): Pick<T, K> {
    if (object == null) {
        throw new TypeError(
            'pick: object must not be null or undefined.'
        )
    }

    const result = {} as Pick<T, K>

    for (const key of keys) {
        if (Object.prototype.hasOwnProperty.call(object, key)) {
            Object.defineProperty(
                result,
                key,
                Object.getOwnPropertyDescriptor(object, key)!
            )
        }
    }

    return result
}