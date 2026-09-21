/*
 * ============================================================================
 * StoreContext — MobX state management template
 * ============================================================================
 *
 * MobX has no built-in React binding for "where does the store instance
 * live" — Context is the standard way to provide one. One instance per
 * `<StoreProvider>` mount, created once via `useState(() => new TodoStore())`
 * so remounts (or multiple roots, e.g. in tests) don't share state.
 *
 * The context object lives in todoStoreContext.ts and the consumer hook in
 * useTodoStore.ts, kept separate so this file can export only the provider
 * component and stay Fast-Refresh-friendly.
 *
 * SETUP — where these files go and how to wire them in
 * ----------------------------------------------------------------------------
 * 1. Copy this whole folder (TodoStore.ts, todoStoreContext.ts,
 *    StoreContext.tsx, useTodoStore.ts) into your project, e.g.
 *    src/state/todo/. Also copy ../todo.types.ts alongside it.
 * 2. Rename `Todo`/`todos` to your domain in TodoStore.ts — its fields,
 *    getters, and methods.
 * 3. Wrap whatever part of your component tree needs this store — usually
 *    your whole app, in main.tsx or App.tsx:
 *
 *      import { StoreProvider } from './state/todo/StoreContext'
 *
 *      <StoreProvider>
 *        <App />
 *      </StoreProvider>
 *
 * 4. Inside components, call useTodoStore() to get the instance, and wrap
 *    any component that reads observable state in observer() from
 *    mobx-react-lite — otherwise it won't re-render on changes:
 *
 *      import { observer } from 'mobx-react-lite'
 *
 *      export const TodoCount = observer(() => {
 *        const store = useTodoStore()
 *        return <span>{store.remainingCount} left</span>
 *      })
 * ============================================================================
 */

import { useState, type ReactNode } from "react";

import { StoreContext } from "./todoStoreContext";
import { TodoStore } from "./TodoStore";

export function StoreProvider({ children }: { children: ReactNode }) {
    const [store] = useState(() => new TodoStore());
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
