/**
 * dedupeRequest
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Wraps any async function so that concurrent calls with the SAME key
 *   share one in-flight promise instead of firing duplicate work. Pairs
 *   naturally with `apiFetch`/`api` from this folder, but works with any
 *   async function (an SDK call, a heavy computation) — not fetch-specific.
 *
 * WHEN TO USE
 *   - Multiple components mount at roughly the same time and each fetch
 *     the same resource independently (e.g. "current user") — without
 *     this, that's N identical network requests; with it, one request, N
 *     consumers of the same promise.
 *   - Rapid re-renders/effects that might re-trigger the same fetch before
 *     the previous one has resolved (e.g. a search box re-firing on every
 *     keystroke before debouncing kicks in).
 *
 * WHEN NOT TO USE
 *   - Requests that must always run independently even with identical
 *     arguments (e.g. a POST that creates a new resource each time) — only
 *     wrap read/idempotent operations, keyed correctly.
 *   - As a caching layer across TIME — this only dedupes calls that
 *     OVERLAP while one is in flight; once a call resolves, the very NEXT
 *     call (even with the same key) starts fresh. For time-based caching,
 *     wrap the result yourself, or reach for a real data-fetching library.
 *
 * PARAMETERS
 *   fn       The async function to wrap.
 *   getKey   Derives a string key from `fn`'s arguments — calls with the
 *            SAME key that overlap in time share one promise. Default:
 *            `JSON.stringify(args)`; override this for arguments that
 *            aren't meaningfully JSON-serializable (functions, class
 *            instances, circular structures) or where only SOME arguments
 *            should affect the key.
 *
 * RETURN VALUE
 *   A function with the same signature as `fn`. Every caller with an
 *   overlapping key gets the exact same `Promise` instance — resolving/
 *   rejecting it once resolves/rejects it for every caller waiting on it.
 *
 * BEHAVIOR
 *   The in-flight entry for a key is removed as soon as that call settles
 *   (resolves OR rejects) — the next call with the same key always starts a
 *   fresh call; it never returns a stale cached result or rejection.
 *
 * USAGE
 *   const fetchUser = dedupeRequest(
 *     (id: string) => apiFetch<User>(`/users/${id}`),
 *     (id) => id,
 *   )
 *
 *   // Fired from three components in the same render pass — only one
 *   // network request goes out; all three get the same result.
 *   const [a, b, c] = await Promise.all([fetchUser('1'), fetchUser('1'), fetchUser('1')])
 * ----------------------------------------------------------------------------
 */

export function dedupeRequest<TArgs extends unknown[], TResult>(
    fn: (...args: TArgs) => Promise<TResult>,
    getKey: (...args: TArgs) => string = (...args) => JSON.stringify(args),
): (...args: TArgs) => Promise<TResult> {
    const inFlight = new Map<string, Promise<TResult>>();

    return (...args: TArgs) => {
        const key = getKey(...args);

        const existing = inFlight.get(key);
        if (existing) return existing;

        const promise = fn(...args).finally(() => {
            inFlight.delete(key);
        });

        inFlight.set(key, promise);
        return promise;
    };
}
