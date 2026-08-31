/**
 * useDisclosure
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Manages the open/closed boolean state behind any disclosure-style UI —
 *   modals, dialogs, drawers, popovers, accordions, dropdowns — with a
 *   small, consistent `open` / `close` / `toggle` API. Supports both
 *   uncontrolled (internal state) and controlled (state owned by the
 *   parent) usage with the same API surface.
 *
 * WHEN TO USE
 *   - Any component with a binary open/closed (or expanded/collapsed)
 *     state: modal, drawer, dropdown menu, accordion panel, alert dialog.
 *   - When you want the SAME hook to work whether the component manages
 *     its own state or the parent needs to control it (e.g. syncing a
 *     modal's open state with a URL query param or global store).
 *
 * WHEN NOT TO USE
 *   - For state with more than two meaningful values (e.g. a multi-step
 *     wizard, a tri-state checkbox) — this hook is intentionally
 *     boolean-only.
 *   - As a replacement for actual focus management/accessibility wiring
 *     inside the disclosed content — this hook only tracks the boolean,
 *     it doesn't trap focus or manage `aria-*` attributes for you.
 *
 * PARAMETERS (single options object — several independent, optional settings)
 *   options.defaultOpen    Initial state in UNCONTROLLED mode. Default `false`.
 *                          Ignored if `options.open` is provided.
 *   options.open           Provide this to switch the hook into CONTROLLED
 *                          mode: the returned `isOpen` always mirrors this
 *                          value, and `open()`/`close()`/`toggle()`/`setOpen()`
 *                          no longer manage internal state — they only
 *                          invoke `onOpenChange` so the parent can update
 *                          the value it owns. Omit entirely for uncontrolled
 *                          mode.
 *   options.onOpenChange   Called with the next boolean value whenever
 *                          `open()`, `close()`, `toggle()`, or `setOpen()`
 *                          is invoked — in BOTH controlled and uncontrolled
 *                          mode. This is what makes controlled mode
 *                          possible, and it's also useful in uncontrolled
 *                          mode for side effects (analytics, syncing to a
 *                          ref, etc).
 *
 * RETURN VALUE
 *   isOpen    Current boolean state.
 *   open      Sets state to `true`.
 *   close     Sets state to `false`.
 *   toggle    Flips the current state.
 *   setOpen   Sets state to an explicit boolean.
 *
 * BEHAVIOR
 *   - Controlled vs. uncontrolled is determined ONCE, by whether
 *     `options.open` is `undefined` on the FIRST render — exactly like
 *     React's own controlled/uncontrolled `<input>` semantics. Switching
 *     between the two after mount is a misuse of the hook (same as it is
 *     for a native input) and logs a one-time development warning to help
 *     catch the mistake; it does not throw.
 *
 * ERROR BEHAVIOR
 *   No runtime errors possible. The only "error-like" behavior is the
 *   dev-only console warning described above, which never fires in
 *   production builds.
 *
 * SSR / BROWSER CONSIDERATIONS
 *   Pure React state — no browser-only APIs involved. Fully SSR-safe with
 *   no guards needed, and no `"use client"` requirement beyond whatever
 *   the consuming component already needs.
 *
 * CLEANUP
 *   None required — no subscriptions, timers, or listeners are created.
 *
 * USAGE (uncontrolled — the common case)
 *   const { isOpen, open, close, toggle } = useDisclosure()
 *
 *   <button onClick={open}>Open modal</button>
 *   <Modal isOpen={isOpen} onClose={close}>...</Modal>
 *
 * USAGE (controlled — parent owns the state, e.g. via URL search params)
 *   const isOpen = searchParams.get('modal') === 'settings'
 *   const { open, close } = useDisclosure({
 *     open: isOpen,
 *     onOpenChange: (next) => setSearchParams({ modal: next ? 'settings' : '' }),
 *   })
 * ----------------------------------------------------------------------------
 */

import { useCallback, useRef, useState } from "react";

export interface UseDisclosureOptions {
    /** Initial state in uncontrolled mode. Default `false`. Ignored if `open` is set. */
    defaultOpen?: boolean;
    /** Provide to run the hook in controlled mode; the hook mirrors this value. */
    open?: boolean;
    /** Called with the next value on every open/close/toggle, in both modes. */
    onOpenChange?: (open: boolean) => void;
}

export interface UseDisclosureReturn {
    isOpen: boolean;
    open: () => void;
    close: () => void;
    toggle: () => void;
    setOpen: (open: boolean) => void;
}

export function useDisclosure(
    options: UseDisclosureOptions = {},
): UseDisclosureReturn {
    const { defaultOpen = false, open: controlledOpen, onOpenChange } = options;

    // Mode is locked in on the first render, mirroring how React treats
    // controlled vs. uncontrolled <input> — this ref is intentionally never
    // updated after initialization.
    const isControlled = useRef(controlledOpen !== undefined).current;
    const [internalOpen, setInternalOpen] = useState(defaultOpen);
    const warnedRef = useRef(false);

    if (process.env.NODE_ENV !== "production") {
        const isNowControlled = controlledOpen !== undefined;
        if (isControlled !== isNowControlled && !warnedRef.current) {
            warnedRef.current = true;
            console.warn(
                "useDisclosure: switching between controlled and uncontrolled `open` is not supported. " +
                "Decide once, on the first render, whether the parent will own `open`.",
            );
        }
    }

    const isOpen = isControlled ? (controlledOpen as boolean) : internalOpen;

    const setOpen = useCallback(
        (next: boolean) => {
            if (!isControlled) {
                setInternalOpen(next);
            }
            onOpenChange?.(next);
        },
        [isControlled, onOpenChange],
    );

    const open = useCallback(() => setOpen(true), [setOpen]);
    const close = useCallback(() => setOpen(false), [setOpen]);
    const toggle = useCallback(() => setOpen(!isOpen), [setOpen, isOpen]);

    return { isOpen, open, close, toggle, setOpen };
}
