/**
 * axios
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Provides a production-ready, reusable Axios HTTP client configuration.
 *
 *   This module creates a single Axios instance with sensible defaults,
 *   centralized request/response interception, timeout handling, and
 *   consistent error propagation.
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
 *   This gives the application one place to configure:
 *
 *     - base URL
 *     - timeout
 *     - headers
 *     - credentials
 *     - request interceptors
 *     - response interceptors
 *     - common error handling
 *
 * IMPORTANT
 *   This file intentionally does NOT implement token refresh, logout,
 *   navigation, or application-specific authentication logic.
 *
 *   Authentication differs between applications:
 *
 *     - JWT in Authorization headers
 *     - httpOnly cookies
 *     - OAuth
 *     - SSO
 *     - refresh-token rotation
 *
 *   Those policies should be implemented by the application using this client.
 *
 * ENVIRONMENT
 *   Set the API URL through an environment variable.
 *
 *   Vite:
 *     VITE_API_BASE_URL=https://api.example.com
 *
 *   Next.js:
 *     NEXT_PUBLIC_API_BASE_URL=https://api.example.com
 *
 *   Do NOT put secrets in client-exposed environment variables.
 *
 * USAGE
 *
 *   import { api } from './api/axios'
 *
 *   const response = await api.get<User[]>('/users')
 *
 *   const response = await api.post<User>('/users', {
 *     name: 'John',
 *   })
 *
 * INTERCEPTORS
 *   Request interceptor:
 *     A central place to modify outgoing requests.
 *
 *   Response interceptor:
 *     A central place to inspect successful responses or normalize/reject
 *     failed responses.
 *
 * ERROR HANDLING
 *   Axios errors are rejected normally so callers can handle them with
 *   try/catch or an application's query/data-fetching library.
 *
 * SSR
 *   This module does not directly access `window` or `document`.
 *   It is therefore safe to import in server-side environments.
 *
 * SIDE EFFECTS
 *   The Axios instance and its interceptors are created once when this module
 *   is evaluated.
 * ----------------------------------------------------------------------------
 */

import axios, {
    type AxiosError,
    type AxiosInstance,
    type AxiosResponse,
    type InternalAxiosRequestConfig,
} from 'axios'

const API_BASE_URL =
    import.meta.env?.VITE_API_BASE_URL ??
    process.env.NEXT_PUBLIC_API_BASE_URL

const DEFAULT_TIMEOUT = 30_000

/**
 * Creates the application's Axios instance.
 */
function createApiClient(): AxiosInstance {
    const client = axios.create({
        baseURL: API_BASE_URL,
        timeout: DEFAULT_TIMEOUT,
        headers: {
            Accept: 'application/json',
            'Content-Type': 'application/json',
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