import { useContext } from "react";

import { StoreContext } from "./todoStoreContext";
import type { TodoStore } from "./TodoStore";

export function useTodoStore(): TodoStore {
    const store = useContext(StoreContext);
    if (!store) {
        throw new Error("useTodoStore must be used within a <StoreProvider>.");
    }
    return store;
}
