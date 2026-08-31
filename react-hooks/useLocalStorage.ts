/**
 * useLocalStorage
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Provides a React state interface backed by the browser's localStorage.
 *
 *   The hook keeps React state and localStorage synchronized so consumers can
 *   work with persistent state using a familiar `[value, setValue]` API.
 *
 *   Values are serialized using JSON, allowing the hook to store strings,
 *   numbers, booleans, arrays, objects, and other JSON-compatible values.
 *
 * WHEN TO USE
 *   - Persisting user preferences.
 *   - Table filters and sorting preferences.
 *   - Sidebar/menu state.
 *   - UI preferences such as theme selection.
 *   - Recently selected values.
 *   - Non-sensitive client-side application preferences.
 *   - Small pieces of state that should survive page reloads.
 *
 * WHEN NOT TO USE
 *   - Authentication tokens or sensitive credentials.
 *   - Passwords.
 *   - Large datasets.
 *   - Server-authoritative application state.
 *   - Data that must be secure from JavaScript access.
 *
 *   localStorage is accessible to JavaScript and should NEVER be treated as
 *   secure storage.
 *
 * PARAMETERS
 *   key
 *     The localStorage key.
 *
 *   initialValue
 *     Value used when the key does not exist or stored data cannot be parsed.
 *
 *     Can be either:
 *
 *       value
 *       () => value
 *
 *     A lazy initializer is useful when calculating the default value is
 *     expensive.
 *
 *   options
 *     Optional configuration.
 *
 *   options.serializer
 *     Function used to convert the value into a string before storage.
 *     Defaults to JSON.stringify.
 *
 *   options.deserializer
 *     Function used to convert the stored string back into a value.
 *     Defaults to JSON.parse.
 *
 *   options.initializeWithValue
 *     Whether the hook should read localStorage during initial client
 *     rendering.
 *
 *     Default: `true`.
 *
 *     Set this to `false` for SSR/hydration-sensitive components. The hook
 *     will initially return `initialValue` and synchronize with localStorage
 *     after mounting.
 *
 *   options.syncAcrossTabs
 *     Whether changes made to the same localStorage key in another browser
 *     tab/window should update this hook.
 *
 *     Default: `true`.
 *
 * RETURN VALUE
 *   [
 *     value,
 *     setValue,
 *     removeValue
 *   ]
 *
 *   value
 *     Current stored value.
 *
 *   setValue
 *     Updates React state and localStorage.
 *
 *     Supports both:
 *
 *       setValue(newValue)
 *
 *     and React-style functional updates:
 *
 *       setValue(previousValue => nextValue)
 *
 *   removeValue
 *     Removes the key from localStorage and resets the React state to the
 *     original initial value.
 *
 * ERROR BEHAVIOR
 *   localStorage can fail for several reasons:
 *
 *   - Browser privacy restrictions.
 *   - Storage disabled.
 *   - Storage quota exceeded.
 *   - Malformed existing data.
 *   - Serialization errors.
 *
 *   The hook does NOT throw storage errors into the component tree.
 *
 *   When reading fails, the initial value is used.
 *
 *   When writing fails, React state is still updated but persistence may fail.
 *
 *   An optional `onError` callback can be supplied when the application needs
 *   to observe or log storage failures.
 *
 * SSR / NEXT.JS
 *   Safe during SSR.
 *
 *   `window` and `localStorage` are accessed only when available.
 *
 *   Because localStorage does not exist on the server, the server-side value
 *   is always based on `initialValue`.
 *
 *   For Next.js App Router, the component using this hook must be a Client
 *   Component because localStorage is a browser API.
 *
 * HYDRATION
 *   `initializeWithValue: false` can be used when the initial client value
 *   must exactly match the server-rendered value.
 *
 *   Example:
 *
 *     const [theme, setTheme] = useLocalStorage('theme', 'light', {
 *       initializeWithValue: false,
 *     })
 *
 *   The hook then synchronizes with localStorage after mounting.
 *
 * CROSS-TAB SYNCHRONIZATION
 *   When `syncAcrossTabs` is enabled, the hook listens for the browser's
 *   `storage` event.
 *
 *   A change made in another tab using the same localStorage key updates
 *   this hook automatically.
 *
 *   Note:
 *   The `storage` event does not fire in the same document that performed
 *   the localStorage write, so React state is updated directly for local
 *   writes.
 *
 * STORAGE FORMAT
 *   Values are JSON serialized.
 *
 *   Examples:
 *
 *     "hello"      → "\"hello\""
 *     123          → "123"
 *     true         → "true"
 *     { theme: 1 } → "{\"theme\":1}"
 *
 *   Values containing functions, Symbols, DOM nodes, class instances, etc.
 *   should not be stored unless a custom serializer/deserializer is supplied.
 *
 * CLEANUP
 *   The `storage` event listener is removed when the component unmounts,
 *   when the key changes, or when cross-tab synchronization is disabled.
 *
 * IMPORTANT
 *   localStorage is synchronous. Avoid storing very large objects or
 *   frequently changing data because serialization and storage operations
 *   block the main thread.
 *
 * USAGE
 *
 *   const [theme, setTheme] = useLocalStorage('theme', 'light')
 *
 *   setTheme('dark')
 *
 * USAGE WITH FUNCTIONAL UPDATE
 *
 *   const [filters, setFilters] = useLocalStorage('filters', {
 *     search: '',
 *     status: 'all',
 *   })
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

export interface UseLocalStorageOptions<T> {
    /**
     * Serialize a value before storing it.
     *
     * Default: JSON.stringify
     */
    serializer?: (value: T) => string

    /**
     * Deserialize a value retrieved from localStorage.
     *
     * Default: JSON.parse
     */
    deserializer?: (value: string) => T

    /**
     * Whether to read localStorage during the initial client render.
     *
     * Default: true.
     */
    initializeWithValue?: boolean

    /**
     * Whether to synchronize changes made by other browser tabs/windows.
     *
     * Default: true.
     */
    syncAcrossTabs?: boolean

    /**
     * Called when a localStorage operation fails.
     */
    onError?: (error: unknown) => void
}

export interface UseLocalStorageReturn<T> {
    value: T
    setValue: Dispatch<SetStateAction<T>>
    removeValue: () => void
}

function isStorageAvailable(): boolean {
    if (typeof window === 'undefined') {
        return false
    }

    try {
        const storage = window.localStorage
        const testKey = '__useLocalStorage_test__'

        storage.setItem(testKey, '1')
        storage.removeItem(testKey)

        return true
    } catch {
        return false
    }
}

export function useLocalStorage<T>(
    key: string,
    initialValue: T | (() => T),
    options: UseLocalStorageOptions<T> = {}
): UseLocalStorageReturn<T> {
    const {
        serializer = JSON.stringify,
        deserializer = JSON.parse,
        initializeWithValue = true,
        syncAcrossTabs = true,
        onError,
    } = options

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
            const storedValue = window.localStorage.getItem(key)

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
     * Keep the latest value available to callbacks without creating stale
     * closures.
     */
    const valueRef = useRef(value)

    useEffect(() => {
        valueRef.current = value
    }, [value])

    /*
     * If the key changes, synchronize React state with the new localStorage
     * entry.
     */
    useEffect(() => {
        setValue(readValue())
    }, [key, readValue])

    const setStoredValue = useCallback<Dispatch<SetStateAction<T>>>(
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
                const serializedValue = serializer(nextValue)

                window.localStorage.setItem(
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
            window.localStorage.removeItem(key)
        } catch (error) {
            onErrorRef.current?.(error)
        }
    }, [key, getInitialValue])

    useEffect(() => {
        if (!syncAcrossTabs) {
            return
        }

        if (typeof window === 'undefined') {
            return
        }

        const handleStorageChange = (event: StorageEvent) => {
            /*
             * Ignore changes for other localStorage keys.
             */
            if (event.key !== key) {
                return
            }

            /*
             * `newValue === null` means another tab removed the key.
             */
            if (event.newValue === null) {
                const fallbackValue = getInitialValue()

                valueRef.current = fallbackValue
                setValue(fallbackValue)

                return
            }

            try {
                const nextValue = deserializer(event.newValue)

                valueRef.current = nextValue
                setValue(nextValue)
            } catch (error) {
                onErrorRef.current?.(error)
            }
        }

        window.addEventListener(
            'storage',
            handleStorageChange
        )

        return () => {
            window.removeEventListener(
                'storage',
                handleStorageChange
            )
        }
    }, [
        key,
        syncAcrossTabs,
        deserializer,
        getInitialValue,
    ])

    return {
        value,
        setValue: setStoredValue,
        removeValue,
    }
}