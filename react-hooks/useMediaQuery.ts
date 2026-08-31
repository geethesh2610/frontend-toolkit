/**
 * useMediaQuery
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   React hook for reactively matching a CSS media query using the browser's
 *   native `window.matchMedia()` API.
 *
 *   The hook keeps React state synchronized with the browser's media-query
 *   result and updates automatically when the viewport or relevant browser
 *   conditions change.
 *
 * WHEN TO USE
 *   - Responsive behavior that genuinely needs JavaScript.
 *   - Detecting viewport breakpoints.
 *   - Detecting reduced-motion preferences.
 *   - Detecting dark/light color-scheme preferences.
 *   - Detecting pointer/hover capabilities.
 *   - Enabling/disabling browser-side behavior based on media features.
 *
 *   Example:
 *
 *     const isMobile = useMediaQuery('(max-width: 767px)')
 *
 * WHEN NOT TO USE
 *   - For purely visual responsive styling.
 *   - When CSS media queries can solve the problem.
 *
 *   Prefer CSS for layout and presentation:
 *
 *     @media (max-width: 767px) {
 *       ...
 *     }
 *
 *   Use this hook only when JavaScript actually needs to know the media-query
 *   state.
 *
 * PARAMETERS
 *   query
 *     A valid CSS media query string.
 *
 *     Examples:
 *
 *       '(max-width: 767px)'
 *       '(min-width: 768px)'
 *       '(prefers-color-scheme: dark)'
 *       '(prefers-reduced-motion: reduce)'
 *       '(hover: hover)'
 *       '(pointer: coarse)'
 *
 *   options.defaultValue
 *     Value returned before the browser can evaluate the media query.
 *
 *     Default: `false`.
 *
 *     This is primarily useful for SSR/hydration scenarios. The server cannot
 *     know the user's actual viewport or browser preference, so a deterministic
 *     initial value must be chosen.
 *
 *   options.initializeWithValue
 *     Whether to evaluate the media query immediately when the hook runs in a
 *     browser environment.
 *
 *     Default: `true`.
 *
 *     Set this to `false` when you intentionally want the initial value to
 *     remain `defaultValue` until the client-side effect runs.
 *
 * RETURN VALUE
 *   boolean
 *
 *   `true`
 *     The media query currently matches.
 *
 *   `false`
 *     The media query currently does not match.
 *
 * BEHAVIOR
 *   - Creates a native `MediaQueryList` using `window.matchMedia()`.
 *   - Subscribes to changes using the modern `change` event.
 *   - Updates React state whenever the media-query result changes.
 *   - Removes the listener when the component unmounts or when the query
 *     changes.
 *   - Recreates the subscription when the query changes.
 *
 * SSR / NEXT.JS
 *   Fully safe to import during SSR.
 *
 *   `window.matchMedia()` is never called during server rendering.
 *
 *   Because the server cannot know the client's actual media-query result,
 *   the hook uses `defaultValue` during the initial render.
 *
 *   In Next.js App Router, a component that calls this hook must be a
 *   Client Component because it relies on browser APIs.
 *
 * HYDRATION
 *   The server and initial client render use the same `defaultValue`, which
 *   avoids rendering different values between SSR and hydration.
 *
 *   After the component mounts, the hook synchronizes with the actual browser
 *   media-query result.
 *
 * BROWSER COMPATIBILITY
 *   Modern browsers support `MediaQueryList.addEventListener('change', ...)`.
 *
 *   A small fallback to the legacy `addListener/removeListener` API is
 *   included for environments that do not expose the modern event API.
 *
 * ERROR BEHAVIOR
 *   An invalid media query can cause `window.matchMedia()` to throw in some
 *   environments.
 *
 *   The hook safely catches that failure and falls back to `defaultValue`
 *   rather than allowing a rendering-related browser error to crash the
 *   component.
 *
 *   Invalid queries should still be treated as a developer configuration
 *   error and corrected rather than relied upon as normal behavior.
 *
 * CLEANUP
 *   The media-query listener is removed:
 *
 *   - When the component unmounts.
 *   - When `query` changes.
 *   - When the effect is re-run.
 *
 * PERFORMANCE
 *   The hook creates only one `MediaQueryList` subscription for the current
 *   query.
 *
 *   It does NOT listen to `resize` events directly, which avoids unnecessary
 *   JavaScript work for every resize event.
 *
 * IMPORTANT
 *   Do not use this hook as a replacement for CSS responsive design.
 *
 *   If the requirement is:
 *
 *     "Make this element two columns on desktop and one column on mobile."
 *
 *   CSS should handle it.
 *
 *   If the requirement is:
 *
 *     "Only start this JavaScript behavior when the viewport is desktop-sized."
 *
 *   This hook is appropriate.
 *
 * USAGE
 *
 *   const isMobile = useMediaQuery('(max-width: 767px)')
 *
 *   if (isMobile) {
 *     ...
 *   }
 *
 * ----------------------------------------------------------------------------
 */

import { useEffect, useState } from 'react'

export interface UseMediaQueryOptions {
    /**
     * Value returned before the browser can evaluate the media query.
     * Default: `false`.
     */
    defaultValue?: boolean

    /**
     * Whether the media query should be evaluated immediately in a browser
     * environment.
     *
     * Default: `true`.
     */
    initializeWithValue?: boolean
}

export function useMediaQuery(
    query: string,
    options: UseMediaQueryOptions = {}
): boolean {
    const {
        defaultValue = false,
        initializeWithValue = true,
    } = options

    const [matches, setMatches] = useState<boolean>(() => {
        /*
         * Never access window during SSR.
         *
         * When initializeWithValue is disabled, always start with the
         * deterministic default value and let the effect synchronize later.
         */
        if (
            !initializeWithValue ||
            typeof window === 'undefined'
        ) {
            return defaultValue
        }

        try {
            return window.matchMedia(query).matches
        } catch {
            return defaultValue
        }
    })

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        let mediaQuery: MediaQueryList

        try {
            mediaQuery = window.matchMedia(query)
        } catch {
            setMatches(defaultValue)
            return
        }

        /*
         * Keep React state synchronized with the browser's current result.
         *
         * This is important when initializeWithValue is false, but it also
         * protects against the browser result changing between the initial
         * render and effect execution.
         */
        setMatches(mediaQuery.matches)

        const handleChange = (event: MediaQueryListEvent) => {
            setMatches(event.matches)
        }

        /*
         * Modern browsers.
         */
        if (typeof mediaQuery.addEventListener === 'function') {
            mediaQuery.addEventListener('change', handleChange)

            return () => {
                mediaQuery.removeEventListener('change', handleChange)
            }
        }

        /*
         * Legacy browser fallback.
         *
         * TypeScript's current DOM definitions may not expose these methods,
         * so they are accessed defensively.
         */
        const legacyMediaQuery = mediaQuery as MediaQueryList & {
            addListener?: (
                listener: (event: MediaQueryListEvent) => void
            ) => void
            removeListener?: (
                listener: (event: MediaQueryListEvent) => void
            ) => void
        }

        legacyMediaQuery.addListener?.(handleChange)

        return () => {
            legacyMediaQuery.removeListener?.(handleChange)
        }
    }, [query, defaultValue])

    return matches
}