/**
 * fetch
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Provides a production-ready, reusable wrapper around the native Fetch API.
 *
 *   The wrapper centralizes:
 *
 *     - base URL handling
 *     - default headers
 *     - timeout handling
 *     - AbortController support
 *     - JSON parsing
 *     - HTTP error handling
 *     - consistent response typing
 *
 * WHY
 *   Native `fetch()` does NOT reject its promise when the server returns
 *   HTTP errors such as 400, 401, 404, or 500.
 *
 *   This wrapper converts non-2xx responses into rejected errors so callers
 *   can use normal try/catch error handling.
 *
 * USAGE
 *
 *   import { apiFetch } from './api/fetch'
 *
 *   const users = await apiFetch<User[]>('/users')
 *
 *   const user = await apiFetch<User>('/users/123', {
 *     method: 'GET',
 *   })
 *
 *   const created = await apiFetch<User>('/users', {
 *     method: 'POST',
 *     body: {
 *       name: 'John',
 *     },
 *   })
 *
 * PARAMETERS
 *   path
 *     API endpoint path or absolute URL.
 *
 *   options
 *     Standard Fetch RequestInit options plus:
 *
 *       timeout
 *         Request timeout in milliseconds.
 *
 *       body
 *         Accepts normal fetch BodyInit values OR a JavaScript object.
 *         Objects are automatically JSON.stringify-ed and the appropriate
 *         Content-Type header is added.
 *
 * ERROR BEHAVIOR
 *   The function rejects when:
 *
 *     - the request times out
 *     - the request is aborted
 *     - the network request fails
 *     - the server returns a non-2xx response
 *     - JSON parsing fails when JSON is expected
 *
 * SSR
 *   Uses the environment's native `fetch` implementation.
 *   Modern Next.js/Node.js environments provide Fetch on the server.
 *
 * AUTHENTICATION
 *   This wrapper intentionally does not assume JWT, OAuth, localStorage,
 *   refresh tokens, or any particular authentication strategy.
 *
 *   Authentication can be added through headers, cookies, or a project-level
 *   wrapper around this function.
 * ----------------------------------------------------------------------------
 */

const API_BASE_URL =
    typeof process !== 'undefined'
        ? process.env.NEXT_PUBLIC_API_BASE_URL ?? ''
        : ''

const DEFAULT_TIMEOUT = 30_000

export interface ApiFetchOptions
    extends Omit<RequestInit, 'body' | 'signal'> {
    /**
     * Request timeout in milliseconds.
     * Defaults to 30 seconds.
     */
    timeout?: number

    /**
     * Request body.
     *
     * JavaScript objects are automatically JSON encoded.
     */
    body?: BodyInit | Record<string, unknown> | null

    /**
     * Optional external AbortSignal.
     *
     * If supplied, aborting this signal will cancel the request.
     */
    signal?: AbortSignal
}

/**
 * Error thrown when an HTTP request returns a non-success status.
 */
export class ApiFetchError extends Error {
    readonly status: number
    readonly statusText: string
    readonly data: unknown

    constructor(
        message: string,
        status: number,
        statusText: string,
        data: unknown
    ) {
        super(message)

        this.name = 'ApiFetchError'
        this.status = status
        this.statusText = statusText
        this.data = data
    }
}

/**
 * Determines whether a value is a plain JavaScript object suitable for
 * automatic JSON serialization.
 */
function isJsonObject(
    value: unknown
): value is Record<string, unknown> {
    return (
        typeof value === 'object' &&
        value !== null &&
        !Array.isArray(value) &&
        !(value instanceof FormData) &&
        !(value instanceof Blob) &&
        !(value instanceof ArrayBuffer)
    )
}

/**
 * Attempts to parse a response body.
 *
 * JSON responses are parsed as JSON. Empty responses return `undefined`.
 * Non-JSON responses are returned as text.
 */
async function parseResponseBody(
    response: Response
): Promise<unknown> {
    const contentType = response.headers.get('content-type') ?? ''

    if (response.status === 204) {
        return undefined
    }

    if (contentType.includes('application/json')) {
        return response.json()
    }

    const text = await response.text()

    return text || undefined
}

/**
 * Performs an HTTP request using the native Fetch API.
 *
 * @param path - API path or absolute URL.
 * @param options - Fetch options plus timeout support.
 * @returns Parsed response data.
 * @throws ApiFetchError for non-2xx responses.
 * @throws DOMException with name `AbortError` when aborted/timed out.
 */
export async function apiFetch<T>(
    path: string,
    options: ApiFetchOptions = {}
): Promise<T> {
    const {
        timeout = DEFAULT_TIMEOUT,
        body,
        signal: externalSignal,
        headers: providedHeaders,
        ...fetchOptions
    } = options

    const controller = new AbortController()

    let timeoutId: ReturnType<typeof setTimeout> | undefined

    const handleExternalAbort = () => {
        controller.abort(externalSignal?.reason)
    }

    try {
        if (externalSignal) {
            if (externalSignal.aborted) {
                controller.abort(externalSignal.reason)
            } else {
                externalSignal.addEventListener(
                    'abort',
                    handleExternalAbort,
                    { once: true }
                )
            }
        }

        timeoutId = setTimeout(() => {
            controller.abort(
                new DOMException(
                    'The request timed out.',
                    'TimeoutError'
                )
            )
        }, timeout)

        const headers = new Headers(providedHeaders)

        let requestBody: BodyInit | undefined

        if (body !== null && body !== undefined) {
            if (isJsonObject(body)) {
                requestBody = JSON.stringify(body)

                if (!headers.has('Content-Type')) {
                    headers.set(
                        'Content-Type',
                        'application/json'
                    )
                }
            } else {
                requestBody = body as BodyInit
            }
        }

        if (!headers.has('Accept')) {
            headers.set('Accept', 'application/json')
        }

        const url = /^https?:\/\//i.test(path)
            ? path
            : `${API_BASE_URL}${path}`

        const response = await fetch(url, {
            ...fetchOptions,
            headers,
            body: requestBody,
            signal: controller.signal,
        })

        const data = await parseResponseBody(response)

        if (!response.ok) {
            const message =
                typeof data === 'object' &&
                    data !== null &&
                    'message' in data &&
                    typeof data.message === 'string'
                    ? data.message
                    : `Request failed with status ${response.status}.`

            throw new ApiFetchError(
                message,
                response.status,
                response.statusText,
                data
            )
        }

        return data as T
    } finally {
        if (timeoutId !== undefined) {
            clearTimeout(timeoutId)
        }

        externalSignal?.removeEventListener(
            'abort',
            handleExternalAbort
        )
    }
}