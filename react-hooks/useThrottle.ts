/**
 * useThrottle
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Throttles a rapidly changing value so that the returned value updates
 *   at most once within the specified interval.
 *
 *   Unlike debouncing, throttling guarantees that updates can continue to
 *   occur while the input is changing. This makes it useful for values that
 *   need to remain reasonably current without updating on every change.
 *
 * WHEN TO USE
 *   - Throttling rapidly changing state before rendering expensive UI.
 *   - Limiting how frequently search/filter state is propagated.
 *   - Throttling scroll-related values.
 *   - Throttling mouse/pointer position values.
 *   - Limiting expensive calculations based on rapidly changing values.
 *   - Reducing the frequency of derived state updates.
 *
 * WHEN NOT TO USE
 *   - For API requests where you want to wait until the user stops typing.
 *     Use `useDebounce` instead.
 *   - For event handlers where you need leading/trailing function execution.
 *     A callback-based throttle may be more appropriate.
 *   - For animation-frame synchronization. Prefer requestAnimationFrame.
 *
 * PARAMETERS
 *   value
 *     The value that should be throttled.
 *
 *     Can be any JavaScript value:
 *
 *       string
 *       number
 *       boolean
 *       object
 *       array
 *       etc.
 *
 *   delay
 *     Minimum interval in milliseconds between returned value updates.
 *
 *     Must be a non-negative finite number.
 *
 *     Default: `300`.
 *
 *   options
 *
 *   options.leading
 *     Whether the first value should be emitted immediately.
 *
 *     Default: `true`.
 *
 *   options.trailing
 *     Whether the most recent value should be emitted after the throttle
 *     interval when additional values arrived during that interval.
 *
 *     Default: `true`.
 *
 * RETURN VALUE
 *   The throttled version of `value`.
 *
 *   The returned value does NOT necessarily equal the latest input value.
 *   It represents the latest value allowed by the throttle configuration.
 *
 * BEHAVIOR
 *   With:
 *
 *     delay = 300
 *
 *   and rapidly changing values:
 *
 *     A → B → C → D → E
 *
 *   the hook does not update its returned value for every input change.
 *
 *   With the default `leading: true` and `trailing: true`, the first value
 *   can be emitted immediately and the latest value is emitted at the end
 *   of the throttle interval.
 *
 * LEADING / TRAILING
 *
 *   leading: true, trailing: true
 *     Recommended general-purpose configuration.
 *
 *   leading: true, trailing: false
 *     Emit immediately, ignore updates until the interval expires.
 *
 *   leading: false, trailing: true
 *     Wait for the throttle interval before emitting.
 *
 *   leading: false, trailing: false
 *     No value updates while throttling is active. This configuration is
 *     generally not useful and is treated safely by the implementation.
 *
 * ERROR BEHAVIOR
 *   No runtime error is expected from the hook itself.
 *
 *   Invalid delays such as negative, NaN, or Infinity are normalized to `0`.
 *
 * SSR
 *   Fully SSR-safe.
 *
 *   No browser APIs are required.
 *
 * CLEANUP
 *   Any pending timeout is cleared when:
 *
 *   - the component unmounts
 *   - the delay changes
 *   - the leading/trailing configuration changes
 *
 * PERFORMANCE
 *   Uses a single timeout and React state.
 *
 *   It does not create a timer for every incoming value.
 *
 * IMPORTANT
 *   The hook throttles VALUE updates, not function calls.
 *
 *   Example:
 *
 *     const throttledSearch = useThrottle(search, 300)
 *
 *   If you need to throttle a callback such as:
 *
 *     handleMouseMove(event)
 *
 *   use a dedicated callback throttle abstraction instead.
 *
 * USAGE
 *
 *   const throttledValue = useThrottle(value, 300)
 *
 *   useEffect(() => {
 *     // Runs at most once per throttle interval.
 *   }, [throttledValue])
 *
 * ----------------------------------------------------------------------------
 */

import { useEffect, useRef, useState } from 'react'

export interface UseThrottleOptions {
    /**
     * Emit the first value immediately.
     *
     * Default: true.
     */
    leading?: boolean

    /**
     * Emit the latest value after the throttle interval.
     *
     * Default: true.
     */
    trailing?: boolean
}

function normalizeDelay(delay: number): number {
    if (!Number.isFinite(delay) || delay < 0) {
        return 0
    }

    return delay
}

export function useThrottle<T>(
    value: T,
    delay = 300,
    options: UseThrottleOptions = {}
): T {
    const {
        leading = true,
        trailing = true,
    } = options

    const normalizedDelay = normalizeDelay(delay)

    const [throttledValue, setThrottledValue] =
        useState<T>(value)

    const latestValueRef = useRef(value)
    const timeoutRef = useRef<
        ReturnType<typeof setTimeout> | null
    >(null)

    const lastExecutionTimeRef = useRef<number | null>(
        leading ? Date.now() : null
    )

    useEffect(() => {
        latestValueRef.current = value

        /*
         * A zero delay effectively disables throttling.
         */
        if (normalizedDelay === 0) {
            setThrottledValue(value)
            lastExecutionTimeRef.current = Date.now()

            return
        }

        const now = Date.now()

        /*
         * First value.
         */
        if (lastExecutionTimeRef.current === null) {
            if (leading) {
                setThrottledValue(value)
                lastExecutionTimeRef.current = now
            } else if (trailing) {
                timeoutRef.current = setTimeout(() => {
                    setThrottledValue(
                        latestValueRef.current
                    )

                    lastExecutionTimeRef.current =
                        Date.now()

                    timeoutRef.current = null
                }, normalizedDelay)
            }

            return
        }

        const elapsed =
            now - lastExecutionTimeRef.current

        const remaining =
            normalizedDelay - elapsed

        /*
         * The throttle window has expired.
         */
        if (remaining <= 0) {
            if (leading) {
                setThrottledValue(value)
                lastExecutionTimeRef.current = now
            } else if (trailing) {
                /*
                 * For leading=false, the current value becomes the trailing
                 * value once the previous throttle window has completed.
                 */
                setThrottledValue(value)
                lastExecutionTimeRef.current = now
            }

            return
        }

        /*
         * A trailing update is already scheduled.
         */
        if (!trailing || timeoutRef.current !== null) {
            return
        }

        timeoutRef.current = setTimeout(() => {
            setThrottledValue(
                latestValueRef.current
            )

            lastExecutionTimeRef.current =
                Date.now()

            timeoutRef.current = null
        }, remaining)

        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
        }
    }, [
        value,
        normalizedDelay,
        leading,
        trailing,
    ])

    /*
     * Always clean up any timer when the component unmounts.
     */
    useEffect(() => {
        return () => {
            if (timeoutRef.current !== null) {
                clearTimeout(timeoutRef.current)
                timeoutRef.current = null
            }
        }
    }, [])

    return throttledValue
}