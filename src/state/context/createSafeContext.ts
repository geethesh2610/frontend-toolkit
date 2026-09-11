/*
 * ============================================================================
 * createSafeContext
 * ============================================================================
 *
 * A `createContext` + `useContext` pair that throws a clear error instead of
 * silently returning `undefined` when a consumer forgets its provider. This
 * is the one genuinely reusable piece here — copy it as-is into any project,
 * for any context, not just the Todo example next to it.
 *
 * Usage:
 *
 * const [CounterContext, useCounter] = createSafeContext<number>('Counter')
 *
 * function App() {
 *   return (
 *     <CounterContext.Provider value={5}>
 *       <Consumer />
 *     </CounterContext.Provider>
 *   )
 * }
 *
 * function Consumer() {
 *   const count = useCounter() // number, not number | undefined
 * }
 *
 * ============================================================================
 */

import { createContext, useContext, type Context } from "react";

export function createSafeContext<T>(
    displayName: string,
): [Context<T | undefined>, () => T] {
    const ContextInstance = createContext<T | undefined>(undefined);
    ContextInstance.displayName = displayName;

    function useSafeContext(): T {
        const value = useContext(ContextInstance);

        if (value === undefined) {
            throw new Error(
                `use${displayName} must be used within its matching <${displayName}Provider>.`,
            );
        }

        return value;
    }

    return [ContextInstance, useSafeContext];
}
