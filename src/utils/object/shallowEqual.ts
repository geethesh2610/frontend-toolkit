/**
 * shallowEqual
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Compares two values one level deep: primitives by `Object.is`, and
 *   objects/arrays by checking they have the same keys with `Object.is`-equal
 *   values, without recursing into nested objects/arrays. This is the exact
 *   comparison React itself uses for `React.memo`'s default prop comparison
 *   — exposed here so you can build the SAME comparison into a custom
 *   `areEqual` function, or use it outside of React entirely.
 *
 * WHEN TO USE
 *   - A custom `React.memo(Component, areEqual)` comparator, e.g. one that
 *     ignores specific props before falling back to a shallow check of the
 *     rest.
 *   - Bailing out of expensive recomputation when an object/array prop is
 *     "the same" in content even though a parent re-created it as a new
 *     reference (e.g. an inline `{ ...filters }` passed down every render).
 *
 * WHEN NOT TO USE
 *   - Comparing deeply nested structures where a change two levels down
 *     needs to be detected — this intentionally does NOT recurse; a nested
 *     object is only compared by reference. Needing a deep-equal check
 *     instead often means the data shape should be flatter, or the nested
 *     piece should be memoized/versioned separately.
 *   - As a substitute for memoization — this is a comparison function, not
 *     a cache; pair it with `useMemo`/`React.memo`.
 *
 * PARAMETERS
 *   a, b   The two values to compare.
 *
 * RETURN VALUE
 *   `true` if `a` and `b` are `Object.is`-equal, OR are both non-null
 *   objects with the same set of own enumerable keys where every value is
 *   pairwise `Object.is`-equal. `false` otherwise.
 *
 * BEHAVIOR
 *   `NaN` is considered equal to `NaN`, and `+0`/`-0` are considered
 *   UNEQUAL — matching `Object.is` (and therefore matching how React itself
 *   compares props), which differs from `===` on both counts. Arrays are
 *   compared the same way as plain objects (by own keys) — this is an
 *   intentional simplification; if you need array-specific semantics,
 *   compare `.length` yourself first.
 *
 * PERFORMANCE
 *   Time complexity: O(k), where k is the key count of the smaller object —
 *   a mismatched key count short-circuits immediately. No allocation beyond
 *   the two `Object.keys()` arrays.
 *
 * EXAMPLES
 *   shallowEqual({ a: 1, b: 2 }, { a: 1, b: 2 })       // true
 *   shallowEqual({ a: 1 }, { a: 1, b: undefined })     // false (key count differs)
 *   shallowEqual({ a: { x: 1 } }, { a: { x: 1 } })     // false (nested object, different reference)
 *   shallowEqual(NaN, NaN)                             // true
 * ----------------------------------------------------------------------------
 */

export function shallowEqual(a: unknown, b: unknown): boolean {
    if (Object.is(a, b)) return true

    if (typeof a !== 'object' || a === null || typeof b !== 'object' || b === null) {
        return false
    }

    const keysA = Object.keys(a)
    const keysB = Object.keys(b)

    if (keysA.length !== keysB.length) return false

    for (const key of keysA) {
        if (
            !Object.prototype.hasOwnProperty.call(b, key) ||
            !Object.is((a as Record<string, unknown>)[key], (b as Record<string, unknown>)[key])
        ) {
            return false
        }
    }

    return true
}
