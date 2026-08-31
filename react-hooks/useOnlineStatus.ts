/**
 * useOnlineStatus
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Tracks whether the browser currently reports the device as online or
 *   offline.
 *
 *   The hook uses the browser's native `navigator.onLine` property together
 *   with the `online` and `offline` window events.
 *
 *   This is useful when application behavior needs to react to changes in
 *   network connectivity.
 *
 * WHEN TO USE
 *   - Showing an offline/online status indicator.
 *   - Disabling actions that require network connectivity.
 *   - Pausing network-dependent behavior while offline.
 *   - Triggering a refresh/retry when connectivity returns.
 *   - Offline-first applications.
 *   - PWAs.
 *   - Informing users that changes cannot currently be synchronized.
 *
 * WHEN NOT TO USE
 *   - To determine whether your API/backend is reachable.
 *   - To determine whether a specific HTTP request succeeded.
 *   - As a replacement for request error handling.
 *
 *   `navigator.onLine === true` only means the browser considers the device
 *   to have network connectivity. It does NOT guarantee that the internet,
 *   DNS, VPN, proxy, API server, or backend is reachable.
 *
 * PARAMETERS
 *   None.
 *
 * RETURN VALUE
 *   boolean
 *
 *   `true`
 *     The browser currently reports that the device is online.
 *
 *   `false`
 *     The browser currently reports that the device is offline.
 *
 * SSR / NEXT.JS
 *   Safe to use during SSR.
 *
 *   `navigator` and `window` are accessed only inside effects or guarded
 *   browser checks.
 *
 *   During SSR there is no reliable way to determine the client's network
 *   status, so the initial value is `true` by default.
 *
 *   The actual browser state is synchronized after the component mounts.
 *
 * HYDRATION
 *   The initial state is deterministic so the server and initial client
 *   render do not attempt to access browser-only APIs.
 *
 *   After mounting, the hook immediately synchronizes with
 *   `navigator.onLine`.
 *
 * BEHAVIOR
 *   - Reads `navigator.onLine` when the component mounts.
 *   - Listens for the browser's `online` event.
 *   - Listens for the browser's `offline` event.
 *   - Updates React state when either event occurs.
 *   - Does not poll the network.
 *
 * ERROR BEHAVIOR
 *   No error state is exposed.
 *
 *   The browser's online/offline status is an environmental signal rather
 *   than an application error.
 *
 * CLEANUP
 *   Both window event listeners are removed when the component unmounts.
 *
 * PERFORMANCE
 *   No polling or timers are used.
 *
 *   The browser notifies the hook only when its online/offline status changes.
 *
 * IMPORTANT
 *   This hook should normally be combined with actual request error handling
 *   for production network-dependent applications.
 *
 *   For example:
 *
 *     isOnline === true
 *       +
 *     API request fails
 *
 *   does NOT necessarily mean the browser is offline.
 *
 * USAGE
 *
 *   const isOnline = useOnlineStatus()
 *
 *   if (!isOnline) {
 *     return <OfflineBanner />
 *   }
 *
 * ----------------------------------------------------------------------------
 */

import { useEffect, useState } from 'react'

export function useOnlineStatus(): boolean {
    const [isOnline, setIsOnline] = useState(true)

    useEffect(() => {
        if (typeof window === 'undefined') {
            return
        }

        /*
         * Synchronize with the actual browser state after mounting.
         *
         * The initial state is intentionally deterministic for SSR/hydration.
         */
        setIsOnline(navigator.onLine)

        const handleOnline = () => {
            setIsOnline(true)
        }

        const handleOffline = () => {
            setIsOnline(false)
        }

        window.addEventListener('online', handleOnline)
        window.addEventListener('offline', handleOffline)

        return () => {
            window.removeEventListener('online', handleOnline)
            window.removeEventListener('offline', handleOffline)
        }
    }, [])

    return isOnline
}