/**
 * STORAGE DEBUGGER
 *
 * PURPOSE
 * -------
 * Utilities for inspecting and debugging browser localStorage and
 * sessionStorage.
 *
 * Helps answer:
 * - What data is currently stored?
 * - Does a particular key exist?
 * - What value is stored under a key?
 * - Is the stored value valid JSON?
 * - Which keys are currently present?
 * - How much data is stored?
 * - Can I quickly remove or clear debugging data?
 *
 * AVAILABLE FUNCTIONS
 * -------------------
 * storage.get(key, type?)
 *   Reads a value from browser storage.
 *   Returns: string | null
 *
 * storage.getJson<T>(key, type?)
 *   Reads and parses a JSON value.
 *   Returns: T | null
 *
 * storage.set(key, value, type?)
 *   Stores a string value.
 *   Returns: void
 *
 * storage.setJson(key, value, type?)
 *   Serializes and stores a value as JSON.
 *   Returns: void
 *
 * storage.remove(key, type?)
 *   Removes one stored value.
 *   Returns: void
 *
 * storage.clear(type?)
 *   Removes all values from the selected storage.
 *   Returns: void
 *
 * storage.has(key, type?)
 *   Checks whether a key exists.
 *   Returns: boolean
 *
 * storage.keys(type?)
 *   Returns all keys.
 *   Returns: readonly string[]
 *
 * storage.entries(type?)
 *   Returns all stored key/value pairs.
 *   Returns: readonly StorageEntry[]
 *
 * storage.find(search, type?)
 *   Finds keys containing the supplied text.
 *   Returns: readonly string[]
 *
 * storage.size(type?)
 *   Returns the number of stored keys.
 *   Returns: number
 *
 * storage.inspect(type?)
 *   Prints the selected storage contents to the console.
 *   Returns: readonly StorageEntry[]
 *
 *
 * STORAGE TYPE
 * ------------
 * All functions accept:
 *
 *     "local"
 *     "session"
 *
 * Default:
 *
 *     "local"
 *
 * Example:
 *
 *     storage.get("token");
 *     storage.get("token", "session");
 *
 *
 * BASIC USAGE
 * -----------
 *
 * storage.get("user");
 *
 * storage.set("theme", "dark");
 *
 * storage.remove("theme");
 *
 * storage.has("token");
 *
 * storage.keys();
 *
 *
 * JSON DATA
 * ---------
 *
 * Store:
 *
 *     storage.setJson("user", {
 *         id: 1,
 *         name: "John",
 *     });
 *
 * Read:
 *
 *     const user = storage.getJson<User>("user");
 *
 *
 * INSPECT STORAGE
 * ---------------
 *
 * storage.inspect();
 *
 * Output:
 *
 *     [STORAGE] localStorage
 *     ┌─────────┬───────────┐
 *     │ key     │ value     │
 *     ├─────────┼───────────┤
 *     │ theme   │ "dark"    │
 *     │ user    │ "{...}"   │
 *     └─────────┴───────────┘
 *
 *
 * FIND KEYS
 * ---------
 *
 * storage.find("user");
 *
 * Useful when an application has many stored values.
 *
 *
 * IMPORTANT
 * ---------
 * This utility works with browser storage only.
 *
 * It does not provide secure storage.
 *
 * localStorage and sessionStorage should NOT be treated as secure storage
 * for passwords, secrets, or sensitive authentication information.
 *
 * JSON PARSING
 * -----------
 * getJson() returns null when:
 * - the key does not exist
 * - the stored value is invalid JSON
 *
 * STORAGE ERRORS
 * --------------
 * Browser storage can throw errors when:
 * - storage is unavailable
 * - browser privacy settings block storage
 * - storage quota is exceeded
 * - access is restricted
 *
 * These errors are allowed to propagate because silently hiding storage
 * failures can make frontend debugging much harder.
 *
 * IMMUTABILITY
 * ------------
 * Values returned from getJson() are newly parsed values.
 *
 * The original stored string is never modified.
 *
 * BROWSER SUPPORT
 * ---------------
 * Requires localStorage/sessionStorage.
 *
 * Designed for modern browsers.
 */

export type StorageType = "local" | "session";

export interface StorageEntry {
    readonly key: string;
    readonly value: string;
}

const DEFAULT_STORAGE_TYPE: StorageType = "local";

function getStorage(type: StorageType): Storage {
    if (typeof window === "undefined") {
        throw new Error(
            "[debugger/storage] Browser storage is not available outside a browser environment.",
        );
    }

    if (type !== "local" && type !== "session") {
        throw new TypeError(
            `[debugger/storage] Invalid storage type "${String(
                type,
            )}". Expected "local" or "session".`,
        );
    }

    return type === "local"
        ? window.localStorage
        : window.sessionStorage;
}

function validateKey(key: string): string {
    const trimmedKey = key.trim();

    if (!trimmedKey) {
        throw new TypeError(
            '[debugger/storage] "key" must be a non-empty string.',
        );
    }

    return trimmedKey;
}

function resolveType(type?: StorageType): StorageType {
    return type ?? DEFAULT_STORAGE_TYPE;
}

export function get(
    key: string,
    type: StorageType = DEFAULT_STORAGE_TYPE,
): string | null {
    const storage = getStorage(resolveType(type));

    return storage.getItem(validateKey(key));
}

export function getJson<T>(
    key: string,
    type: StorageType = DEFAULT_STORAGE_TYPE,
): T | null {
    const value = get(key, type);

    if (value === null) {
        return null;
    }

    try {
        return JSON.parse(value) as T;
    } catch {
        return null;
    }
}

export function set(
    key: string,
    value: string,
    type: StorageType = DEFAULT_STORAGE_TYPE,
): void {
    const storage = getStorage(resolveType(type));

    storage.setItem(
        validateKey(key),
        value,
    );
}

export function setJson<T>(
    key: string,
    value: T,
    type: StorageType = DEFAULT_STORAGE_TYPE,
): void {
    let serializedValue: string;

    try {
        serializedValue = JSON.stringify(value);
    } catch (error: unknown) {
        throw new Error(
            `[debugger/storage] Unable to serialize value for key "${key}".`,
            {
                cause: error,
            },
        );
    }

    if (serializedValue === undefined) {
        throw new TypeError(
            `[debugger/storage] Value for key "${key}" cannot be represented as JSON.`,
        );
    }

    set(key, serializedValue, type);
}

export function remove(
    key: string,
    type: StorageType = DEFAULT_STORAGE_TYPE,
): void {
    const storage = getStorage(resolveType(type));

    storage.removeItem(validateKey(key));
}

export function clear(
    type: StorageType = DEFAULT_STORAGE_TYPE,
): void {
    getStorage(resolveType(type)).clear();
}

export function has(
    key: string,
    type: StorageType = DEFAULT_STORAGE_TYPE,
): boolean {
    return get(key, type) !== null;
}

export function keys(
    type: StorageType = DEFAULT_STORAGE_TYPE,
): readonly string[] {
    const storage = getStorage(resolveType(type));
    const result: string[] = [];

    for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);

        if (key !== null) {
            result.push(key);
        }
    }

    return result;
}

export function entries(
    type: StorageType = DEFAULT_STORAGE_TYPE,
): readonly StorageEntry[] {
    const storage = getStorage(resolveType(type));
    const result: StorageEntry[] = [];

    for (let index = 0; index < storage.length; index += 1) {
        const key = storage.key(index);

        if (key === null) {
            continue;
        }

        const value = storage.getItem(key);

        if (value !== null) {
            result.push({
                key,
                value,
            });
        }
    }

    return result;
}

export function find(
    search: string,
    type: StorageType = DEFAULT_STORAGE_TYPE,
): readonly string[] {
    const query = search.trim();

    if (!query) {
        throw new TypeError(
            '[debugger/storage] "search" must be a non-empty string.',
        );
    }

    const normalizedQuery = query.toLowerCase();

    return keys(type).filter((key) =>
        key.toLowerCase().includes(normalizedQuery),
    );
}

export function size(
    type: StorageType = DEFAULT_STORAGE_TYPE,
): number {
    return getStorage(resolveType(type)).length;
}

export function inspect(
    type: StorageType = DEFAULT_STORAGE_TYPE,
): readonly StorageEntry[] {
    const storageType = resolveType(type);
    const storageEntries = entries(storageType);

    console.group(
        `[STORAGE] ${storageType === "local"
            ? "localStorage"
            : "sessionStorage"}`,
    );

    if (storageEntries.length === 0) {
        console.info("Storage is empty.");
    } else {
        console.table(storageEntries);
    }

    console.info(`Total keys: ${storageEntries.length}`);

    console.groupEnd();

    return storageEntries;
}

export const storage = {
    get,
    getJson,
    set,
    setJson,
    remove,
    clear,
    has,
    keys,
    entries,
    find,
    size,
    inspect,
};