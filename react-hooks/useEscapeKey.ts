/**
 * useEscapeKey
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Invokes a handler when the user presses the Escape key, anywhere in the
 *   document. The standard companion to `useClickOutside` for dismissible
 *   UI (modals, dropdowns, drawers, popovers).
 *
 * WHEN TO USE
 *   - Closing a modal/dialog, dropdown, drawer, or popover on Escape.
 *   - Cancelling an in-progress action (e.g. an inline edit) on Escape.
 *
 * WHEN NOT TO USE
 *   - For scoped keyboard shortcuts tied to a specific focused element
 *     rather than "anywhere in the document" — attach a `keydown` handler
 *     directly to that element instead.
 *   - For a general-purpose keybinding system (multiple keys, modifiers,
 *     sequences) — this hook is intentionally single-purpose. Build a
 *     dedicated `useKeyPress`/`useHotkeys` hook for that instead of
 *     stretching this one.
 *
 * PARAMETERS
 *   handler            Called with the triggering `KeyboardEvent` when
 *                       Escape is pressed. Always receives the latest
 *                       closure — no memoization required, no stale-closure
 *                       risk.
 *   options.enabled     Default `true`. Set to `false` to skip attaching the
 *                       listener (e.g. while the dismissible UI is closed).
 *
 * RETURN VALUE
 *   None. This hook is effect-only (side-effect subscription).
 *
 * BEHAVIOR
 *   - Listens on `document` in the CAPTURE phase, so it still fires even if
 *     an inner element calls `stopPropagation()` during the bubble phase —
 *     the same reasoning as `useClickOutside`.
 *   - Ignores auto-repeated keydown events (`event.repeat`) so holding the
 *     key down doesn't invoke `handler` many times in a row.
 *   - Ignores events fired while an IME composition is in progress
 *     (`event.isComposing`), since Escape there is typically meant to
 *     cancel the composition itself, not trigger app-level dismissal.
 *
 * ERROR BEHAVIOR
 *   None possible — plain event listener wiring, no fallible API.
 *
 * SSR / BROWSER CONSIDERATIONS
 *   Guarded with a `typeof document === 'undefined'` check; the effect body
 *   never runs during server rendering regardless. Requires `"use client"`
 *   in the component that uses this hook in Next.js App Router.
 *
 * CLEANUP
 *   The listener is removed on unmount and whenever `enabled` changes.
 *
 * USAGE
 *   const [isOpen, setIsOpen] = useState(false)
 *
 *   useEscapeKey(() => setIsOpen(false), { enabled: isOpen })
 * ----------------------------------------------------------------------------
 */

import { useEffect, useRef } from 'react'

export interface UseEscapeKeyOptions {
    /** Whether the listener is active. Default `true`. */
    enabled?: boolean
}

export function useEscapeKey(
    handler: (event: KeyboardEvent) => void,
    options: UseEscapeKeyOptions = {}
): void {
    const { enabled = true } = options

    const handlerRef = useRef(handler)

    useEffect(() => {
        handlerRef.current = handler
    })

    useEffect(() => {
        if (!enabled) return
        if (typeof document === 'undefined') return

        const listener = (event: KeyboardEvent) => {
            if (event.key !== 'Escape') return
            if (event.repeat) return
            if (event.isComposing) return

            handlerRef.current(event)
        }

        document.addEventListener('keydown', listener, true)

        return () => {
            document.removeEventListener('keydown', listener, true)
        }
    }, [enabled])
}