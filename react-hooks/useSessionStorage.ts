/**
 * useSessionStorage
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Provides a React state interface backed by the browser's sessionStorage.
 *
 *   The hook keeps React state synchronized with sessionStorage and exposes
 *   a familiar `[value, setValue]` style API.
 *
 *   Unlike localStorage, sessionStorage data is scoped to the current browser
 *   tab/session and is normally removed when that tab or window is closed.
 *
 * WHEN TO USE
 *   - Multi-step form state that should survive page refreshes.
 *   - Temporary filters and sorting preferences.
 *   - Wizard progress within the current browser tab.
 *   - Temporary UI state that should survive navigation/reloads.
 *   - Search/filter state that should not persist across browser sessions.
 *   - Temporary draft data that belongs only to the current tab.
 *
 * WHEN NOT TO USE
 *   - Passwords or sensitive credentials.
 *   - Authentication tokens where secure storage is required.
 *   - Large datasets.
 *   - Server-authoritative application state.
 *   - Data that needs to persist after the browser tab/session ends.
 *
 *   IMPORTANT
 *   sessionStorage is accessible to JavaScript. It is NOT secure storage.
 *
 * PARAMETERS
 *   key
 *     The sessionStorage key.
 *
 *   initialValue
 *     Value used when the key does not exist or stored data cannot be parsed.
 *
 *     Can be either:
 *
 *       value
 *       () => value
 *
 *     A lazy initializer can be useful when calculating the initial value is
 *     expensive.
 *
 *   options
 *
 *   options.serializer
 *     Converts the value into a string before storing it.
 *
 *     Default: JSON.stringify
 *
 *   options.deserializer
 *     Converts the stored string back into the original value.
 *
 *     Default: JSON.parse
 *
 *   options.initializeWithValue
 *     Whether sessionStorage should be read during the initial client render.
 *
 *     Default: true.
 *
 *     Set to false when using SSR/hydration-sensitive components. The hook
 *     initially returns `initialValue` and synchronizes with sessionStorage
 *     after mounting.
 *
 *   options.onError
 *     Optional callback invoked when reading, serializing, writing, or
 *     removing a sessionStorage value fails.
 *
 * RETURN VALUE
 *   {
 *     value,
 *     setValue,
 *     removeValue
 *   }
 *
 *   value
 *     Current stored value.
 *
 *   setValue
 *     Updates React state and sessionStorage.
 *
 *     Supports:
 *
 *       setValue(nextValue)
 *
 *     and React-style functional updates:
 *
 *       setValue(previousValue => nextValue)
 *
 *   removeValue
 *     Removes the key from sessionStorage and resets the React state to the
 *     original initial value.
 *
 * ERROR BEHAVIOR
 *   sessionStorage can fail because of:
 *
 *   - Browser privacy restrictions.
 *   - Storage being disabled.
 *   - Storage quota limitations.
 *   - Invalid/corrupted stored JSON.
 *   - Serialization failures.
 *
 *   Storage errors are not thrown into the React component tree.
 *
 *   When reading fails, the hook falls back to `initialValue`.
 *
 *   When writing fails, React state is still updated, but persistence may
 *   fail.
 *
 * SSR / NEXT.JS
 *   Safe during SSR.
 *
 *   `window` and `sessionStorage` are accessed only when available.
 *
 *   During SSR, the value is derived from `initialValue`.
 *
 *   In Next.js App Router, the component using this hook must be a Client
 *   Component because sessionStorage is a browser API.
 *
 * HYDRATION
 *   Set `initializeWithValue: false` when the initial rendered value must
 *   exactly match the server-rendered value.
 *
 * CROSS-TAB BEHAVIOR
 *   sessionStorage is intentionally NOT synchronized between browser tabs.
 *
 *   Each tab/window has its own sessionStorage area.
 *
 *   Therefore, unlike localStorage, there is normally no cross-tab state
 *   synchronization to implement.
 *
 * STORAGE FORMAT
 *   Values are JSON serialized by default.
 *
 *   This supports:
 *
 *     strings
 *     numbers
 *     booleans
 *     arrays
 *     plain objects
 *     null
 *
 *   Functions, Symbols, DOM nodes, class instances, etc. should not be stored
 *   unless a custom serializer/deserializer is supplied.
 *
 * CLEANUP
 *   No browser event listeners are required, so there is no subscription
 *   cleanup.
 *
 * PERFORMANCE
 *   sessionStorage is synchronous.
 *
 *   Avoid storing very large objects or frequently changing data because
 *   serialization and storage operations block the main thread.
 *
 * USAGE
 *
 *   const [step, setStep] = useSessionStorage('checkout-step', 1)
 *
 *   setStep(2)
 *
 * USAGE WITH AN OBJECT
 *
 *   const [filters, setFilters] = useSessionStorage(
 *     'report-filters',
 *     {
 *       search: '',
 *       status: 'all',
 *     }
 *   )
 *
 *   setFilters(previous => ({
 *     ...previous,
 *     search: 'react',
 *   }))
 *
 * ----------------------------------------------------------------------------
 */

import {
    useCallback,
    useEffect,
    useRef,
    useState,
    type Dispatch,
    type SetStateAction,
} from 'react'

export interface UseSessionStorageOptions<T> {
    /**
     * Serialize a value before storing it.
     *
     * Default: JSON.stringify
     */
    serializer?: (value: T) => string

    /**
     * Deserialize a stored value.
     *
     * Default: JSON.parse
     */
    deserializer?: (value: string) => T

    /**
     * Whether to read sessionStorage during the initial client render.
     *
     * Default: true.
     */
    initializeWithValue?: boolean

    /**
     * Called when a sessionStorage operation fails.
     */
    onError?: (error: unknown) => void
}

export interface UseSessionStorageReturn<T> {
    value: T
    setValue: Dispatch<SetStateAction<T>>
    removeValue: () => void
}

function isStorageAvailable(): boolean {
    if (typeof window === 'undefined') {
        return false
    }

    try {
        const storage = window.sessionStorage
        const testKey = '__useSessionStorage_test__'

        storage.setItem(testKey, '1')
        storage.removeItem(testKey)

        return true
    } catch {
        return false
    }
}

export function useSessionStorage<T>(
    key: string,
    initialValue: T | (() => T),
    options: UseSessionStorageOptions<T> = {}
): UseSessionStorageReturn<T> {
    const {
        serializer = JSON.stringify,
        deserializer = JSON.parse,
        initializeWithValue = true,
        onError,
    } = options

    /*
     * Keep the original initial value stable.
     *
     * This is important because consumers may pass a new object/function
     * during subsequent renders.
     */
    const initialValueRef = useRef(initialValue)

    const onErrorRef = useRef(onError)

    useEffect(() => {
        onErrorRef.current = onError
    }, [onError])

    const getInitialValue = useCallback((): T => {
        return typeof initialValueRef.current === 'function'
            ? (initialValueRef.current as () => T)()
            : initialValueRef.current
    }, [])

    const readValue = useCallback((): T => {
        const fallbackValue = getInitialValue()

        if (
            !initializeWithValue ||
            !isStorageAvailable()
        ) {
            return fallbackValue
        }

        try {
            const storedValue =
                window.sessionStorage.getItem(key)

            if (storedValue === null) {
                return fallbackValue
            }

            return deserializer(storedValue)
        } catch (error) {
            onErrorRef.current?.(error)

            return fallbackValue
        }
    }, [
        key,
        deserializer,
        initializeWithValue,
        getInitialValue,
    ])

    const [value, setValue] = useState<T>(readValue)

    /*
     * Keep the latest value available to functional updates without relying
     * on a potentially stale closure.
     */
    const valueRef = useRef(value)

    useEffect(() => {
        valueRef.current = value
    }, [value])

    /*
     * When the storage key changes, load the value associated with the new key.
     */
    useEffect(() => {
        setValue(readValue())
    }, [key, readValue])

    const setStoredValue = useCallback<
        Dispatch<SetStateAction<T>>
    >(
        (valueOrUpdater) => {
            const nextValue =
                typeof valueOrUpdater === 'function'
                    ? (
                        valueOrUpdater as (
                            previousValue: T
                        ) => T
                    )(valueRef.current)
                    : valueOrUpdater

            valueRef.current = nextValue
            setValue(nextValue)

            if (!isStorageAvailable()) {
                return
            }

            try {
                const serializedValue =
                    serializer(nextValue)

                window.sessionStorage.setItem(
                    key,
                    serializedValue
                )
            } catch (error) {
                onErrorRef.current?.(error)
            }
        },
        [key, serializer]
    )

    const removeValue = useCallback(() => {
        const fallbackValue = getInitialValue()

        valueRef.current = fallbackValue
        setValue(fallbackValue)

        if (!isStorageAvailable()) {
            return
        }

        try {
            window.sessionStorage.removeItem(key)
        } catch (error) {
            onErrorRef.current?.(error)
        }
    }, [key, getInitialValue])

    return {
        value,
        setValue: setStoredValue,
        removeValue,
    }
}