/**
 * useIntersectionObserver
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Observes the visibility/intersection of a DOM element relative to the
 *   viewport or a specified scrollable root using the native
 *   IntersectionObserver API.
 *
 *   Useful for lazy loading, infinite scrolling, reveal animations,
 *   analytics visibility tracking, sticky-section detection, and triggering
 *   work only when an element enters or leaves the user's viewport.
 *
 * WHEN TO USE
 *   - Lazy loading images/components.
 *   - Infinite scrolling / loading more data.
 *   - Triggering animations when content enters the viewport.
 *   - Tracking whether an element is visible to the user.
 *   - Starting expensive work only when an element becomes visible.
 *   - Observing an element inside a scrollable container.
 *
 * WHEN NOT TO USE
 *   - When you need the exact pixel position of an element. Use
 *     `getBoundingClientRect()` instead.
 *   - For simple viewport checks that do not need reactive updates.
 *   - For continuously tracking scroll position. IntersectionObserver is
 *     intentionally not a replacement for scroll events.
 *   - When a third-party component/library already owns the observer.
 *
 * PARAMETERS
 *   ref
 *     Ref pointing to the element that should be observed.
 *
 *   options.enabled
 *     Whether the observer should be active.
 *     Default: `true`.
 *
 *   options.root
 *     Element that acts as the viewport for intersection calculations.
 *     `null` means the browser viewport.
 *     Default: `null`.
 *
 *   options.rootMargin
 *     Margin around the root used when calculating intersection.
 *     Supports CSS-like values such as:
 *
 *       '100px'
 *       '100px 0px'
 *       '0px 0px 200px 0px'
 *
 *     Default: `'0px'`.
 *
 *   options.threshold
 *     A number or array of numbers indicating how much of the target must
 *     intersect before an observer callback is triggered.
 *
 *       0   → enters/leaves the intersection area.
 *       0.5 → approximately 50% visibility.
 *       1   → completely visible.
 *
 *     Default: `0`.
 *
 *   options.freezeOnceVisible
 *     When `true`, the observer stops observing after the target becomes
 *     intersecting for the first time.
 *
 *     Useful for one-time lazy loading or reveal animations.
 *
 *     Default: `false`.
 *
 *   options.onChange
 *     Optional callback invoked whenever the IntersectionObserver reports
 *     an intersection change.
 *
 *     The callback receives the complete IntersectionObserverEntry.
 *
 * RETURN VALUE
 *   {
 *     isIntersecting,
 *     entry,
 *   }
 *
 *   isIntersecting
 *     Whether the target is currently intersecting the observer root.
 *
 *   entry
 *     The latest IntersectionObserverEntry, or `null` before the observer
 *     has produced its first result.
 *
 * BEHAVIOR
 *   - The target is observed when `enabled` is true and the ref contains
 *     a DOM element.
 *   - The observer is disconnected when disabled or unmounted.
 *   - Changing observer configuration recreates the observer with the new
 *     configuration.
 *   - The latest `onChange` callback is used without recreating the observer
 *     merely because the callback identity changes.
 *   - When `freezeOnceVisible` is enabled, observation stops after the first
 *     intersecting entry.
 *
 * ERROR BEHAVIOR
 *   IntersectionObserver is a browser API and may not exist in some
 *   environments.
 *
 *   If the API is unavailable, the hook safely does nothing and keeps:
 *
 *     isIntersecting === false
 *     entry === null
 *
 *   No error state is exposed because lack of browser support is generally
 *   not a recoverable runtime error for this hook.
 *
 * SSR / NEXT.JS
 *   Safe to import and render during SSR.
 *
 *   `IntersectionObserver` is accessed only inside `useEffect`, after the
 *   component has mounted in the browser.
 *
 *   In Next.js App Router, the component using this hook must be a Client
 *   Component because the hook relies on browser APIs.
 *
 * CLEANUP
 *   The observer is disconnected when:
 *
 *   - The component unmounts.
 *   - `enabled` becomes false.
 *   - The target changes.
 *   - `root`, `rootMargin`, or `threshold` changes.
 *   - The observer freezes after the target becomes visible.
 *
 * PERFORMANCE
 *   IntersectionObserver is preferable to manually listening to scroll
 *   events for visibility detection because intersection calculations are
 *   handled by the browser and callbacks are not fired for every scroll
 *   event.
 *
 * USAGE
 *
 *   const sectionRef = useRef<HTMLDivElement>(null)
 *
 *   const { isIntersecting, entry } = useIntersectionObserver(sectionRef)
 *
 *   return (
 *     <section ref={sectionRef}>
 *       {isIntersecting && <ExpensiveComponent />}
 *     </section>
 *   )
 *
 * ----------------------------------------------------------------------------
 */

import { useEffect, useRef, useState, type RefObject } from 'react'

export interface UseIntersectionObserverOptions {
    /** Whether the observer is active. Default: `true`. */
    enabled?: boolean

    /**
     * Element used as the viewport for intersection calculations.
     * `null` means the browser viewport.
     */
    root?: Element | null

    /**
     * Margin around the root used when calculating intersections.
     * Default: `'0px'`.
     */
    rootMargin?: string

    /**
     * Percentage(s) of visibility at which the observer callback fires.
     * Default: `0`.
     */
    threshold?: number | number[]

    /**
     * Stop observing after the element becomes visible once.
     * Default: `false`.
     */
    freezeOnceVisible?: boolean

    /**
     * Called whenever the IntersectionObserver reports a new entry.
     */
    onChange?: (entry: IntersectionObserverEntry) => void
}

export interface UseIntersectionObserverReturn {
    /** Whether the observed element is currently intersecting the root. */
    isIntersecting: boolean

    /** Latest IntersectionObserverEntry, or `null` before the first result. */
    entry: IntersectionObserverEntry | null
}

export function useIntersectionObserver(
    ref: RefObject<Element | null>,
    options: UseIntersectionObserverOptions = {}
): UseIntersectionObserverReturn {
    const {
        enabled = true,
        root = null,
        rootMargin = '0px',
        threshold = 0,
        freezeOnceVisible = false,
        onChange,
    } = options

    const [entry, setEntry] = useState<IntersectionObserverEntry | null>(null)

    const callbackRef = useRef(onChange)

    useEffect(() => {
        callbackRef.current = onChange
    }, [onChange])

    const hasIntersectedRef = useRef(false)

    useEffect(() => {
        if (!enabled) {
            return
        }

        if (typeof window === 'undefined') {
            return
        }

        if (!('IntersectionObserver' in window)) {
            return
        }

        const target = ref.current

        if (!target) {
            return
        }

        if (freezeOnceVisible && hasIntersectedRef.current) {
            return
        }

        const observer = new IntersectionObserver(
            ([observerEntry]) => {
                if (!observerEntry) {
                    return
                }

                setEntry(observerEntry)

                callbackRef.current?.(observerEntry)

                if (
                    freezeOnceVisible &&
                    observerEntry.isIntersecting
                ) {
                    hasIntersectedRef.current = true
                    observer.unobserve(target)
                }
            },
            {
                root,
                rootMargin,
                threshold,
            }
        )

        observer.observe(target)

        return () => {
            observer.disconnect()
        }
    }, [
        enabled,
        ref,
        root,
        rootMargin,
        threshold,
        freezeOnceVisible,
    ])

    return {
        isIntersecting: entry?.isIntersecting ?? false,
        entry,
    }
}