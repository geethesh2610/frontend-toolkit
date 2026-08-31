/**
 * useElementSize
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Tracks the rendered width/height of a DOM element and re-renders
 *   whenever it changes, using `ResizeObserver`. Useful for anything that
 *   needs to react to an element's own size — not the viewport's.
 *
 * WHEN TO USE
 *   - Responsive components that adapt based on their OWN box size rather
 *     than the viewport (container queries before/without CSS support,
 *     canvas/chart sizing, virtualized list row measurement).
 *   - Positioning logic that depends on a measured element's dimensions
 *     (custom tooltips, popovers with dynamic content).
 *
 * WHEN NOT TO USE
 *   - If you only need viewport size, not a specific element's size — use
 *     a `useWindowSize`-style hook instead; don't attach a ResizeObserver
 *     to `document.documentElement` for that.
 *   - If CSS container queries alone can solve the problem — prefer CSS,
 *     reach for this hook only when the size needs to drive JS logic
 *     (canvas dimensions, computed positioning, etc), not just styling.
 *
 * PARAMETERS
 *   options.box   Which CSS box to observe: `'content-box'` (default),
 *                 `'border-box'`, or `'device-pixel-content-box'`. Matches
 *                 the native `ResizeObserverOptions.box` value passed to
 *                 `observe()`. Most consumers want the default.
 *
 * RETURN VALUE
 *   ref      A CALLBACK ref (not a RefObject) — attach it to the element
 *            you want measured: `<div ref={ref}>`. A callback ref is used
 *            deliberately: if the underlying DOM node changes (conditional
 *            rendering swapping elements, key changes), a plain RefObject
 *            would silently keep observing the OLD node. The callback ref
 *            triggers a state update whenever the node itself changes, so
 *            the observer is always attached to the current element.
 *   width    Current content width in CSS pixels. `0` before the first
 *            measurement (i.e. before `ref` is attached to a mounted node).
 *   height   Current content height in CSS pixels. Same initial-value
 *            caveat as `width`.
 *
 * BEHAVIOR
 *   - `width`/`height` start at `0` and update asynchronously once
 *     `ResizeObserver` delivers its first entry (which happens on the
 *     next animation frame after `observe()` is called, even if the size
 *     hasn't "changed" from anything — this is normal ResizeObserver
 *     behavior, not a bug).
 *   - If the observed node is swapped out for a different element, the
 *     old observer is disconnected and a new one is attached to the new
 *     node automatically.
 *
 * ERROR BEHAVIOR
 *   No fallible operations. If `ResizeObserver` isn't available in the
 *   environment, the hook measures once synchronously via
 *   `getBoundingClientRect()` and then stays static rather than throwing
 *   or silently reporting `0x0` forever.
 *
 * SSR / BROWSER CONSIDERATIONS
 *   `ResizeObserver` is a browser-only API. The hook only touches it
 *   inside an effect (client-only by React's own execution model) and
 *   additionally feature-detects it before use. Requires `"use client"`
 *   in the component that uses this hook in Next.js App Router.
 *
 * CLEANUP
 *   The `ResizeObserver` is disconnected whenever the observed node
 *   changes and on unmount.
 *
 * USAGE
 *   function Chart() {
 *     const { ref, width, height } = useElementSize<HTMLDivElement>()
 *
 *     return (
 *       <div ref={ref} style={{ width: '100%', height: '100%' }}>
 *         {width > 0 && height > 0 && <MyChart width={width} height={height} />}
 *       </div>
 *     )
 *   }
 * ----------------------------------------------------------------------------
 */

import { useCallback, useEffect, useState } from 'react'

export interface UseElementSizeOptions {
    /** Which CSS box to measure. Default `'content-box'`. */
    box?: ResizeObserverBoxOptions
}

export interface ElementSize {
    width: number
    height: number
}

export interface UseElementSizeReturn<T extends HTMLElement> extends ElementSize {
    ref: (node: T | null) => void
}

function readEntrySize(entry: ResizeObserverEntry, box: ResizeObserverBoxOptions): ElementSize {
    if (box === 'content-box') {
        return { width: entry.contentRect.width, height: entry.contentRect.height }
    }

    const boxSizeEntries =
        box === 'border-box' ? entry.borderBoxSize : entry.devicePixelContentBoxSize

    // Spec says this is an array; some implementations historically returned
    // a single object. Handle both defensively.
    const boxSize = Array.isArray(boxSizeEntries) ? boxSizeEntries[0] : boxSizeEntries

    if (boxSize) {
        return { width: boxSize.inlineSize, height: boxSize.blockSize }
    }

    // Browser doesn't support the requested box option — fall back to
    // content-box rather than reporting nothing.
    return { width: entry.contentRect.width, height: entry.contentRect.height }
}

export function useElementSize<T extends HTMLElement = HTMLElement>(
    options: UseElementSizeOptions = {}
): UseElementSizeReturn<T> {
    const { box = 'content-box' } = options

    const [node, setNode] = useState<T | null>(null)
    const [size, setSize] = useState<ElementSize>({ width: 0, height: 0 })

    // Callback ref: reacts to the underlying DOM node changing, unlike a
    // plain RefObject which would leave a stale observer on the old node.
    const ref = useCallback((el: T | null) => {
        setNode(el)
    }, [])

    useEffect(() => {
        if (!node) return

        if (typeof ResizeObserver === 'undefined') {
            // No reactive sizing available; take one static measurement so the
            // consumer still gets a real value instead of a permanent 0x0.
            const rect = node.getBoundingClientRect()
            setSize({ width: rect.width, height: rect.height })
            return
        }

        const observer = new ResizeObserver((entries) => {
            const entry = entries[0]
            if (!entry) return
            setSize(readEntrySize(entry, box))
        })

        observer.observe(node, { box })

        return () => {
            observer.disconnect()
        }
    }, [node, box])

    return { ref, width: size.width, height: size.height }
}