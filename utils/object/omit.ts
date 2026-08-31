/**
 * omit
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Creates a new object containing all properties from the source object
 *   except the specified keys.
 *
 *   The original object is never mutated.
 *
 * PARAMETERS
 *   object
 *     The source object.
 *
 *   keys
 *     One or more property names to exclude from the returned object.
 *
 * RETURN VALUE
 *   A new object containing all properties except the omitted keys.
 *
 * TYPE SAFETY
 *   The returned type automatically excludes the specified keys.
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
 *   const safeUser = omit(user, ['password'])
 *
 *   // {
 *   //   id: 1,
 *   //   name: 'John',
 *   //   email: 'john@example.com',
 *   // }
 *
 * MULTIPLE KEYS
 *
 *   omit(user, ['id', 'password'])
 *
 *   // {
 *   //   name: 'John',
 *   //   email: 'john@example.com',
 *   // }
 *
 * IMMUTABILITY
 *   The source object is never modified.
 *
 *     const user = { id: 1, name: 'John' }
 *     const result = omit(user, ['id'])
 *
 *     user
 *     // { id: 1, name: 'John' }
 *
 *     result
 *     // { name: 'John' }
 *
 * USE CASES
 *   - Removing sensitive fields before sending data to the UI.
 *   - Preparing API request payloads.
 *   - Removing internal IDs from form submission data.
 *   - Creating objects with a subset of properties.
 *   - Removing fields before comparison or serialization.
 *
 * ERROR BEHAVIOR
 *   Throws a TypeError if the provided value is null or undefined.
 *
 *   An empty keys array returns a shallow copy of the source object.
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
 *   The returned object shares the same `address` reference.
 *
 * PERFORMANCE
 *   Time complexity: O(n)
 *   Space complexity: O(n)
 *
 * ----------------------------------------------------------------------------
 */

export function omit<
    T extends Record<PropertyKey, unknown>,
    K extends keyof T
>(
    object: T,
    keys: readonly K[]
): Omit<T, K> {
    if (object == null) {
        throw new TypeError(
            'omit: object must not be null or undefined.'
        )
    }

    if (keys.length === 0) {
        return { ...object } as Omit<T, K>
    }

    const keysToOmit = new Set<PropertyKey>(keys)

    const result = {} as Omit<T, K>

    for (const key of Reflect.ownKeys(object)) {
        if (!keysToOmit.has(key)) {
            Object.defineProperty(
                result,
                key,
                Object.getOwnPropertyDescriptor(object, key)!
            )
        }
    }

    return result
}