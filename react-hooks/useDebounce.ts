/**
 * useDebounce
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Returns a debounced copy of a rapidly-changing value: it only updates
 *   after `delay` ms have passed without the input value changing again.
 *
 * WHEN TO USE
 *   - Search-as-you-type inputs where you don't want to fire a network
 *     request on every keystroke.
 *   - Any derived value/effect (API calls, expensive recalculation,
 *     `localStorage` writes) that should only run once the user has
 *     "settled" on a value.
 *
 * WHEN NOT TO USE
 *   - Debouncing a callback/function itself (e.g. an `onClick` handler) —
 *     that's `useDebouncedCallback`, a different shape of hook. This hook
 *     debounces a VALUE, not a function.
 *   - When you need the FIRST change to apply immediately (leading-edge
 *     debounce) — this is a trailing-edge-only implementation, which is
 *     what the vast majority of "debounce this input" use cases want.
 *   - Throttling (guaranteeing a minimum call rate while updates are
 *     ongoing) — that's a related but distinct behavior; use a throttle
 *     hook for that instead.
 *
 * PARAMETERS
 *   value   The fast-changing value to debounce. Any type — compared by
 *           reference/value equality only insofar as it's passed as an
 *           effect dependency, so passing a new object/array literal on
 *           every render will re-debounce on every render, same as any
 *           other `useEffect` dependency (this is expected `useEffect`
 *           semantics, not a bug in this hook).
 *   delay   Milliseconds to wait after the last change before updating the
 *           returned value. Required — there's no "sensible universal
 *           default" for how aggressively to debounce, so it's intentionally
 *           not optional.
 *
 * RETURN VALUE
 *   The debounced value. On initial render it equals `value` immediately
 *   (no artificial delay before the first paint). After that, it lags
 *   behind `value` by `delay` ms of "quiet time".
 *
 * BEHAVIOR
 *   - Trailing-edge only: every time `value` changes, the pending update is
 *     cancelled and a new `delay`-ms timer starts. The returned value only
 *     changes once `value` stops changing for a full `delay` ms.
 *   - Changing `delay` itself resets the current pending timer using the
 *     new delay.
 *
 * ERROR BEHAVIOR
 *   None possible — this is pure timer scheduling with no fallible API.
 *
 * SSR / BROWSER CONSIDERATIONS
 *   `setTimeout`/`clearTimeout` are available in both Node and browser
 *   environments, and the effect never runs during server rendering
 *   anyway, so this hook is SSR-safe with no guards needed. No
 *   `"use client"` requirement beyond whatever the consuming component
 *   already needs.
 *
 * CLEANUP
 *   The pending timeout is cleared whenever `value` or `delay` changes
 *   (before the new timer starts) and on unmount.
 *
 * USAGE
 *   const [query, setQuery] = useState('')
 *   const debouncedQuery = useDebounce(query, 300)
 *
 *   useEffect(() => {
 *     if (!debouncedQuery) return
 *     fetchSearchResults(debouncedQuery)
 *   }, [debouncedQuery])
 *
 *   <input value={query} onChange={(e) => setQuery(e.target.value)} />
 * ----------------------------------------------------------------------------
 */

import { useEffect, useState } from "react";

export function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [value, delay]);

    return debouncedValue;
}
