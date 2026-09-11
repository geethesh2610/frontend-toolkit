/*
 * To copy this into a new project: add each new slice's reducer under its
 * own key here as your app grows — one store, many slices, not one store
 * per feature.
 */

import { configureStore } from "@reduxjs/toolkit";

import todosReducer from "./todosSlice";

export const store = configureStore({
    reducer: {
        todos: todosReducer,
    },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
