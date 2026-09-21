/*
 * ============================================================================
 * store — Redux Toolkit state management template
 * ============================================================================
 *
 * SETUP — where these files go and how to wire them in
 * ----------------------------------------------------------------------------
 * 1. Copy this whole folder (store.ts, todosSlice.ts, todosSelectors.ts,
 *    hooks.ts) into your project, e.g. src/store/. Also copy ../todo.types.ts
 *    alongside it (or inline its one type in todosSlice.ts).
 * 2. Rename `Todo`/`todos` in todosSlice.ts/todosSelectors.ts to your domain.
 * 3. Already have a store? Don't copy this file — instead add
 *    `todosReducer` (renamed) under its own key in your existing
 *    `configureStore({ reducer: {...} })`. One store, many slices, not one
 *    store per feature.
 * 4. Wrap your app root with the store's provider — usually in main.tsx:
 *
 *      import { Provider } from 'react-redux'
 *      import { store } from './store/store'
 *
 *      <Provider store={store}>
 *        <App />
 *      </Provider>
 *
 * 5. Inside components, use the typed hooks from hooks.ts, not react-redux's
 *    raw useDispatch/useSelector:
 *
 *      const todos = useAppSelector(selectTodos)
 *      const dispatch = useAppDispatch()
 *      dispatch(add('buy milk'))
 * ============================================================================
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
