/**
 * useEventListener
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   A type-safe, leak-free wrapper around `addEventListener`/
 *   `removeEventListener` for `window`, `document`, or any DOM element —
 *   including one accessed via a ref. This is the low-level building block
 *   most other DOM-event hooks (scroll position, online/offline, media
 *   query changes, etc.) should be built on top of.
 *
 * WHEN TO USE
 *   - Any time you'd otherwise write a raw `useEffect` that calls
 *     `addEventListener` and returns a `removeEventListener` cleanup.
 *   - Listening on `window`/`document` (resize, scroll, online/offline,
 *     visibilitychange) or on a specific element via a ref.
 *
 * WHEN NOT TO USE
 *   - If the DOM node itself needs to be reactive to *conditional
 *     mounting/unmounting* (e.g. an element that appears and disappears),
 *     prefer passing the resolved element directly (e.g. from a callback
 *     ref/state pair like `useElementSize` uses) rather than a `RefObject`
 *     — see the caveat under "Common mistakes" below.
 *   - For React synthetic events on your OWN JSX elements — just use the
 *     normal `onClick`/`onChange`/etc. props; this hook is for listening
 *     on nodes you don't directly render (window, document, refs into
 *     children, portals).
 *
 * PARAMETERS
 *   eventName   The DOM event name, e.g. `'resize'`, `'keydown'`, `'click'`.
 *               Fully typed against the target: passing a `Document`/
 *               `RefObject<Document>` narrows `eventName` to
 *               `DocumentEventMap` keys, an `HTMLElement`/its ref narrows
 *               to `HTMLElementEventMap` keys, and omitting `target`
 *               narrows to `WindowEventMap` keys — with autocomplete and
 *               a correctly-typed `event` parameter in `handler` for each.
 *   handler     `(event) => void`, always receives the latest closure — no
 *               memoization required, no stale-closure risk.
 *   target      Optional. One of:
 *                 - omitted / `undefined` → listens on `window` (default).
 *                 - `null` → explicitly attach nothing (see "disabling"
 *                   below).
 *                 - a direct `EventTarget` (`window`, `document`, an
 *                   `HTMLElement`, a `MediaQueryList`, etc).
 *                 - a `RefObject` pointing at one of the above.
 *   options     Optional `boolean | AddEventListenerOptions`, passed
 *               through to the native `addEventListener` call.
 *
 * RETURN VALUE
 *   None. This hook is effect-only (side-effect subscription).
 *
 * BEHAVIOR
 *   - "Disabling" the listener: since hooks can't be called conditionally,
 *     pass `target={null}` (or a ref whose `.current` is currently `null`)
 *     to skip attaching anything for that render.
 *   - When `target` is a ref, the effect depends on the ref OBJECT (which
 *     is stable across renders per React's contract), not on `.current`.
 *     If `.current` changes to point at a different node WITHOUT a
 *     re-render, this hook will not automatically move the listener — see
 *     "Common mistakes" for how to handle that case correctly.
 *
 * ERROR BEHAVIOR
 *   None possible — plain event listener wiring, no fallible API.
 *
 * SSR / BROWSER CONSIDERATIONS
 *   All target resolution and `addEventListener` calls happen inside a
 *   `useEffect`, which never executes during server rendering, so no
 *   extra guards are required for `window`/`document` access. Requires
 *   `"use client"` in the component that uses this hook in Next.js App
 *   Router.
 *
 * CLEANUP
 *   The listener is removed whenever `eventName`, the resolved target, or
 *   any of the individual `options` fields change, and on unmount.
 *
 * USAGE (window, default target)
 *   useEventListener('resize', () => {
 *     console.log(window.innerWidth)
 *   })
 *
 * USAGE (element via ref)
 *   const buttonRef = useRef<HTMLButtonElement>(null)
 *   useEventListener('click', (event) => {
 *     console.log('button clicked', event.currentTarget)
 *   }, buttonRef)
 *
 * USAGE (document)
 *   useEventListener('visibilitychange', () => {
 *     console.log(document.visibilityState)
 *   }, document)
 * ----------------------------------------------------------------------------
 */

import { useEffect, useRef, type RefObject } from 'react'

function isRefObject(value: unknown): value is RefObject<EventTarget | null> {
    return typeof value === 'object' && value !== null && 'current' in value
}

// --- Overloads: window (default target) -------------------------------
export function useEventListener<K extends keyof WindowEventMap>(
    eventName: K,
    handler: (event: WindowEventMap[K]) => void,
    target?: undefined,
    options?: boolean | AddEventListenerOptions
): void

// --- Overloads: document ------------------------------------------------
export function useEventListener<K extends keyof DocumentEventMap>(
    eventName: K,
    handler: (event: DocumentEventMap[K]) => void,
    target: Document | RefObject<Document | null>,
    options?: boolean | AddEventListenerOptions
): void

// --- Overloads: an element, directly or via ref -------------------------
export function useEventListener<
    K extends keyof HTMLElementEventMap,
    T extends HTMLElement = HTMLElement
>(
    eventName: K,
    handler: (event: HTMLElementEventMap[K]) => void,
    target: T | RefObject<T | null> | null,
    options?: boolean | AddEventListenerOptions
): void

// --- Implementation (also covers arbitrary EventTarget / event names) --
export function useEventListener(
    eventName: string,
    handler: (event: Event) => void,
    target?: EventTarget | RefObject<EventTarget | null> | null,
    options?: boolean | AddEventListenerOptions
): void {
    const handlerRef = useRef(handler)

    useEffect(() => {
        handlerRef.current = handler
    })

    // Depend on the individual primitive fields of `options` rather than the
    // options object/boolean itself, so passing a fresh `{ passive: true }`
    // literal on every render doesn't tear down and reattach the listener
    // every render.
    const isBooleanOptions = typeof options === 'boolean'
    const capture = isBooleanOptions ? options : options?.capture
    const passive = isBooleanOptions ? undefined : options?.passive
    const once = isBooleanOptions ? undefined : options?.once
    const signal = isBooleanOptions ? undefined : options?.signal

    useEffect(() => {
        const resolvedTarget: EventTarget | null =
            target === undefined ? window : target === null ? null : isRefObject(target) ? target.current : target

        if (!resolvedTarget) return

        const listener = (event: Event) => handlerRef.current(event)
        const listenerOptions: boolean | AddEventListenerOptions = isBooleanOptions
            ? (options as boolean)
            : { capture, passive, once, signal }

        resolvedTarget.addEventListener(eventName, listener, listenerOptions)

        return () => {
            resolvedTarget.removeEventListener(eventName, listener, listenerOptions)
        }
        // `target` is included for the direct-EventTarget case (its identity
        // changing is a meaningful, intentional signal to re-subscribe). When
        // `target` is a RefObject, its identity is stable across renders, so
        // this correctly does NOT re-run just because `.current` was mutated —
        // see the "Common mistakes" section in the file header for why that's
        // the deliberate, documented behavior rather than a bug.
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [eventName, target, capture, passive, once, signal])
}