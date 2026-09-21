/**
 * useStableCallback
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Wraps a function so the RETURNED function's identity never changes
 *   across renders, while it always invokes the most recently rendered
 *   version of `callback` when called. This is the "stable identity, fresh
 *   closure" pattern — similar in spirit to React's experimental
 *   `useEffectEvent`, implemented here on `useLatest` instead of an
 *   unstable API.
 *
 * WHEN TO USE
 *   - Passing an event handler to a memoized child (`React.memo`) where you
 *     don't want the child to re-render just because the parent re-created
 *     the handler function on every render.
 *   - Putting a handler in a `useEffect` dependency array without either
 *     disabling the exhaustive-deps lint rule or re-running the effect on
 *     every render the handler's closure changes.
 *
 * WHEN NOT TO USE
 *   - As a blanket replacement for `useCallback` — if a `useCallback`'s
 *     dependency array is small and correct, plain `useCallback` is simpler
 *     and communicates intent better. Reach for this specifically when the
 *     callback closes over frequently-changing values but its IDENTITY
 *     needs to stay stable regardless.
 *   - Expecting the callback to reflect the render it was PASSED in, rather
 *     than the render it's CALLED in — this always runs whichever version
 *     of `callback` was most recently rendered, which is correct for event
 *     handlers but can surprise you if you assumed otherwise.
 *
 * PARAMETERS
 *   callback   The function to wrap. Fine (expected) for this to be a new
 *              function every render — that's the whole point.
 *
 * RETURN VALUE
 *   A function with a STABLE identity across renders (the exact same
 *   reference every render) that, when called, invokes the latest
 *   `callback` with the same arguments and returns its result.
 *
 * PERFORMANCE
 *   O(1). The returned function is created exactly once per component
 *   instance and never changes — safe to pass to `useEffect`/`useMemo`
 *   dependency arrays or a memoized child without either ever re-running
 *   because of it.
 *
 * USAGE
 *   function SearchBox({ onSearch }: { onSearch: (q: string) => void }) {
 *     // Stable identity — MemoizedInput won't re-render just because
 *     // SearchBox re-rendered and recreated this handler.
 *     const handleSearch = useStableCallback(onSearch)
 *     return <MemoizedInput onChange={handleSearch} />
 *   }
 * ----------------------------------------------------------------------------
 */

import { useRef } from "react";

import { useLatest } from "./useLatest";

export function useStableCallback<TArgs extends unknown[], TReturn>(
    callback: (...args: TArgs) => TReturn,
): (...args: TArgs) => TReturn {
    const callbackRef = useLatest(callback);
    const stableRef = useRef((...args: TArgs) => callbackRef.current(...args));
    return stableRef.current;
}
