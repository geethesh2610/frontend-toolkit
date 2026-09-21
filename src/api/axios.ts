/**
 * axios
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   A single, framework-agnostic Axios instance meant to be dropped into any
 *   project: React (Vite or webpack/CRA), Next.js, Vue (Vite or Vue CLI),
 *   plain TS/JS bundled by anything, or Node. It makes zero assumptions about
 *   which bundler is running it.
 *
 * WHY USE AN AXIOS INSTANCE
 *   Instead of importing axios directly throughout the application:
 *
 *     axios.get(...)
 *     axios.post(...)
 *
 *   use the configured instance:
 *
 *     api.get(...)
 *     api.post(...)
 *
 * ENVIRONMENT / BASE URL
 *   The base URL is resolved once, at module load, from whichever of these
 *   the current bundler happens to define (checked in order, first defined
 *   wins). None of these lookups throw if the underlying global doesn't
 *   exist in the current runtime:
 *
 *     - import.meta.env.VITE_API_BASE_URL       (Vite: React, Vue, etc.)
 *     - process.env.NEXT_PUBLIC_API_BASE_URL    (Next.js)
 *     - process.env.VUE_APP_API_BASE_URL        (Vue CLI / webpack)
 *     - process.env.API_BASE_URL                (Node / generic)
 *     - globalThis.__API_BASE_URL__             (no bundler at all, e.g. a
 *                                                 plain <script> build, or
 *                                                 config injected at runtime)
 *
 *   Environments with no build-time env vars at all (plain HTML pages,
 *   config fetched from a remote endpoint, tests) should call
 *   `configureApi({ baseURL })` after this module loads instead.
 *
 *   Do NOT put secrets in client-exposed environment variables.
 *
 *   Known limitation: if a *consuming* project's tsconfig sets
 *   `"module": "commonjs"`, TypeScript itself refuses to compile any
 *   `import.meta` reference (a compiler restriction, not something this file
 *   can work around). That's uncommon for frontend projects (Vite/Next/Vue
 *   all use esnext/bundler module resolution), but if you hit it, switch
 *   your tsconfig's `module` to `"esnext"`/`"es2022"`/`"bundler"`.
 *
 * CONTENT-TYPE
 *   No default Content-Type header is set. Axios already infers the right
 *   one per-request (`application/json` for plain objects, the correct
 *   `multipart/form-data; boundary=...` for FormData, etc.) — hardcoding it
 *   globally would silently break file uploads.
 *
 * AUTH / TOKEN REFRESH / LOGOUT / NAVIGATION
 *   Intentionally not implemented here — those policies differ per app
 *   (JWT header, httpOnly cookies, OAuth, SSO, refresh rotation). Wire them
 *   up via `client.interceptors.request/response.use(...)` in the consuming
 *   app, or extend `configureApi()` if you need it in every app.
 *
 * SSR
 *   This module never touches `window`/`document`, so it's safe to import
 *   on the server (Next.js SSR/RSC, Nuxt, etc).
 *
 * SIDE EFFECTS
 *   The Axios instance and its interceptors are created once when this
 *   module is evaluated.
 * ----------------------------------------------------------------------------
 */

import axios, {
    type AxiosError,
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios'

const DEFAULT_TIMEOUT = 30_000

/**
 * Reads a single env var from whichever bundler-injected global happens to
 * exist, without ever throwing in a runtime that doesn't define it.
 */
function readEnvVar(key: string): string | undefined {
    try {
        // Vite (and anything else that injects `import.meta.env`), guarded
        // with `as any` since `.env` isn't part of the standard ImportMeta
        // type outside Vite's own ambient types.
        const metaEnv = (import.meta as any)?.env
        if (metaEnv && metaEnv[key] !== undefined) {
            return metaEnv[key]
        }
    } catch {
        // `import.meta` not supported/populated in this runtime — ignore.
    }

    try {
        // Next.js / CRA / Vue CLI / Node. Read via `globalThis` (rather than
        // referencing the bare `process` identifier) so this compiles
        // regardless of whether the consuming project's tsconfig includes
        // Node's global types, and never throws in a browser bundle that
        // has no `process` global at all — property access on `globalThis`
        // simply yields `undefined` instead of a ReferenceError.
        const nodeProcess = (globalThis as Record<string, unknown>).process as
            | { env?: Record<string, string | undefined> }
            | undefined
        if (nodeProcess?.env?.[key] !== undefined) {
            return nodeProcess.env[key]
        }
    } catch {
        // ignore
    }

    return undefined
}

function resolveDefaultBaseUrl(): string | undefined {
    const fromGlobal =
        typeof globalThis !== 'undefined'
            ? (globalThis as Record<string, unknown>).__API_BASE_URL__
            : undefined

    return (
        readEnvVar('VITE_API_BASE_URL') ??
        readEnvVar('NEXT_PUBLIC_API_BASE_URL') ??
        readEnvVar('VUE_APP_API_BASE_URL') ??
        readEnvVar('API_BASE_URL') ??
        (typeof fromGlobal === 'string' ? fromGlobal : undefined)
    )
}

/**
 * Creates the application's Axios instance.
 */
function createApiClient(): AxiosInstance {
    const client = axios.create({
        baseURL: resolveDefaultBaseUrl(),
        timeout: DEFAULT_TIMEOUT,
        headers: {
            Accept: 'application/json',
        },

        // Sends cookies when the API requires cookie-based authentication.
        // Change to false if the application does not use cross-origin cookies.
        withCredentials: true,
    })

    // -------------------------------------------------------------------------
    // Request interceptor
    // -------------------------------------------------------------------------

    client.interceptors.request.use(
        (config: InternalAxiosRequestConfig) => {
            /*
             * Add project-specific request logic here when needed.
             *
             * Example:
             *
             * config.headers.Authorization = `Bearer ${token}`
             *
             * Do NOT automatically read tokens from localStorage here.
             * Authentication storage and security requirements differ between
             * applications.
             */

            return config
        },
        (error: AxiosError) => {
            return Promise.reject(error)
        }
    )

    // -------------------------------------------------------------------------
    // Response interceptor
    // -------------------------------------------------------------------------

    client.interceptors.response.use(
        (response: AxiosResponse) => {
            return response
        },
        (error: AxiosError) => {
            /*
             * Keep the original Axios error intact.
             *
             * Application-specific handling such as:
             *
             *   401 → refresh token / logout
             *   403 → permission handling
             *   429 → retry strategy
             *   5xx → global error reporting
             *
             * should be added by the application when required.
             */

            return Promise.reject(error)
        }
    )

    return client
}

/**
 * Shared Axios instance.
 */
export const api = createApiClient()

export interface ApiClientConfig {
    /** Overrides the resolved base URL, e.g. for plain HTML pages, remote-fetched config, or tests. */
    baseURL?: string
    timeout?: number
    withCredentials?: boolean
    headers?: Record<string, string>
}

/**
 * Runtime override for environments that can't rely on build-time env vars
 * (a plain HTML page loading this bundle directly, config fetched from a
 * remote endpoint at startup, unit tests, etc). Safe to call at any point —
 * it mutates the shared instance's defaults in place.
 */
export function configureApi(config: ApiClientConfig): void {
    if (config.baseURL !== undefined) api.defaults.baseURL = config.baseURL
    if (config.timeout !== undefined) api.defaults.timeout = config.timeout
    if (config.withCredentials !== undefined) api.defaults.withCredentials = config.withCredentials
    if (config.headers) Object.assign(api.defaults.headers.common, config.headers)
}
