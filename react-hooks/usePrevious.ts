/**
 * usePrevious
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Stores the value from the previous completed render and returns it during
 *   the current render.
 *
 *   This is useful when a component needs to compare the current value with
 *   what it was during the previous render.
 *
 * WHEN TO USE
 *   - Comparing previous and current props/state.
 *   - Detecting meaningful value changes.
 *   - Running logic based on a transition from one value to another.
 *   - Tracking previous pagination/filter/search values.
 *   - Comparing previous route/query values.
 *   - Debugging render-to-render state changes.
 *
 * WHEN NOT TO USE
 *   - When you need application-wide state/history.
 *   - When you need a list of all previous values.
 *   - When you need undo/redo functionality.
 *   - When you need the previous value synchronously inside the same
 *     state update.
 *
 * PARAMETERS
 *   value
 *     The value whose previous render value should be retained.
 *
 *     Can be any JavaScript value, including:
 *
 *       string
 *       number
 *       boolean
 *       object
 *       array
 *       function
 *       null
 *       undefined
 *
 * RETURN VALUE
 *   The value from the previous completed render.
 *
 *   On the first render:
 *
 *       undefined
 *
 *   On subsequent renders:
 *
 *       previous render's value
 *
 *   Because `undefined` is a valid JavaScript value, consumers should treat
 *   the first render as having no previous value rather than assuming that
 *   `undefined` always means the previous value itself was undefined.
 *
 * BEHAVIOR
 *   The previous value is updated inside `useEffect`, which means the value
 *   returned during render always represents the value from the previous
 *   completed render.
 *
 *   Example:
 *
 *       Render 1:
 *         value = "A"
 *         previous = undefined
 *
 *       Render 2:
 *         value = "B"
 *         previous = "A"
 *
 *       Render 3:
 *         value = "C"
 *         previous = "B"
 *
 *   Updating the previous value does NOT cause another render.
 *
 * REACT CONSIDERATIONS
 *   The value is intentionally updated after rendering rather than during
 *   rendering. Mutating the ref during render can produce incorrect behavior
 *   with React's concurrent rendering model.
 *
 *   Using an effect means the hook represents the previous committed render,
 *   rather than an abandoned or interrupted render.
 *
 * SSR
 *   Fully SSR-safe.
 *
 *   No browser APIs are used.
 *
 * CLEANUP
 *   None required.
 *
 * PERFORMANCE
 *   Uses a single ref and does not trigger additional renders when the
 *   previous value is updated.
 *
 * USAGE
 *
 *   const previousCount = usePrevious(count)
 *
 *   if (
 *       previousCount !== undefined &&
 *       previousCount !== count
 *   ) {
 *       // Count changed.
 *   }
 *
 * ----------------------------------------------------------------------------
 */

import { useEffect, useRef } from 'react'

export function usePrevious<T>(value: T): T | undefined {
    const previousValueRef = useRef<T | undefined>(undefined)

    useEffect(() => {
        previousValueRef.current = value
    }, [value])

    return previousValueRef.current
}