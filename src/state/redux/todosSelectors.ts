import { createSelector } from "@reduxjs/toolkit";

import type { RootState } from "./store";

export const selectTodos = (state: RootState) => state.todos.items;

/** Memoized — only recomputes when `selectTodos`'s result actually changes. */
export const selectRemainingCount = createSelector(
    selectTodos,
    (todos) => todos.filter((todo) => !todo.completed).length,
);
