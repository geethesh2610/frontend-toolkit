/**
 * useControllableState
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Generic controlled/uncontrolled state with support for React's
 *   "updater function" pattern (`setValue(old => next)`), not just plain
 *   values. This is the exact shape TanStack Table's `state` / `onXChange`
 *   options expect, so the returned setter can be passed straight through
 *   as e.g. `onSortingChange={setSorting}`.
 *
 * WHEN TO USE
 *   - Any piece of state a component wants to own by default, but that a
 *     parent may optionally take over (sorting, pagination, filters,
 *     column visibility, etc.) — the same "controlled if you pass a
 *     value, uncontrolled otherwise" contract as a native `<input>`.
 *
 * PARAMETERS (single options object)
 *   options.value          Provide to switch to CONTROLLED mode: the
 *                          returned value always mirrors this. Omit for
 *                          UNCONTROLLED mode (internal state is used).
 *   options.defaultValue   Initial value in uncontrolled mode. Ignored
 *                          (but still required, for a stable type) once
 *                          `value` is provided.
 *   options.onChange       Called with the resolved next value whenever
 *                          the returned setter runs, in BOTH modes.
 *
 * RETURN VALUE
 *   [value, setValue] — `setValue` accepts either a plain value or an
 *   updater function `(old: T) => T`, mirroring `useState`.
 *
 * BEHAVIOR
 *   Controlled vs. uncontrolled is locked in on the first render, exactly
 *   like `useDisclosure`. Switching later logs a one-time dev warning.
 * ----------------------------------------------------------------------------
 */

import { useCallback, useRef, useState } from "react";

export type ControllableUpdater<T> = T | ((old: T) => T);

export interface UseControllableStateOptions<T> {
    value?: T;
    defaultValue: T;
    onChange?: (value: T) => void;
}

export function useControllableState<T>(
    options: UseControllableStateOptions<T>,
): [T, (updater: ControllableUpdater<T>) => void] {
    const { value: controlledValue, defaultValue, onChange } = options;

    const isControlled = useRef(controlledValue !== undefined).current;
    const [internalValue, setInternalValue] = useState(defaultValue);
    const warnedRef = useRef(false);

    if (typeof process !== "undefined" && process.env.NODE_ENV !== "production") {
        const isNowControlled = controlledValue !== undefined;
        if (isControlled !== isNowControlled && !warnedRef.current) {
            warnedRef.current = true;
            console.warn(
                "useControllableState: switching between controlled and uncontrolled `value` is not supported. " +
                "Decide once, on the first render, whether the parent will own this state.",
            );
        }
    }

    const value = isControlled ? (controlledValue as T) : internalValue;

    // Keep the latest resolved value in a ref so `setValue` can support
    // updater functions without needing `value` as a dependency (which
    // would otherwise recreate the callback, and any memoized consumer of
    // it, on every state change).
    const valueRef = useRef(value);
    valueRef.current = value;

    const setValue = useCallback(
        (updater: ControllableUpdater<T>) => {
            const next =
                typeof updater === "function"
                    ? (updater as (old: T) => T)(valueRef.current)
                    : updater;

            if (!isControlled) {
                setInternalValue(next);
            }
            onChange?.(next);
        },
        [isControlled, onChange],
    );

    return [value, setValue];
}
