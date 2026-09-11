import type { Dispatch } from "react";

import type { Todo } from "../todo.types";
import { createSafeContext } from "./createSafeContext";

export interface TodoState {
    todos: Todo[];
}

export type TodoAction =
    | { type: "add"; text: string }
    | { type: "toggle"; id: string }
    | { type: "remove"; id: string }
    | { type: "clearCompleted" };

export function todoReducer(state: TodoState, action: TodoAction): TodoState {
    switch (action.type) {
        case "add":
            return {
                todos: [
                    ...state.todos,
                    { id: crypto.randomUUID(), text: action.text, completed: false },
                ],
            };
        case "toggle":
            return {
                todos: state.todos.map((todo) =>
                    todo.id === action.id ? { ...todo, completed: !todo.completed } : todo,
                ),
            };
        case "remove":
            return { todos: state.todos.filter((todo) => todo.id !== action.id) };
        case "clearCompleted":
            return { todos: state.todos.filter((todo) => !todo.completed) };
    }
}

export const [TodoStateContext, useTodoStateContext] =
    createSafeContext<TodoState>("TodoState");
export const [TodoDispatchContext, useTodoDispatchContext] =
    createSafeContext<Dispatch<TodoAction>>("TodoDispatch");
