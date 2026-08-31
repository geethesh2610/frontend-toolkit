/**
 * ----------------------------------------------------------------------------
 * PURPOSE
 * ----------------------------------------------------------------------------
 * Provides framework-independent utilities for inspecting JavaScript values
 * during frontend development and debugging.
 *
 * Unlike console.log(), these utilities make the structure and characteristics
 * of a value explicit. They are useful when debugging API responses, component
 * data, configuration objects, browser APIs, errors, arrays, and unknown
 * values.
 *
 * The implementation is intentionally dependency-free and works with:
 * - React
 * - Vue / Nuxt
 * - Vanilla JavaScript / TypeScript
 * - Other browser-based applications
 *
 * PARAMETERS
 * ----------------------------------------------------------------------------
 * inspect(value, options?)
 *
 * - value:
 *   Any JavaScript value, including null, undefined, primitives, objects,
 *   arrays, functions, Date, RegExp, Error, Map, Set, and circular objects.
 *
 * - options:
 *   Optional configuration controlling depth, colors, and serialization.
 *
 * RETURN VALUE
 * ----------------------------------------------------------------------------
 * inspect()
 *   Returns a human-readable string representation of the supplied value.
 *
 * inspectValue()
 *   Returns structured information about the value, including its type,
 *   constructor, size, keys, and other useful characteristics.
 *
 * isPlainObject()
 *   Returns true when the supplied value is a normal object created using
 *   Object.prototype or with a null prototype.
 *
 * BEHAVIOR
 * ----------------------------------------------------------------------------
 * - Handles null separately from objects.
 * - Detects arrays, functions, Date, RegExp, Error, Map, Set, Promise,
 *   DOM elements, and common built-in objects.
 * - Safely handles circular references.
 * - Does not mutate the inspected value.
 * - Limits recursion depth to prevent excessively large output.
 * - Uses unknown instead of any.
 * - Handles getters carefully and avoids executing them during inspection.
 * - Handles Symbol and BigInt values.
 *
 * ERROR BEHAVIOR
 * ----------------------------------------------------------------------------
 * Inspection is designed to be safe during debugging.
 *
 * Unexpected failures while reading object properties are represented in the
 * output instead of causing the entire inspection to fail.
 *
 * Invalid option values throw TypeError or RangeError with a clear message.
 *
 * PERFORMANCE
 * ----------------------------------------------------------------------------
 * Inspection recursively traverses objects up to the configured maximum depth.
 *
 * For very large objects, use a smaller maxDepth. The default depth is
 * intentionally conservative so accidentally inspecting a large application
 * object does not produce enormous output.
 *
 * BROWSER SUPPORT
 * ----------------------------------------------------------------------------
 * Designed for modern browsers supporting ES2015+.
 *
 * DOM-specific information is detected only when browser globals such as
 * HTMLElement are available.
 *
 * IMMUTABILITY
 * ----------------------------------------------------------------------------
 * The inspected value is never modified.
 *
 * ----------------------------------------------------------------------------
 */

export interface InspectOptions {
    /**
     * Maximum object/array nesting depth.
     *
     * Default: 3
     */
    readonly maxDepth?: number;

    /**
     * Maximum number of object properties or array items to inspect.
     *
     * Default: 50
     */
    readonly maxItems?: number;

    /**
     * Maximum string length before truncation.
     *
     * Default: 500
     */
    readonly maxStringLength?: number;

    /**
     * Whether non-enumerable properties should be included.
     *
     * Default: false
     */
    readonly showNonEnumerable?: boolean;

    /**
     * Whether symbol properties should be included.
     *
     * Default: false
     */
    readonly showSymbols?: boolean;
}

export interface InspectValue {
    readonly type: string;
    readonly tag: string;
    readonly constructor: string | null;
    readonly isNull: boolean;
    readonly isUndefined: boolean;
    readonly isArray: boolean;
    readonly isFunction: boolean;
    readonly isObject: boolean;
    readonly isPrimitive: boolean;
    readonly keys: readonly string[];
    readonly size?: number;
}

/**
 * Default inspection settings.
 */
const DEFAULT_OPTIONS: Required<InspectOptions> = {
    maxDepth: 3,
    maxItems: 50,
    maxStringLength: 500,
    showNonEnumerable: false,
    showSymbols: false,
};

/**
 * Returns whether a value is a plain JavaScript object.
 */
export function isPlainObject(value: unknown): value is Record<string, unknown> {
    if (value === null || typeof value !== "object") {
        return false;
    }

    const prototype = Object.getPrototypeOf(value);

    return prototype === Object.prototype || prototype === null;
}

/**
 * Returns useful metadata about an unknown value.
 *
 * This is useful when you don't want the complete value printed, but want to
 * quickly understand what kind of value you received.
 *
 * @example
 * inspectValue(response.data)
 *
 * // {
 * //   type: "object",
 * //   tag: "[object Object]",
 * //   constructor: "Object",
 * //   isNull: false,
 * //   isUndefined: false,
 * //   isArray: false,
 * //   isFunction: false,
 * //   isObject: true,
 * //   isPrimitive: false,
 * //   keys: ["id", "name", "email"]
 * // }
 */
export function inspectValue(value: unknown): InspectValue {
    const type = typeof value;
    const isNull = value === null;
    const isUndefined = value === undefined;
    const isArray = Array.isArray(value);
    const isFunction = type === "function";
    const isObject = !isNull && (type === "object" || isFunction);
    const isPrimitive =
        value === null ||
        (type !== "object" && type !== "function");

    const tag = Object.prototype.toString.call(value);

    let constructor: string | null = null;

    if (isObject) {
        try {
            const valueConstructor = Object.getPrototypeOf(value)?.constructor;

            if (
                typeof valueConstructor === "function" &&
                typeof valueConstructor.name === "string"
            ) {
                constructor = valueConstructor.name || null;
            }
        } catch {
            constructor = null;
        }
    }

    const keys = isObject
        ? getInspectableKeys(value, {
            showNonEnumerable: false,
            showSymbols: false,
        })
        : [];

    const size = getValueSize(value);

    return {
        type,
        tag,
        constructor,
        isNull,
        isUndefined,
        isArray,
        isFunction,
        isObject,
        isPrimitive,
        keys,
        ...(size !== undefined ? { size } : {}),
    };
}

/**
 * Returns a readable representation of any JavaScript value.
 *
 * This is the primary utility in this file.
 *
 * @example
 * console.log(inspect(user));
 *
 * @example
 * console.log(inspect(apiResponse, { maxDepth: 2 }));
 *
 * @example
 * console.log(inspect(error));
 */
export function inspect(
    value: unknown,
    options: InspectOptions = {},
): string {
    const resolvedOptions = resolveOptions(options);

    return formatValue(value, resolvedOptions, 0, new WeakSet<object>());
}

/**
 * Safely converts an unknown value into a JSON-like string.
 *
 * Unlike JSON.stringify(), this handles:
 * - circular references
 * - BigInt
 * - undefined
 * - functions
 * - Symbols
 * - Date
 * - RegExp
 * - Error
 * - Map
 * - Set
 *
 * @example
 * const output = inspect(response);
 * console.log(output);
 */
export function inspectJson(
    value: unknown,
    options: InspectOptions = {},
): string {
    return inspect(value, options);
}

/* -------------------------------------------------------------------------- */
/* INTERNAL HELPERS                                                           */
/* -------------------------------------------------------------------------- */

function resolveOptions(options: InspectOptions): Required<InspectOptions> {
    const maxDepth = options.maxDepth ?? DEFAULT_OPTIONS.maxDepth;
    const maxItems = options.maxItems ?? DEFAULT_OPTIONS.maxItems;
    const maxStringLength =
        options.maxStringLength ?? DEFAULT_OPTIONS.maxStringLength;

    if (!Number.isInteger(maxDepth) || maxDepth < 0) {
        throw new RangeError(
            `[debugger/inspect] "maxDepth" must be an integer >= 0. Received: ${String(maxDepth)}`,
        );
    }

    if (!Number.isInteger(maxItems) || maxItems < 1) {
        throw new RangeError(
            `[debugger/inspect] "maxItems" must be an integer >= 1. Received: ${String(maxItems)}`,
        );
    }

    if (!Number.isInteger(maxStringLength) || maxStringLength < 1) {
        throw new RangeError(
            `[debugger/inspect] "maxStringLength" must be an integer >= 1. Received: ${String(maxStringLength)}`,
        );
    }

    return {
        maxDepth,
        maxItems,
        maxStringLength,
        showNonEnumerable:
            options.showNonEnumerable ?? DEFAULT_OPTIONS.showNonEnumerable,
        showSymbols: options.showSymbols ?? DEFAULT_OPTIONS.showSymbols,
    };
}

function formatValue(
    value: unknown,
    options: Required<InspectOptions>,
    depth: number,
    seen: WeakSet<object>,
): string {
    if (value === null) {
        return "null";
    }

    if (value === undefined) {
        return "undefined";
    }

    switch (typeof value) {
        case "string":
            return formatString(value, options.maxStringLength);

        case "number":
            return formatNumber(value);

        case "boolean":
            return String(value);

        case "bigint":
            return `${String(value)}n`;

        case "symbol":
            return String(value);

        case "function":
            return formatFunction(value);

        case "object":
            return formatObject(value, options, depth, seen);

        default:
            return String(value);
    }
}

function formatString(value: string, maxLength: number): string {
    if (value.length <= maxLength) {
        return JSON.stringify(value);
    }

    const truncated = value.slice(0, maxLength);

    return `${JSON.stringify(truncated)} … [${value.length - maxLength} more chars]`;
}

function formatNumber(value: number): string {
    if (Number.isNaN(value)) {
        return "NaN";
    }

    if (value === Infinity) {
        return "Infinity";
    }

    if (value === -Infinity) {
        return "-Infinity";
    }

    if (Object.is(value, -0)) {
        return "-0";
    }

    return String(value);
}

function formatFunction(value: Function): string {
    const name = value.name || "anonymous";

    return `[Function: ${name}]`;
}

function formatObject(
    value: object,
    options: Required<InspectOptions>,
    depth: number,
    seen: WeakSet<object>,
): string {
    const tag = Object.prototype.toString.call(value);

    if (seen.has(value)) {
        return "[Circular]";
    }

    if (value instanceof Date) {
        return formatDate(value);
    }

    if (value instanceof RegExp) {
        return value.toString();
    }

    if (value instanceof Error) {
        return formatError(value, options);
    }

    if (typeof Map !== "undefined" && value instanceof Map) {
        return formatMap(value, options, depth, seen);
    }

    if (typeof Set !== "undefined" && value instanceof Set) {
        return formatSet(value, options, depth, seen);
    }

    if (isPromise(value)) {
        return "[Promise]";
    }

    if (isDomElement(value)) {
        return formatDomElement(value);
    }

    if (depth >= options.maxDepth) {
        return `[${tag.slice(1, -1)}]`;
    }

    seen.add(value);

    try {
        if (Array.isArray(value)) {
            return formatArray(value, options, depth, seen);
        }

        return formatObjectProperties(value, options, depth, seen);
    } finally {
        seen.delete(value);
    }
}

function formatDate(value: Date): string {
    if (Number.isNaN(value.getTime())) {
        return "Date(Invalid)";
    }

    return `Date("${value.toISOString()}")`;
}

function formatError(
    value: Error,
    options: Required<InspectOptions>,
): string {
    const name = value.name || "Error";
    const message = formatString(value.message, options.maxStringLength);

    const stack = value.stack
        ? `\n  stack: ${formatString(value.stack, options.maxStringLength)}`
        : "";

    return `${name}(${message})${stack}`;
}

function formatMap(
    value: Map<unknown, unknown>,
    options: Required<InspectOptions>,
    depth: number,
    seen: WeakSet<object>,
): string {
    if (depth >= options.maxDepth) {
        return `Map(${value.size})`;
    }

    seen.add(value);

    try {
        const entries = Array.from(value.entries()).slice(0, options.maxItems);

        const formatted = entries.map(([key, mapValue]) => {
            return `${formatValue(key, options, depth + 1, seen)} => ${formatValue(
                mapValue,
                options,
                depth + 1,
                seen,
            )}`;
        });

        const remaining = value.size - entries.length;

        if (remaining > 0) {
            formatted.push(`… ${remaining} more entries`);
        }

        return `Map(${value.size}) { ${formatted.join(", ")} }`;
    } finally {
        seen.delete(value);
    }
}

function formatSet(
    value: Set<unknown>,
    options: Required<InspectOptions>,
    depth: number,
    seen: WeakSet<object>,
): string {
    if (depth >= options.maxDepth) {
        return `Set(${value.size})`;
    }

    seen.add(value);

    try {
        const values = Array.from(value.values()).slice(0, options.maxItems);

        const formatted = values.map((item) =>
            formatValue(item, options, depth + 1, seen),
        );

        const remaining = value.size - values.length;

        if (remaining > 0) {
            formatted.push(`… ${remaining} more values`);
        }

        return `Set(${value.size}) { ${formatted.join(", ")} }`;
    } finally {
        seen.delete(value);
    }
}

function formatArray(
    value: readonly unknown[],
    options: Required<InspectOptions>,
    depth: number,
    seen: WeakSet<object>,
): string {
    const items = value.slice(0, options.maxItems);

    const formatted = items.map((item) =>
        formatValue(item, options, depth + 1, seen),
    );

    const remaining = value.length - items.length;

    if (remaining > 0) {
        formatted.push(`… ${remaining} more items`);
    }

    return `[${formatted.join(", ")}]`;
}

function formatObjectProperties(
    value: object,
    options: Required<InspectOptions>,
    depth: number,
    seen: WeakSet<object>,
): string {
    const keys = getInspectableKeys(value, options);
    const limitedKeys = keys.slice(0, options.maxItems);

    const properties = limitedKeys.map((key) => {
        const result = safelyReadProperty(value, key);

        if (!result.success) {
            return `${key}: [Unable to read property]`;
        }

        return `${key}: ${formatValue(
            result.value,
            options,
            depth + 1,
            seen,
        )}`;
    });

    const remaining = keys.length - limitedKeys.length;

    if (remaining > 0) {
        properties.push(`… ${remaining} more properties`);
    }

    const constructorName = getConstructorName(value);

    const prefix =
        constructorName && constructorName !== "Object"
            ? `${constructorName} `
            : "";

    return `${prefix}{ ${properties.join(", ")} }`;
}

function getInspectableKeys(
    value: object,
    options: Pick<InspectOptions, "showNonEnumerable" | "showSymbols">,
): string[] {
    let keys: string[];

    try {
        keys = options.showNonEnumerable
            ? Object.getOwnPropertyNames(value)
            : Object.keys(value);
    } catch {
        return [];
    }

    if (!options.showSymbols) {
        return keys;
    }

    try {
        const symbols = Object.getOwnPropertySymbols(value);

        return [
            ...keys,
            ...symbols.map((symbol) => `[${String(symbol)}]`),
        ];
    } catch {
        return keys;
    }
}

function safelyReadProperty(
    object: object,
    key: string,
): { success: true; value: unknown } | { success: false } {
    try {
        const descriptor = Object.getOwnPropertyDescriptor(object, key);

        /**
         * Do not execute getters while inspecting.
         *
         * Getters can have side effects, trigger expensive work, throw errors,
         * or depend on application state.
         */
        if (descriptor && !("value" in descriptor)) {
            return {
                success: true,
                value: "[Getter]",
            };
        }

        return {
            success: true,
            value: Reflect.get(object, key),
        };
    } catch {
        return {
            success: false,
        };
    }
}

function getConstructorName(value: object): string | null {
    try {
        const constructor = Object.getPrototypeOf(value)?.constructor;

        if (typeof constructor === "function" && constructor.name) {
            return constructor.name;
        }

        return null;
    } catch {
        return null;
    }
}

function getValueSize(value: unknown): number | undefined {
    if (typeof value === "string") {
        return value.length;
    }

    if (Array.isArray(value)) {
        return value.length;
    }

    if (value instanceof Map || value instanceof Set) {
        return value.size;
    }

    return undefined;
}

function isPromise(value: object): boolean {
    return Object.prototype.toString.call(value) === "[object Promise]";
}

function isDomElement(value: object): boolean {
    if (typeof HTMLElement === "undefined") {
        return false;
    }

    return value instanceof HTMLElement;
}

function formatDomElement(value: object): string {
    const element = value as HTMLElement;

    const tagName = element.tagName.toLowerCase();

    const id = element.id ? `#${element.id}` : "";

    const className =
        typeof element.className === "string" && element.className
            ? `.${element.className.trim().replace(/\s+/g, ".")}`
            : "";

    return `<${tagName}${id}${className}>`;
}