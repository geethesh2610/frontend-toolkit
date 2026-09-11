/*
 * ============================================================================
 * useTodoStore — Zustand state management template
 * ============================================================================
 *
 * No provider needed — the store is a module-level hook. `devtools` wires it
 * into the Redux DevTools browser extension (action names as the 3rd `set`
 * argument); it's a no-op if the extension isn't installed, so it's safe to
 * leave in. Remove the `devtools(...)` wrapper if you don't want it.
 *
 * To copy this into a new project: rename `Todo`/`todos`, adjust the actions,
 * keep the `create<T>()(...)` currying (required for middleware to infer
 * types correctly) and the selector-per-hook-call convention below.
 *
 * Usage:
 *
 * const todos = useTodoStore((state) => state.todos)
 * const addTodo = useTodoStore((state) => state.addTodo)
 *
 * Always select the narrowest slice you need (`state => state.todos`, not
 * the whole store) — components only re-render when their selected slice
 * changes.
 *
 * ============================================================================
 */

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { Todo } from "../todo.types";

interface TodoStore {
    todos: Todo[];
    addTodo: (text: string) => void;
    toggleTodo: (id: string) => void;
    removeTodo: (id: string) => void;
    clearCompleted: () => void;
}

export const useTodoStore = create<TodoStore>()(
    devtools(
        (set) => ({
            todos: [],

            addTodo: (text) =>
                set(
                    (state) => ({
                        todos: [...state.todos, { id: crypto.randomUUID(), text, completed: false }],
                    }),
                    false,
                    "todos/add",
                ),

            toggleTodo: (id) =>
                set(
                    (state) => ({
                        todos: state.todos.map((todo) =>
                            todo.id === id ? { ...todo, completed: !todo.completed } : todo,
                        ),
                    }),
                    false,
                    "todos/toggle",
                ),

            removeTodo: (id) =>
                set(
                    (state) => ({ todos: state.todos.filter((todo) => todo.id !== id) }),
                    false,
                    "todos/remove",
                ),

            clearCompleted: () =>
                set(
                    (state) => ({ todos: state.todos.filter((todo) => !todo.completed) }),
                    false,
                    "todos/clearCompleted",
                ),
        }),
        { name: "TodoStore" },
    ),
);

/** Derived state as a plain selector — recomputed on read, not stored. */
export const selectRemainingCount = (state: TodoStore): number =>
    state.todos.filter((todo) => !todo.completed).length;
