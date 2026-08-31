/**
 * useClickOutside
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Detects pointer interactions that occur outside one or more DOM elements
 *   and invokes a handler when that happens. The classic use case is closing
 *   a popover, dropdown, modal, or context menu when the user clicks/taps
 *   anywhere else on the page.
 *
 * WHEN TO USE
 *   - Dismissible dropdowns, menus, popovers, tooltips with interactive content.
 *   - Modals/dialogs that should close on outside click (in addition to Esc).
 *   - Any "open" UI element that needs to close itself on outside interaction.
 *
 * WHEN NOT TO USE
 *   - For elements that should close on Escape only — that's a separate
 *     keydown listener, not this hook.
 *   - For native <dialog> elements — prefer the browser's own "light dismiss"
 *     behavior where available.
 *   - As a substitute for focus trapping/management in modals — this hook
 *     only handles pointer-based dismissal, not accessibility of the dialog
 *     itself.
 *
 * PARAMETERS
 *   refs      A single RefObject or an array of RefObjects. A pointerdown
 *             is considered "inside" if it lands on ANY of the referenced
 *             elements or their descendants (useful for e.g. a trigger
 *             button + the popover it controls).
 *   handler   Called with the triggering PointerEvent when a pointerdown
 *             occurs outside all provided refs. Always receives the latest
 *             closure — no need to memoize it, no stale-closure risk.
 *   options.enabled     Default `true`. Set to `false` to skip attaching
 *                        the listener entirely (e.g. while a menu is closed).
 *   options.eventType   Default `'pointerdown'`. Fires before `click`, which
 *                        avoids the common bug where opening and closing UI
 *                        share a single click event. `pointerdown` unifies
 *                        mouse, touch, and pen in one listener and is
 *                        supported in all current browser baselines.
 *
 * RETURN VALUE
 *   None. This hook is effect-only (side-effect subscription), matching
 *   patterns like `useEventListener`.
 *
 * BEHAVIOR
 *   - The listener is attached on `document` in the CAPTURE phase, so it
 *     still runs even if an inner element calls `stopPropagation()` on the
 *     bubble phase (a common source of "outside click doesn't fire" bugs).
 *   - Elements that have been removed from the DOM by the time the listener
 *     runs (event.target.isConnected === false) are ignored, since
 *     "inside vs outside" is meaningless for a detached node.
 *
 * ERROR BEHAVIOR
 *   None expected. There is no fallible browser API involved (just DOM
 *   event listeners), so no error state is exposed.
 *
 * SSR / BROWSER CONSIDERATIONS
 *   Safe to call during SSR — the effect body only runs on the client
 *   (effects never run during server rendering), and there's an additional
 *   `typeof document === 'undefined'` guard for non-DOM environments
 *   (e.g. hook reused in a React Native or test context that doesn't
 *   polyfill `document`). Requires a Client Component boundary ("use client")
 *   in Next.js App Router — put that directive in the file that USES this
 *   hook (or at the top of this file if you keep it in the same module tree
 *   as client components), not as a blanket rule for every consumer.
 *
 * CLEANUP
 *   The event listener is removed on unmount, and whenever `enabled` or
 *   `eventType` changes (old listener torn down before the new one attaches).
 *
 * USAGE
 *   const menuRef = useRef<HTMLDivElement>(null)
 *   const triggerRef = useRef<HTMLButtonElement>(null)
 *   const [open, setOpen] = useState(false)
 *
 *   useClickOutside([menuRef, triggerRef], () => setOpen(false), {
 *     enabled: open,
 *   })
 * ----------------------------------------------------------------------------
 */

import { useEffect, useRef, type RefObject } from "react";

export interface UseClickOutsideOptions {
    /** Whether the listener is active. Default: `true`. */
    enabled?: boolean;
    /** Which pointer event to listen for. Default: `'pointerdown'`. */
    eventType?: "pointerdown" | "mousedown" | "touchstart";
}

export function useClickOutside<T extends HTMLElement = HTMLElement>(
    refs: RefObject<T | null> | Array<RefObject<T | null>>,
    handler: (event: Event) => void,
    options: UseClickOutsideOptions = {},
): void {
    const { enabled = true, eventType = "pointerdown" } = options;

    // Keep the latest handler and refs in mutable refs so the effect below
    // never needs to depend on `handler` or `refs` directly. This avoids
    // tearing down and reattaching the DOM listener on every render just
    // because the caller passed an inline arrow function or a fresh array
    // literal (both extremely common call patterns for this hook).
    const handlerRef = useRef(handler);
    const refsRef = useRef(refs);

    useEffect(() => {
        handlerRef.current = handler;
    });

    useEffect(() => {
        refsRef.current = refs;
    });

    useEffect(() => {
        if (!enabled) return;
        if (typeof document === "undefined") return;

        const listener = (event: Event) => {
            const target = event.target as Node | null;

            // Ignore synthetic/detached targets (e.g. an element that removed
            // itself from the DOM in its own mousedown handler before this
            // capture-phase listener runs).
            if (!target || !target.isConnected) return;

            const current = refsRef.current;
            const refsArray = Array.isArray(current) ? current : [current];

            const clickedInside = refsArray.some((ref) => {
                const el = ref.current;
                return el != null && el.contains(target);
            });

            if (clickedInside) return;

            handlerRef.current(event);
        };

        // Capture phase: fires even if an inner element stops propagation
        // during the bubble phase.
        document.addEventListener(eventType, listener, true);

        return () => {
            document.removeEventListener(eventType, listener, true);
        };
    }, [enabled, eventType]);
}
