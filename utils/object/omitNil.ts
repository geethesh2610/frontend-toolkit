/**
 * omitNil
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Creates a new object with all properties whose values are `null` or
 *   `undefined` removed.
 *
 *   Unlike truthiness-based filtering, valid falsy values such as:
 *
 *     0
 *     false
 *     ''
 *
 *   are preserved.
 *
 * PARAMETERS
 *   object
 *     The source object.
 *
 * RETURN VALUE
 *   A new object containing all properties whose values are neither
 *   `null` nor `undefined`.
 *
 * TYPE SAFETY
 *   The returned object preserves the same object shape at compile time.
 *
 * EXAMPLES
 *
 *   const user = {
 *     id: 10,
 *     name: 'John',
 *     email: null,
 *     phone: undefined,
 *   }
 *
 *   omitNil(user)
 *
 *   // {
 *   //   id: 10,
 *   //   name: 'John',
 *   // }
 *
 * IMPORTANT
 *   Only `null` and `undefined` are removed.
 *
 *     omitNil({
 *       count: 0,
 *       active: false,
 *       name: '',
 *       value: null,
 *       other: undefined,
 *     })
 *
 *     // {
 *     //   count: 0,
 *     //   active: false,
 *     //   name: '',
 *     // }
 *
 *   This is intentional.
 *
 *   Do NOT implement this using:
 *
 *     Boolean(value)
 *
 *   because that would incorrectly remove valid values such as 0 and false.
 *
 * USE CASES
 *   - Cleaning API request payloads.
 *   - Removing optional query parameters.
 *   - Preparing PATCH request bodies.
 *   - Removing nullable fields before serialization.
 *   - Cleaning form submission data.
 *
 * IMMUTABILITY
 *   The original object is never modified.
 *
 * SHALLOW OPERATION
 *   Only properties directly on the supplied object are checked.
 *
 *   Nested objects are not recursively cleaned.
 *
 * ERROR BEHAVIOR
 *   Throws a TypeError when the supplied value is null or undefined.
 *
 *   An empty object returns a new empty object.
 *
 * PERFORMANCE
 *   Time complexity: O(n)
 *   Space complexity: O(n)
 *
 * ----------------------------------------------------------------------------
 */

export function omitNil<T extends Record<PropertyKey, unknown>>(
    object: T
): T {
    if (object == null) {
        throw new TypeError(
            'omitNil: object must not be null or undefined.'
        )
    }

    const result = {} as T

    for (const key of Reflect.ownKeys(object)) {
        const value = object[key]

        if (value !== null && value !== undefined) {
            Object.defineProperty(
                result,
                key,
                Object.getOwnPropertyDescriptor(object, key)!
            )
        }
    }

    return result
}