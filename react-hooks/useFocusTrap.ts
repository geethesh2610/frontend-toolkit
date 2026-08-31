/**
 * useFocusTrap
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Traps keyboard focus inside a specified DOM element while the trap is
 *   active. This is primarily intended for modal dialogs, drawers,
 *   popovers, command palettes, and other UI that temporarily takes control
 *   of keyboard focus.
 *
 *   When active, Tab and Shift+Tab are intercepted so focus cycles through
 *   focusable elements inside the trap instead of escaping to the rest of
 *   the document.
 *
 * WHEN TO USE
 *   - Modal dialogs.
 *   - Alert dialogs.
 *   - Drawers that behave like dialogs.
 *   - Command palettes.
 *   - Full-screen menus.
 *   - Popovers that require strict keyboard containment.
 *   - Any temporary UI that must keep keyboard focus within itself.
 *
 * WHEN NOT TO USE
 *   - For simple dropdowns or menus that do not require focus containment.
 *   - As a replacement for proper ARIA semantics.
 *   - As a replacement for a complete accessible dialog implementation.
 *   - For permanently visible page sections.
 *
 * IMPORTANT ACCESSIBILITY NOTE
 *   A focus trap only manages keyboard focus. The consuming component is still
 *   responsible for appropriate accessibility semantics such as:
 *
 *   - `role="dialog"` / `role="alertdialog"` where appropriate.
 *   - `aria-modal="true"` where appropriate.
 *   - An accessible name via `aria-labelledby` or `aria-label`.
 *   - Correctly managing the dialog's open/closed state.
 *   - Preventing interaction with background content when required.
 *
 * PARAMETERS
 *   ref
 *     Ref pointing to the DOM element that should contain the focus trap.
 *
 *   options.enabled
 *     Whether the focus trap is active.
 *     Default: `true`.
 *
 *   options.initialFocus
 *     Optional ref pointing to the element that should receive focus when
 *     the trap becomes active.
 *
 *     If omitted, the first focusable element inside the container receives
 *     focus. If no focusable element exists, the container itself is focused
 *     when it can receive focus.
 *
 *   options.restoreFocus
 *     Whether focus should be returned to the element that was focused before
 *     the trap became active.
 *     Default: `true`.
 *
 *   options.preventScroll
 *     Whether programmatic focus should prevent the browser from scrolling.
 *     Default: `true`.
 *
 *   options.onActivate
 *     Optional callback invoked after the trap becomes active.
 *
 *   options.onDeactivate
 *     Optional callback invoked after the trap is deactivated and focus
 *     restoration has been attempted.
 *
 * RETURN VALUE
 *   None.
 *
 *   This hook exists for its focus-management side effects.
 *
 * BEHAVIOR
 *   - When activated, the currently focused element is remembered.
 *   - Focus is moved into the trap.
 *   - Tab cycles from the last focusable element to the first.
 *   - Shift+Tab cycles from the first focusable element to the last.
 *   - Dynamically added/removed focusable elements are evaluated when Tab
 *     is pressed rather than cached permanently.
 *   - When deactivated, focus is restored to the element that was active
 *     before the trap was activated, when possible.
 *   - If the previously focused element no longer exists or can no longer
 *     receive focus, restoration is skipped safely.
 *
 * FOCUSABLE ELEMENTS
 *   The hook considers the following elements focusable:
 *
 *   - <a href="...">
 *   - <button>
 *   - <input>
 *   - <select>
 *   - <textarea>
 *   - <summary>
 *   - <iframe>
 *   - <audio controls>
 *   - <video controls>
 *   - Elements with a non-negative tabindex.
 *
 *   Disabled controls and elements hidden from interaction are excluded.
 *
 * ERROR BEHAVIOR
 *   No error state is returned.
 *
 *   Focus management is a DOM side effect and there is no meaningful
 *   recoverable error for consumers to handle. Invalid or unavailable DOM
 *   references are handled defensively and simply result in no focus action.
 *
 * SSR / NEXT.JS
 *   Safe to import during SSR.
 *
 *   Browser APIs are accessed only inside effects/event handlers, so the hook
 *   does not access `document` or `window` during rendering.
 *
 *   In a Next.js App Router application, the component using this hook must
 *   be a Client Component because focus management requires browser APIs.
 *
 * CLEANUP
 *   - Removes the keydown listener when disabled or unmounted.
 *   - Restores focus when the active trap is deactivated.
 *   - Does not leave document-level listeners behind.
 *
 * STRICT MODE
 *   The implementation is designed to tolerate React Strict Mode's
 *   development-only effect setup/cleanup cycle.
 *
 * USAGE
 *
 *   const dialogRef = useRef<HTMLDivElement>(null)
 *
 *   useFocusTrap(dialogRef, {
 *     enabled: isOpen,
 *   })
 *
 *   <div
 *     ref={dialogRef}
 *     role="dialog"
 *     aria-modal="true"
 *   >
 *     <input />
 *     <button>Cancel</button>
 *     <button>Save</button>
 *   </div>
 *
 * ----------------------------------------------------------------------------
 */

import { useEffect, useRef, type RefObject } from 'react'

export interface UseFocusTrapOptions {
    /**
     * Whether the focus trap is active.
     * Default: `true`.
     */
    enabled?: boolean

    /**
     * Optional element that should receive focus when the trap activates.
     *
     * If omitted, the first focusable element inside the container is used.
     */
    initialFocus?: RefObject<HTMLElement | null>

    /**
     * Whether focus should be restored to the element that was focused before
     * the trap became active.
     *
     * Default: `true`.
     */
    restoreFocus?: boolean

    /**
     * Prevent the browser from automatically scrolling when focus is moved.
     *
     * Default: `true`.
     */
    preventScroll?: boolean

    /**
     * Called after the focus trap has been activated.
     */
    onActivate?: () => void

    /**
     * Called after the focus trap has been deactivated and focus restoration
     * has been attempted.
     */
    onDeactivate?: () => void
}

const FOCUSABLE_SELECTOR = [
    'a[href]',
    'area[href]',
    'button:not([disabled])',
    'input:not([disabled]):not([type="hidden"])',
    'select:not([disabled])',
    'textarea:not([disabled])',
    'summary',
    'iframe',
    'audio[controls]',
    'video[controls]',
    '[contenteditable="true"]',
    '[tabindex]:not([tabindex="-1"])',
].join(', ')

function getFocusableElements(container: HTMLElement): HTMLElement[] {
    return Array.from(
        container.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR)
    ).filter((element) => {
        if (element.hasAttribute('disabled')) {
            return false
        }

        if (element.getAttribute('aria-hidden') === 'true') {
            return false
        }

        if (element.hidden) {
            return false
        }

        if (element.closest('[inert]')) {
            return false
        }

        return element.getClientRects().length > 0
    })
}

function focusElement(
    element: HTMLElement,
    preventScroll: boolean
): void {
    try {
        element.focus({ preventScroll })
    } catch {
        // Some older/non-standard environments may not support the options
        // argument. Fall back to the standard focus() API.
        element.focus()
    }
}

export function useFocusTrap(
    ref: RefObject<HTMLElement | null>,
    options: UseFocusTrapOptions = {}
): void {
    const {
        enabled = true,
        initialFocus,
        restoreFocus = true,
        preventScroll = true,
        onActivate,
        onDeactivate,
    } = options

    const previousFocusedElementRef = useRef<HTMLElement | null>(null)

    const callbacksRef = useRef({
        initialFocus,
        onActivate,
        onDeactivate,
    })

    useEffect(() => {
        callbacksRef.current = {
            initialFocus,
            onActivate,
            onDeactivate,
        }
    }, [initialFocus, onActivate, onDeactivate])

    useEffect(() => {
        if (!enabled) {
            return
        }

        if (typeof document === 'undefined') {
            return
        }

        const container = ref.current

        if (!container) {
            return
        }

        const previousFocusedElement =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null

        previousFocusedElementRef.current = previousFocusedElement

        const focusInitialElement = () => {
            const configuredInitialElement =
                callbacksRef.current.initialFocus?.current

            if (
                configuredInitialElement &&
                container.contains(configuredInitialElement)
            ) {
                focusElement(configuredInitialElement, preventScroll)
                return
            }

            const focusableElements = getFocusableElements(container)

            if (focusableElements.length > 0) {
                focusElement(focusableElements[0], preventScroll)
                return
            }

            /*
             * If the container itself is not normally focusable, temporarily make
             * it programmatically focusable.
             *
             * This allows a dialog with no interactive children to still receive
             * focus without permanently changing its tabindex.
             */
            if (!container.hasAttribute('tabindex')) {
                container.setAttribute('tabindex', '-1')
            }

            focusElement(container, preventScroll)
        }

        const handleKeyDown = (event: KeyboardEvent) => {
            if (event.key !== 'Tab') {
                return
            }

            /*
             * The active element may have changed since activation, so determine
             * the current focusable elements on every Tab press. This correctly
             * handles dynamic content such as conditionally rendered buttons,
             * validation messages, or asynchronously loaded controls.
             */
            const focusableElements = getFocusableElements(container)

            if (focusableElements.length === 0) {
                event.preventDefault()
                focusElement(container, preventScroll)
                return
            }

            const activeElement = document.activeElement

            const firstElement = focusableElements[0]
            const lastElement = focusableElements[focusableElements.length - 1]

            /*
             * If focus somehow moves outside the container while the trap is active,
             * bring it back into the trap rather than allowing keyboard focus to
             * escape.
             */
            if (!container.contains(activeElement)) {
                event.preventDefault()

                if (event.shiftKey) {
                    focusElement(lastElement, preventScroll)
                } else {
                    focusElement(firstElement, preventScroll)
                }

                return
            }

            if (event.shiftKey) {
                if (activeElement === firstElement) {
                    event.preventDefault()
                    focusElement(lastElement, preventScroll)
                }

                return
            }

            if (activeElement === lastElement) {
                event.preventDefault()
                focusElement(firstElement, preventScroll)
            }
        }

        /*
         * Capture phase ensures the trap receives the keyboard event even when
         * another component attempts to stop propagation.
         */
        document.addEventListener('keydown', handleKeyDown, true)

        focusInitialElement()

        callbacksRef.current.onActivate?.()

        return () => {
            document.removeEventListener('keydown', handleKeyDown, true)

            if (restoreFocus) {
                const previousElement = previousFocusedElementRef.current

                if (
                    previousElement &&
                    previousElement.isConnected &&
                    !previousElement.hasAttribute('disabled')
                ) {
                    focusElement(previousElement, preventScroll)
                }
            }

            previousFocusedElementRef.current = null

            callbacksRef.current.onDeactivate?.()
        }
    }, [enabled, ref, restoreFocus, preventScroll])
}