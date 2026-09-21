/**
 * rafThrottle
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Wraps a function so that, no matter how many times it's called, the
 *   wrapped function's body runs at most once per animation frame — using
 *   the LATEST arguments it was called with before that frame fires. Unlike
 *   a hook, this works anywhere (plain DOM event listeners, non-React code),
 *   not just inside components.
 *
 * WHEN TO USE
 *   - High-frequency DOM events attached OUTSIDE React (`scroll`, `resize`,
 *     `mousemove`, `drag`) where you want to read/write layout at most once
 *     per frame instead of once per event — the classic read/write
 *     batching technique for smooth 60fps interactions.
 *   - Inside a component, prefer this repo's `useDebounce`/`useThrottle`
 *     hooks for VALUES; reach for `rafThrottle` specifically when
 *     throttling a raw callback attached via `addEventListener`, not a
 *     React-rendered value.
 *
 * WHEN NOT TO USE
 *   - When you need a guaranteed minimum/maximum time interval — `rAF`
 *     fires roughly every ~16ms at 60Hz but PAUSES ENTIRELY in a background
 *     tab, so this is not a substitute for `setTimeout`-based throttling
 *     when work needs to continue while the tab is hidden.
 *   - When every call's arguments must be processed — this only keeps the
 *     LAST call's arguments per frame; earlier calls within the same frame
 *     are dropped, by design.
 *
 * PARAMETERS
 *   fn   The function to throttle to at most once per animation frame.
 *
 * RETURN VALUE
 *   A wrapped function with the same argument shape as `fn`, plus a
 *   `.cancel()` method that cancels a pending, not-yet-fired call — call it
 *   on cleanup (e.g. before `removeEventListener`) to avoid a stray call
 *   firing after you've stopped caring.
 *
 * BEHAVIOR
 *   The first call in an idle period schedules a `requestAnimationFrame`
 *   and returns immediately. Further calls before that frame fires just
 *   update the stored arguments — they don't schedule additional frames.
 *   When the frame fires, `fn` runs once with the most recent arguments.
 *
 * SSR / BROWSER CONSIDERATIONS
 *   `requestAnimationFrame` is browser-only. This utility doesn't add its
 *   own guard for that — it's meant to be attached to real DOM events,
 *   which only exist in the browser anyway, so calling the wrapped function
 *   in an environment without `rAF` throws the same way calling `rAF`
 *   directly would.
 *
 * USAGE
 *   const onScroll = rafThrottle(() => {
 *     headerRef.current!.style.transform = `translateY(${window.scrollY}px)`
 *   })
 *
 *   window.addEventListener('scroll', onScroll)
 *   // later: window.removeEventListener('scroll', onScroll); onScroll.cancel()
 * ----------------------------------------------------------------------------
 */

export interface RafThrottled<TArgs extends unknown[]> {
    (...args: TArgs): void
    cancel: () => void
}

export function rafThrottle<TArgs extends unknown[]>(fn: (...args: TArgs) => void): RafThrottled<TArgs> {
    let frameId: number | null = null
    let latestArgs: TArgs

    const throttled = ((...args: TArgs) => {
        latestArgs = args

        if (frameId !== null) return

        frameId = requestAnimationFrame(() => {
            frameId = null
            fn(...latestArgs)
        })
    }) as RafThrottled<TArgs>

    throttled.cancel = () => {
        if (frameId !== null) {
            cancelAnimationFrame(frameId)
            frameId = null
        }
    }

    return throttled
}
