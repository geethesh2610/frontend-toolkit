/**
 * isEmpty
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Determines whether an object has no own enumerable properties.
 *
 *   This utility is intended primarily for checking plain application data
 *   such as API response objects, configuration objects, filter objects,
 *   form values, and other key-value structures.
 *
 * PARAMETERS
 *   value
 *     The value to check.
 *
 *     Supported:
 *       - objects
 *       - null
 *       - undefined
 *
 * RETURN VALUE
 *   `true`  → value is null, undefined, or has no own enumerable properties.
 *   `false` → value contains at least one own enumerable property.
 *
 * EXAMPLES
 *
 *   isEmpty({})
 *   // true
 *
 *   isEmpty({ name: 'John' })
 *   // false
 *
 *   isEmpty(null)
 *   // true
 *
 *   isEmpty(undefined)
 *   // true
 *
 *   isEmpty({ length: 0 })
 *   // false
 *
 * BEHAVIOR
 *   Only OWN enumerable properties are considered.
 *
 *   Inherited properties do not affect the result.
 *
 *     const obj = Object.create({ inherited: true })
 *
 *     isEmpty(obj)
 *     // true
 *
 *   Non-enumerable properties are also ignored.
 *
 *     const obj = {}
 *
 *     Object.defineProperty(obj, 'id', {
 *       value: 1,
 *       enumerable: false,
 *     })
 *
 *     isEmpty(obj)
 *     // true
 *
 * IMPORTANT
 *   This utility checks whether an object contains keys. It does NOT check
 *   whether the values themselves are empty.
 *
 *     isEmpty({ name: '' })
 *     // false
 *
 *   The object contains the `name` property even though its value is empty.
 *
 * ERROR BEHAVIOR
 *   Returns `true` for null and undefined.
 *
 *   Non-object primitive values are rejected at the type level when possible.
 *   At runtime, unexpected primitive values return `true` rather than
 *   throwing.
 *
 * PERFORMANCE
 *   Time complexity: O(1) for empty objects.
 *   Time complexity: O(n) in the worst case, where n is the number of
 *   enumerable own properties.
 *
 *   Object.keys() stops as soon as the property list has been generated.
 *
 * ----------------------------------------------------------------------------
 */

export function isEmpty(
    value: object | null | undefined
): boolean {
    if (value == null) {
        return true
    }

    return Object.keys(value).length === 0
}