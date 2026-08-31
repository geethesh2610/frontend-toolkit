/**
 * useScrollPosition
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Tracks the current scroll position of the browser window or a specific
 *   scrollable DOM element.
 *
 *   The hook listens to scroll events and exposes the current horizontal and
 *   vertical scroll position without requiring consumers to manually wire
 *   scroll listeners, cleanup, or requestAnimationFrame handling.
 *
 * WHEN TO USE
 *   - Show/hide a header based on scroll direction.
 *   - Show a "back to top" button.
 *   - Detect whether the user has scrolled past a threshold.
 *   - Update UI based on scroll position.
 *   - Track scrolling inside a specific scrollable container.
 *   - Implement sticky/floating UI behavior.
 *
 * WHEN NOT TO USE
 *   - For detecting whether an element has entered the viewport.
 *     Use `useIntersectionObserver` instead.
 *   - For continuously reading an element's dimensions.
 *     Use `ResizeObserver` / `useElementSize`.
 *   - For scroll-driven animations where CSS scroll-driven animations or a
 *     dedicated animation system would be more appropriate.
 *
 * PARAMETERS
 *   options
 *
 *   options.target
 *     Optional scroll target.
 *
 *     - Omitted → browser window.
 *     - `Window` → browser window.
 *     - `HTMLElement` → specific scrollable element.
 *     - `RefObject<HTMLElement>` → specific scrollable element via ref.
 *
 *   options.enabled
 *     Whether scroll tracking is active.
 *     Default: `true`.
 *
 *   options.throttle
 *     Minimum interval, in milliseconds, between React state updates.
 *
 *     Default: `0`.
 *
 *     When `0`, updates are synchronized using requestAnimationFrame so
 *     multiple scroll events in the same frame result in at most one React
 *     state update.
 *
 *     When greater than `0`, updates are additionally rate-limited to roughly
 *     the specified interval.
 *
 *   options.initialPosition
 *     Initial position returned before the browser position is read.
 *
 *     Default:
 *
 *       { x: 0, y: 0 }
 *
 *   options.onChange
 *     Optional callback invoked when the tracked position is updated.
 *
 * RETURN VALUE
 *   {
 *     x,
 *     y,
 *   }
 *
 *   x
 *     Current horizontal scroll position.
 *
 *   y
 *     Current vertical scroll position.
 *
 * BEHAVIOR
 *   - Reads the initial scroll position after mounting.
 *   - Listens to scroll events on the selected target.
 *   - Uses requestAnimationFrame to prevent multiple synchronous scroll events
 *     from causing excessive React updates within the same animation frame.
 *   - Supports window scrolling and element scrolling.
 *   - Uses the latest `onChange` callback without recreating the listener.
 *
 * WINDOW POSITION
 *   For the window target:
 *
 *     x → window.scrollX
 *     y → window.scrollY
 *
 * ELEMENT POSITION
 *   For an HTMLElement target:
 *
 *     x → element.scrollLeft
 *     y → element.scrollTop
 *
 * SSR / NEXT.JS
 *   Safe to import and render during SSR.
 *
 *   Browser APIs are accessed only after the component mounts.
 *
 *   In Next.js App Router, a component using this hook must be a Client
 *   Component because it relies on browser APIs.
 *
 * CLEANUP
 *   - Removes the scroll event listener on unmount.
 *   - Cancels any pending requestAnimationFrame.
 *   - Clears any pending throttle timer.
 *
 * PERFORMANCE
 *   Scroll events can fire very frequently.
 *
 *   The implementation does NOT directly call setState for every raw scroll
 *   event. Updates are scheduled through requestAnimationFrame.
 *
 *   This makes the hook suitable for normal UI behavior without requiring
 *   consumers to implement their own scroll-event optimization.
 *
 * IMPORTANT
 *   This hook tracks scroll POSITION only.
 *
 *   If you need scroll DIRECTION, derive it from this hook with `usePrevious`
 *   or create a dedicated `useScrollDirection` hook.
 *
 * USAGE
 *
 *   const { x, y } = useScrollPosition()
 *
 * USAGE WITH A THRESHOLD
 *
 *   const { y } = useScrollPosition()
 *
 *   const showBackToTop = y > 400
 *
 * USAGE WITH A SCROLLABLE ELEMENT
 *
 *   const containerRef = useRef<HTMLDivElement>(null)
 *
 *   const { x, y } = useScrollPosition({
 *     target: containerRef,
 *   })
 *
 * ----------------------------------------------------------------------------
 */

import {
    useEffect,
    useRef,
    useState,
    type RefObject,
} from 'react'

export interface ScrollPosition {
    x: number
    y: number
}

export interface UseScrollPositionOptions {
    /**
     * Window, HTMLElement, or ref to a scrollable HTMLElement.
     *
     * Defaults to the browser window.
     */
    target?:
    | Window
    | HTMLElement
    | RefObject<HTMLElement | null>
    | null

    /**
     * Whether scroll tracking is enabled.
     *
     * Default: `true`.
     */
    enabled?: boolean

    /**
     * Minimum interval between state updates in milliseconds.
     *
     * Default: `0`.
     *
     * Updates are still synchronized through requestAnimationFrame.
     */
    throttle?: number

    /**
     * Initial scroll position.
     *
     * Default: `{ x: 0, y: 0 }`.
     */
    initialPosition?: ScrollPosition

    /**
     * Called whenever the tracked scroll position is updated.
     */
    onChange?: (position: ScrollPosition) => void
}

export interface UseScrollPositionReturn extends ScrollPosition { }

function isRefObject(
    value: unknown
): value is RefObject<HTMLElement | null> {
    return (
        typeof value === 'object' &&
        value !== null &&
        'current' in value
    )
}

function resolveTarget(
    target:
        | Window
        | HTMLElement
        | RefObject<HTMLElement | null>
        | null
        | undefined
): Window | HTMLElement | null {
    if (target === undefined) {
        return typeof window !== 'undefined'
            ? window
            : null
    }

    if (target === null) {
        return null
    }

    if (isRefObject(target)) {
        return target.current
    }

    return target
}

function getScrollPosition(
    target: Window | HTMLElement
): ScrollPosition {
    if (target instanceof Window) {
        return {
            x: target.scrollX,
            y: target.scrollY,
        }
    }

    return {
        x: target.scrollLeft,
        y: target.scrollTop,
    }
}

export function useScrollPosition(
    options: UseScrollPositionOptions = {}
): UseScrollPositionReturn {
    const {
        target,
        enabled = true,
        throttle = 0,
        initialPosition = { x: 0, y: 0 },
        onChange,
    } = options

    const [position, setPosition] =
        useState<ScrollPosition>(initialPosition)

    const callbackRef = useRef(onChange)

    useEffect(() => {
        callbackRef.current = onChange
    }, [onChange])

    useEffect(() => {
        if (!enabled) {
            return
        }

        if (typeof window === 'undefined') {
            return
        }

        const scrollTarget = resolveTarget(target)

        if (!scrollTarget) {
            return
        }

        let animationFrameId: number | null = null
        let throttleTimeoutId: ReturnType<typeof setTimeout> | null = null
        let lastUpdateTime = 0

        const updatePosition = () => {
            const nextPosition = getScrollPosition(
                scrollTarget
            )

            setPosition(nextPosition)
            callbackRef.current?.(nextPosition)

            lastUpdateTime = Date.now()
        }

        const scheduleUpdate = () => {
            if (animationFrameId !== null) {
                return
            }

            const now = Date.now()
            const elapsed = now - lastUpdateTime

            if (throttle > 0 && elapsed < throttle) {
                if (throttleTimeoutId !== null) {
                    return
                }

                throttleTimeoutId = setTimeout(() => {
                    throttleTimeoutId = null
                    scheduleUpdate()
                }, throttle - elapsed)

                return
            }

            animationFrameId = window.requestAnimationFrame(() => {
                animationFrameId = null
                updatePosition()
            })
        }

        /*
         * Synchronize immediately with the current scroll position.
         */
        updatePosition()

        scrollTarget.addEventListener(
            'scroll',
            scheduleUpdate,
            { passive: true }
        )

        return () => {
            scrollTarget.removeEventListener(
                'scroll',
                scheduleUpdate
            )

            if (animationFrameId !== null) {
                window.cancelAnimationFrame(
                    animationFrameId
                )
            }

            if (throttleTimeoutId !== null) {
                clearTimeout(throttleTimeoutId)
            }
        }
    }, [
        target,
        enabled,
        throttle,
    ])

    return position
}