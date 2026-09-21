/*
 * Internal plumbing for useElementSize.ts — not meant to be imported
 * directly by consumers of this toolkit.
 *
 * WHY THIS EXISTS
 *   A `ResizeObserver` is a relatively expensive browser object. Creating
 *   one PER `useElementSize()` call (one per observed element) doesn't
 *   scale well when many elements need observing at once — e.g. 200 cards
 *   in a grid measuring themselves is 200 separate observer instances, each
 *   with its own internal bookkeeping, instead of one observer watching 200
 *   targets. This module lets every `useElementSize` call share ONE
 *   `ResizeObserver` instance, fanning out each entry to whichever
 *   callback(s) are registered for that specific target element.
 *
 * KNOWN LIMITATION
 *   If the SAME element is observed with two DIFFERENT `box` options by two
 *   different callers (rare — most consumers use the default
 *   `'content-box'`), the browser's `observe(target, { box })` call only
 *   remembers the LAST box option set for that target; the earlier
 *   caller's box option is silently overridden. Not worth a bigger registry
 *   keyed by (target, box) for something this rare — if you hit it, give
 *   each caller its own observer instead of this shared one.
 */

type ResizeCallback = (entry: ResizeObserverEntry) => void;

let sharedObserver: ResizeObserver | null = null;
const callbacksByTarget = new Map<Element, Set<ResizeCallback>>();

function getSharedObserver(): ResizeObserver {
    if (!sharedObserver) {
        sharedObserver = new ResizeObserver((entries) => {
            for (const entry of entries) {
                callbacksByTarget.get(entry.target)?.forEach((callback) => callback(entry));
            }
        });
    }
    return sharedObserver;
}

/**
 * Subscribes `callback` to size changes on `target`, observed with `box`.
 * Returns an unsubscribe function — call it on cleanup (unmount, target
 * change, box change).
 */
export function observeElementSize(target: Element, box: ResizeObserverBoxOptions, callback: ResizeCallback): () => void {
    const observer = getSharedObserver();

    if (!callbacksByTarget.has(target)) {
        callbacksByTarget.set(target, new Set());
    }
    callbacksByTarget.get(target)!.add(callback);
    observer.observe(target, { box });

    return () => {
        const callbacks = callbacksByTarget.get(target);
        if (!callbacks) return;

        callbacks.delete(callback);

        if (callbacks.size === 0) {
            callbacksByTarget.delete(target);
            observer.unobserve(target);
        }
    };
}
