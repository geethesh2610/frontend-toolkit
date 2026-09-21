/*
 * Internal plumbing for useIntersectionObserver.ts — not meant to be
 * imported directly by consumers of this toolkit.
 *
 * WHY THIS EXISTS
 *   Same motivation as sharedResizeObserver.ts: creating one
 *   `IntersectionObserver` PER observed element doesn't scale — e.g. an
 *   infinite feed lazy-loading 200 images would otherwise spin up 200
 *   observer instances. This module lets every `useIntersectionObserver`
 *   call that uses the SAME (root, rootMargin, threshold) share one
 *   `IntersectionObserver` instance. A genuinely distinct options
 *   combination still gets its own instance, since root/rootMargin/
 *   threshold actually change what the browser watches — sharing across
 *   different options would be incorrect, not just an optimization.
 *
 * NOTE
 *   Registries (one per distinct root, then one per distinct
 *   rootMargin+threshold within that root) are never torn down once
 *   created, even after their last subscriber unsubscribes — only the
 *   underlying `IntersectionObserver.unobserve()` per-target call happens.
 *   This is deliberate: the number of distinct options combinations an app
 *   actually uses is small and fixed (typically 1–5), so the small amount
 *   of retained bookkeeping is not worth the complexity of tearing down and
 *   recreating registries as consumers come and go.
 */

type IntersectionCallback = (entry: IntersectionObserverEntry) => void;

interface Registry {
    observer: IntersectionObserver;
    callbacksByTarget: Map<Element, Set<IntersectionCallback>>;
}

export interface IntersectionObserverOptionsKey {
    root: Element | Document | null;
    rootMargin: string;
    threshold: number | number[];
}

const registriesByRoot = new Map<Element | Document | null, Map<string, Registry>>();

function getRegistry({ root, rootMargin, threshold }: IntersectionObserverOptionsKey): Registry {
    let byOptions = registriesByRoot.get(root);
    if (!byOptions) {
        byOptions = new Map();
        registriesByRoot.set(root, byOptions);
    }

    const optionsKey = `${rootMargin}|${Array.isArray(threshold) ? threshold.join(",") : threshold}`;

    let registry = byOptions.get(optionsKey);
    if (!registry) {
        const callbacksByTarget = new Map<Element, Set<IntersectionCallback>>();
        const observer = new IntersectionObserver(
            (entries) => {
                for (const entry of entries) {
                    callbacksByTarget.get(entry.target)?.forEach((callback) => callback(entry));
                }
            },
            { root, rootMargin, threshold },
        );
        registry = { observer, callbacksByTarget };
        byOptions.set(optionsKey, registry);
    }

    return registry;
}

/**
 * Subscribes `callback` to intersection changes on `target`, observed with
 * `options`. Returns an unsubscribe function — call it on cleanup (unmount,
 * target change, options change).
 */
export function observeIntersection(target: Element, options: IntersectionObserverOptionsKey, callback: IntersectionCallback): () => void {
    const registry = getRegistry(options);

    if (!registry.callbacksByTarget.has(target)) {
        registry.callbacksByTarget.set(target, new Set());
    }
    registry.callbacksByTarget.get(target)!.add(callback);
    registry.observer.observe(target);

    return () => {
        const callbacks = registry.callbacksByTarget.get(target);
        if (!callbacks) return;

        callbacks.delete(callback);

        if (callbacks.size === 0) {
            registry.callbacksByTarget.delete(target);
            registry.observer.unobserve(target);
        }
    };
}
