/*
 * Consumer-facing hooks for TodoContext.tsx's provider. Split into their own
 * file (rather than living alongside `TodoProvider`) so this file can export
 * only hooks and stay Fast-Refresh-friendly.
 *
 * Usage:
 *
 * const todos = useTodos()
 * const remaining = useRemainingCount()
 * const { addTodo, toggleTodo, removeTodo, clearCompleted } = useTodoActions()
 */

import { useMemo } from "react";

import type { Todo } from "../todo.types";
import { useTodoDispatchContext, useTodoStateContext } from "./todoState";

export function useTodos(): Todo[] {
    return useTodoStateContext().todos;
}

/** Derived state, recomputed only when `todos` actually changes. */
export function useRemainingCount(): number {
    const todos = useTodoStateContext().todos;
    return useMemo(() => todos.filter((todo) => !todo.completed).length, [todos]);
}

export function useTodoActions() {
    const dispatch = useTodoDispatchContext();

    return useMemo(
        () => ({
            addTodo: (text: string) => dispatch({ type: "add", text }),
            toggleTodo: (id: string) => dispatch({ type: "toggle", id }),
            removeTodo: (id: string) => dispatch({ type: "remove", id }),
            clearCompleted: () => dispatch({ type: "clearCompleted" }),
        }),
        [dispatch],
    );
}
