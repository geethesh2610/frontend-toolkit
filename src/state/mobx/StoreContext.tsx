/*
 * MobX has no built-in React binding for "where does the store instance
 * live" — Context is the standard way to provide one. One instance per
 * `<StoreProvider>` mount, created once via `useState(() => new TodoStore())`
 * so remounts (or multiple roots, e.g. in tests) don't share state.
 *
 * The context object lives in storeContext.ts and the consumer hook in
 * useTodoStore.ts, kept separate so this file can export only the provider
 * component and stay Fast-Refresh-friendly.
 */

import { useState, type ReactNode } from "react";

import { StoreContext } from "./todoStoreContext";
import { TodoStore } from "./TodoStore";

export function StoreProvider({ children }: { children: ReactNode }) {
    const [store] = useState(() => new TodoStore());
    return <StoreContext.Provider value={store}>{children}</StoreContext.Provider>;
}
