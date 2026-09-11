/*
 * Example consumer for the todos slice — copy this alongside
 * todosSlice.ts/store.ts/hooks.ts as a starting point for your own feature
 * component, or delete it once you've seen how the pieces fit together.
 *
 * The `<Provider>` lives here for a self-contained example — in a real app,
 * mount it once at your app root (wrapping <App />), not per-feature.
 */

import { useState, type FormEvent } from "react";
import { Provider } from "react-redux";

import { useAppDispatch, useAppSelector } from "./hooks";
import { store } from "./store";
import { selectRemainingCount, selectTodos } from "./todosSelectors";
import { add, clearCompleted, remove, toggle } from "./todosSlice";

function TodoListInner() {
    const todos = useAppSelector(selectTodos);
    const remaining = useAppSelector(selectRemainingCount);
    const dispatch = useAppDispatch();
    const [text, setText] = useState("");

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        dispatch(add(trimmed));
        setText("");
    };

    return (
        <div>
            <form onSubmit={handleSubmit}>
                <input
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Add a todo"
                />
                <button type="submit">Add</button>
            </form>

            <ul>
                {todos.map((todo) => (
                    <li key={todo.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => dispatch(toggle(todo.id))}
                            />
                            <span style={{ textDecoration: todo.completed ? "line-through" : undefined }}>
                                {todo.text}
                            </span>
                        </label>
                        <button type="button" onClick={() => dispatch(remove(todo.id))}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            <p>{remaining} remaining</p>
            <button type="button" onClick={() => dispatch(clearCompleted())}>
                Clear completed
            </button>
        </div>
    );
}

export function TodoList() {
    return (
        <Provider store={store}>
            <TodoListInner />
        </Provider>
    );
}
