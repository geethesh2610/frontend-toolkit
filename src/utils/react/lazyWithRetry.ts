/**
 * lazyWithRetry
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   A drop-in replacement for `React.lazy` that recovers from the most
 *   common production failure of code-splitting: a user has your app open
 *   in a tab, you deploy a new build (new chunk filenames/hashes), and
 *   their next navigation tries to `import()` a chunk file that no longer
 *   exists on the server — a dynamic-import network failure that
 *   `React.lazy` alone just throws, for your error boundary to catch.
 *
 * WHEN TO USE
 *   - Any `React.lazy(() => import('./SomeRoute'))` in an app that deploys
 *     more than once — i.e. basically every real app using code-splitting.
 *
 * WHEN NOT TO USE
 *   - If the import can fail for reasons OTHER than a stale deployment
 *     (e.g. the module itself throws during evaluation) — this will still
 *     reload the page once for those failures too, which just re-triggers
 *     the same error after a wasted reload. If you need to distinguish
 *     "stale chunk" from "broken module", inspect `error.message` for your
 *     bundler's chunk-load error signature before deciding whether to
 *     reload.
 *
 * PARAMETERS
 *   factory   The same dynamic `import()` factory you'd pass to
 *             `React.lazy` directly.
 *
 * RETURN VALUE
 *   A `LazyExoticComponent`, usable exactly like `React.lazy`'s return
 *   value — render it inside a `<Suspense>` boundary.
 *
 * BEHAVIOR
 *   - On a successful import, clears the retry flag and returns normally.
 *   - On a failed import, checks a `sessionStorage` flag keyed to this
 *     specific `factory`: if this is the FIRST failure seen for it in this
 *     tab, it sets the flag and does a full `window.location.reload()` —
 *     which re-fetches the HTML/asset manifest and picks up new chunk
 *     hashes.
 *   - If the reload already happened once and the import fails AGAIN
 *     (meaning the reload didn't fix it — a genuinely broken module, not a
 *     stale chunk), it gives up, clears the flag, and re-throws so the
 *     error boundary handles it normally instead of reload-looping forever.
 *
 * SSR / BROWSER CONSIDERATIONS
 *   Uses `sessionStorage`/`window.location.reload()`, both browser-only.
 *   `React.lazy` itself only ever resolves on the client, so no separate
 *   SSR guard is needed here.
 *
 * USAGE
 *   const Settings = lazyWithRetry(() => import('./pages/Settings'))
 *
 *   <Suspense fallback={<Spinner />}>
 *     <Settings />
 *   </Suspense>
 * ----------------------------------------------------------------------------
 */

import { lazy, type ComponentType, type LazyExoticComponent } from 'react'

const RETRY_FLAG_PREFIX = 'lazy-with-retry:'

// `any` here matches React's own `lazy<T extends ComponentType<any>>` signature —
// required so `T` can be inferred from a component with any concrete props
// type; a narrower constraint like `ComponentType<unknown>` would reject
// real components, since prop types are contravariant.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function lazyWithRetry<T extends ComponentType<any>>(
    factory: () => Promise<{ default: T }>
): LazyExoticComponent<T> {
    return lazy(async () => {
        const flagKey = `${RETRY_FLAG_PREFIX}${factory.toString()}`

        try {
            const module = await factory()
            window.sessionStorage.removeItem(flagKey)
            return module
        } catch (error) {
            const hasAlreadyRetried = window.sessionStorage.getItem(flagKey) === 'true'

            if (hasAlreadyRetried) {
                window.sessionStorage.removeItem(flagKey)
                throw error
            }

            window.sessionStorage.setItem(flagKey, 'true')
            window.location.reload()

            // The reload is already in flight — this promise never needs to
            // resolve; the current page will unmount before it matters.
            return new Promise<{ default: T }>(() => {})
        }
    })
}
