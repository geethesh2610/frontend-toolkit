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
 * SETUP — where these files go and how to wire them in
 * ----------------------------------------------------------------------------
 * 1. Copy this whole folder (createSafeContext.ts, todoState.ts,
 *    TodoContext.tsx, useTodo.ts) into your project, e.g. src/state/todo/.
 *    Also copy ../todo.types.ts alongside it (or inline its one type here).
 * 2. Rename `Todo`/`todos` to your domain in todo.types.ts and todoState.ts —
 *    the state shape, the action union, and todoReducer's cases.
 * 3. Wrap whatever part of your component tree needs this state with the
 *    provider — usually your whole app, in main.tsx or App.tsx:
 *
 *      import { TodoProvider } from './state/todo/TodoContext'
 *
 *      <TodoProvider>
 *        <App />
 *      </TodoProvider>
 *
 * 4. Anywhere *inside* that provider, call the hooks from useTodo.ts —
 *    NOT the raw context hooks from todoState.ts, those throw outside a
 *    provider on purpose (see createSafeContext.ts):
 *
 *      const todos = useTodos()
 *      const { addTodo, toggleTodo } = useTodoActions()
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
