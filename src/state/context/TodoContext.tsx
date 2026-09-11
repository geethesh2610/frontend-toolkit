/*
 * ============================================================================
 * TodoContext — Context + useReducer state management template
 * ============================================================================
 *
 * The pattern: a reducer holds state; state and dispatch live in TWO
 * separate contexts (see todoState.ts). That split matters — a component
 * that only reads `useTodoActions()` (useTodo.ts) never re-renders when
 * `todos` changes, because `dispatch` from `useReducer` is referentially
 * stable and the dispatch context's value never changes. Bundling both into
 * one context/value would re-render every consumer on every state change.
 *
 * This file only exports the provider component — the consumer hooks live
 * in useTodo.ts (kept separate so React Fast Refresh can hot-reload both
 * independently; a file mixing component + hook exports opts out of it).
 *
 * To copy this into a new project: rename `Todo`/`todos` (in todo.types.ts
 * and todoState.ts) to your domain, adjust `TodoAction`/`todoReducer`, keep
 * the state/dispatch split and the `createSafeContext` plumbing as-is.
 *
 * Usage:
 *
 * <TodoProvider>
 *   <TodoList />
 * </TodoProvider>
 *
 * ============================================================================
 */

import { useReducer, type ReactNode } from "react";

import { TodoDispatchContext, TodoStateContext, todoReducer } from "./todoState";

export function TodoProvider({ children }: { children: ReactNode }) {
    const [state, dispatch] = useReducer(todoReducer, { todos: [] });

    return (
        <TodoStateContext.Provider value={state}>
            <TodoDispatchContext.Provider value={dispatch}>
                {children}
            </TodoDispatchContext.Provider>
        </TodoStateContext.Provider>
    );
}
