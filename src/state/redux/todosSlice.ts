/*
 * ============================================================================
 * todosSlice — Redux Toolkit state management template
 * ============================================================================
 *
 * `createSlice` uses Immer under the hood, so reducers can "mutate" `state`
 * directly (`state.items.push(...)`) — Immer produces the actual immutable
 * update. Don't reach for spread/`.map()` immutability tricks here; that's a
 * v8-style Redux habit that Immer already handles for you.
 *
 * To copy this into a new project: rename `Todo`/`todos`, adjust the
 * reducers, register the slice's reducer in store.ts under its own key.
 * ============================================================================
 */

import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

import type { Todo } from "../todo.types";

interface TodosState {
    items: Todo[];
}

const initialState: TodosState = {
    items: [],
};

const todosSlice = createSlice({
    name: "todos",
    initialState,
    reducers: {
        add: (state, action: PayloadAction<string>) => {
            state.items.push({ id: crypto.randomUUID(), text: action.payload, completed: false });
        },
        toggle: (state, action: PayloadAction<string>) => {
            const todo = state.items.find((item) => item.id === action.payload);
            if (todo) {
                todo.completed = !todo.completed;
            }
        },
        remove: (state, action: PayloadAction<string>) => {
            state.items = state.items.filter((item) => item.id !== action.payload);
        },
        clearCompleted: (state) => {
            state.items = state.items.filter((item) => !item.completed);
        },
    },
});

export const { add, toggle, remove, clearCompleted } = todosSlice.actions;
export default todosSlice.reducer;
