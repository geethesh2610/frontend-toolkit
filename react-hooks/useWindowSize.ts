/**
 * useWindowSize
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Tracks the current browser viewport dimensions and updates whenever the
 *   window is resized.
 *
 *   The hook provides the current viewport width and height without requiring
 *   consumers to manually subscribe to resize events or handle cleanup.
 *
 * WHEN TO USE
 *   - When JavaScript genuinely needs the current viewport dimensions.
 *   - Conditional behavior that cannot reasonably be handled with CSS.
 *   - Canvas/chart calculations based on viewport dimensions.
 *   - Positioning calculations that depend on viewport size.
 *   - Responsive behavior for third-party libraries that require dimensions.
 *   - Recalculating layout-dependent JavaScript state after a resize.
 *
 * WHEN NOT TO USE
 *   - For normal responsive layouts.
 *     Prefer CSS media queries first.
 *
 *   - For conditionally rendering components based only on screen size.
 *     Prefer CSS when possible.
 *
 *   - For detecting a specific media-query breakpoint.
 *     Use `useMediaQuery` instead.
 *
 *   - For measuring an individual DOM element.
 *     Use `useElementSize` instead.
 *
 * PARAMETERS
 *   options
 *
 *   options.enabled
 *     Whether resize tracking is active.
 *
 *     Default: `true`.
 *
 *     When false, no resize listener is attached.
 *
 *   options.initialSize
 *     Initial viewport dimensions returned before the browser dimensions are
 *     available.
 *
 *     Default:
 *
 *       {
 *         width: 0,
 *         height: 0,
 *       }
 *
 *     Using `0` makes the server-rendered value deterministic and avoids
 *     directly accessing `window` during rendering.
 *
 * RETURN VALUE
 *   {
 *     width,
 *     height,
 *   }
 *
 *   width
 *     Current viewport width in CSS pixels.
 *
 *   height
 *     Current viewport height in CSS pixels.
 *
 * SSR / NEXT.JS
 *   Safe during SSR.
 *
 *   The hook does not access `window` during render.
 *
 *   The initial dimensions are `{ width: 0, height: 0 }` by default and the
 *   actual viewport size is synchronized after mounting.
 *
 *   In Next.js App Router, a component using this hook must be a Client
 *   Component because viewport dimensions are browser-only information.
 *
 * HYDRATION
 *   The initial state is deterministic and does not depend on `window`.
 *
 *   The actual dimensions are read inside an effect after hydration.
 *
 * BEHAVIOR
 *   - Reads the viewport dimensions after mounting.
 *   - Listens for window resize events.
 *   - Uses requestAnimationFrame to batch rapid resize events.
 *   - Updates React state at most once per animation frame.
 *
 * PERFORMANCE
 *   Resize events can fire many times while a user is resizing the browser.
 *
 *   The implementation uses requestAnimationFrame so a burst of resize events
 *   does not result in a React state update for every native event.
 *
 * CLEANUP
 *   - Removes the resize listener on unmount.
 *   - Removes the listener when `enabled` becomes false.
 *   - Cancels any pending requestAnimationFrame.
 *
 * IMPORTANT
 *   `window.innerWidth` and `window.innerHeight` represent the viewport,
 *   not the physical screen resolution.
 *
 *   They are measured in CSS pixels.
 *
 * MOBILE CONSIDERATION
 *   Mobile browser viewport behavior can change as browser UI expands or
 *   collapses. If the application specifically needs the dynamic viewport
 *   dimensions on modern mobile browsers, consider `visualViewport`.
 *
 *   This hook intentionally uses the broadly supported `window.innerWidth`
 *   and `window.innerHeight` API.
 *
 * USAGE
 *
 *   const { width, height } = useWindowSize()
 *
 *   const isMobile = width < 768
 *
 * ----------------------------------------------------------------------------
 */

import { useEffect, useState } from 'react'

export interface WindowSize {
    width: number
    height: number
}

export interface UseWindowSizeOptions {
    /**
     * Whether resize tracking is active.
     *
     * Default: true.
     */
    enabled?: boolean

    /**
     * Initial dimensions used before the browser dimensions are available.
     *
     * Default: { width: 0, height: 0 }.
     */
    initialSize?: WindowSize
}

export function useWindowSize(
    options: UseWindowSizeOptions = {}
): WindowSize {
    const {
        enabled = true,
        initialSize = {
            width: 0,
            height: 0,
        },
    } = options

    const [size, setSize] = useState<WindowSize>(
        initialSize
    )

    useEffect(() => {
        if (!enabled) {
            return
        }

        if (typeof window === 'undefined') {
            return
        }

        let animationFrameId: number | null = null

        const getWindowSize = (): WindowSize => ({
            width: window.innerWidth,
            height: window.innerHeight,
        })

        const updateSize = () => {
            setSize(getWindowSize())
        }

        const handleResize = () => {
            /*
             * If an animation frame is already scheduled, there is no need
             * to schedule another one for the same frame.
             */
            if (animationFrameId !== null) {
                return
            }

            animationFrameId = window.requestAnimationFrame(() => {
                animationFrameId = null
                updateSize()
            })
        }

        /*
         * Synchronize immediately after mounting.
         */
        updateSize()

        window.addEventListener(
            'resize',
            handleResize,
            { passive: true }
        )

        return () => {
            window.removeEventListener(
                'resize',
                handleResize
            )

            if (animationFrameId !== null) {
                window.cancelAnimationFrame(
                    animationFrameId
                )
            }
        }
    }, [enabled])

    return size
}