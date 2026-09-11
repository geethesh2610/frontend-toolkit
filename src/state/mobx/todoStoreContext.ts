import { createContext } from "react";

import type { TodoStore } from "./TodoStore";

export const StoreContext = createContext<TodoStore | undefined>(undefined);
