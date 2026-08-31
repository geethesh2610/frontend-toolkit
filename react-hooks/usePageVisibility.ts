/**
 * usePageVisibility
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Tracks whether the current browser document is visible to the user using
 *   the native Page Visibility API.
 *
 *   This hook returns `true` when the document is visible and `false` when
 *   the document is hidden, such as when the user switches to another tab,
 *   minimizes the browser, or otherwise moves the page out of visibility.
 *
 * WHEN TO USE
 *   - Pause polling while the tab is hidden.
 *   - Resume or refresh data when the user returns to the tab.
 *   - Pause expensive animations or timers.
 *   - Pause videos or other media-related behavior.
 *   - Reduce unnecessary background processing.
 *   - Change notification behavior depending on whether the user is
 *     currently viewing the application.
 *   - Optimize live dashboards and monitoring pages.
 *
 * WHEN NOT TO USE
 *   - To determine whether the browser window has focus.
 *   - To determine whether the user is actively interacting with the page.
 *   - To determine whether the device is online.
 *   - For responsive layout behavior — use CSS media queries instead.
 *
 *   IMPORTANT
 *   `document.visibilityState === 'visible'` does not necessarily mean the
 *   user is actively looking at or interacting with the page.
 *
 *   It only indicates that the document is considered visible by the browser.
 *
 * PARAMETERS
 *   None.
 *
 * RETURN VALUE
 *   boolean
 *
 *   `true`
 *     The document is currently visible.
 *
 *   `false`
 *     The document is currently hidden.
 *
 * SSR / NEXT.JS
 *   Safe to use during SSR.
 *
 *   `document` is accessed only inside a browser-safe effect.
 *
 *   Because the server has no concept of browser tab visibility, the initial
 *   value is `true` and is synchronized with the actual browser state after
 *   mounting.
 *
 * HYDRATION
 *   The initial value is deterministic so the server and initial client
 *   render do not access browser-only APIs.
 *
 *   After mounting, the hook synchronizes with `document.visibilityState`.
 *
 * BEHAVIOR
 *   - Reads the current document visibility when mounted.
 *   - Listens for the native `visibilitychange` event.
 *   - Updates the returned value whenever the document's visibility changes.
 *   - Does not use polling or timers.
 *
 * ERROR BEHAVIOR
 *   No error state is exposed.
 *
 *   The Page Visibility API is an environmental browser state rather than an
 *   application error.
 *
 * CLEANUP
 *   The `visibilitychange` listener is removed when the component unmounts.
 *
 * PERFORMANCE
 *   No polling is used.
 *
 *   The browser notifies the hook only when the document's visibility state
 *   changes.
 *
 * IMPORTANT DISTINCTION
 *   This hook is different from `useOnlineStatus`.
 *
 *   useOnlineStatus:
 *     "Does the browser report that I have network connectivity?"
 *
 *   usePageVisibility:
 *     "Is this document currently visible?"
 *
 *   They can be combined for network-heavy applications:
 *
 *     const isOnline = useOnlineStatus()
 *     const isVisible = usePageVisibility()
 *
 *     const shouldPoll = isOnline && isVisible
 *
 * USAGE
 *
 *   const isVisible = usePageVisibility()
 *
 *   useEffect(() => {
 *     if (!isVisible) {
 *       return
 *     }
 *
 *     // Start/resume work while the page is visible.
 *   }, [isVisible])
 *
 * ----------------------------------------------------------------------------
 */

import { useEffect, useState } from 'react'

export function usePageVisibility(): boolean {
    /*
     * `true` provides a deterministic SSR-safe initial value.
     *
     * The actual browser visibility state is synchronized inside the effect
     * after the component mounts.
     */
    const [isVisible, setIsVisible] = useState(true)

    useEffect(() => {
        if (typeof document === 'undefined') {
            return
        }

        /*
         * Synchronize immediately with the actual browser state.
         */
        setIsVisible(document.visibilityState === 'visible')

        const handleVisibilityChange = () => {
            setIsVisible(
                document.visibilityState === 'visible'
            )
        }

        document.addEventListener(
            'visibilitychange',
            handleVisibilityChange
        )

        return () => {
            document.removeEventListener(
                'visibilitychange',
                handleVisibilityChange
            )
        }
    }, [])

    return isVisible
}