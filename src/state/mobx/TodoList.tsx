/*
 * Example consumer for TodoStore — copy this alongside TodoStore.ts and
 * StoreContext.tsx as a starting point for your own feature component, or
 * delete it once you've seen how the pieces fit together.
 *
 * `observer()` is required on any component that reads observable state —
 * without it, MobX has no way to know this component should re-render when
 * `store.todos` changes.
 */

import { useState, type FormEvent } from "react";
import { observer } from "mobx-react-lite";

import { StoreProvider } from "./StoreContext";
import { useTodoStore } from "./useTodoStore";

const TodoListInner = observer(function TodoListInner() {
    const store = useTodoStore();
    const [text, setText] = useState("");

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        store.addTodo(trimmed);
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
                {store.todos.map((todo) => (
                    <li key={todo.id}>
                        <label>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => store.toggleTodo(todo.id)}
                            />
                            <span style={{ textDecoration: todo.completed ? "line-through" : undefined }}>
                                {todo.text}
                            </span>
                        </label>
                        <button type="button" onClick={() => store.removeTodo(todo.id)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            <p>{store.remainingCount} remaining</p>
            <button type="button" onClick={() => store.clearCompleted()}>
                Clear completed
            </button>
        </div>
    );
});

export function TodoList() {
    return (
        <StoreProvider>
            <TodoListInner />
        </StoreProvider>
    );
}
