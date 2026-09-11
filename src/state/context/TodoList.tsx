/*
 * Example consumer for TodoContext — copy this alongside TodoContext.tsx as
 * a starting point for your own feature component, or delete it once you've
 * seen how the hooks are meant to be used.
 */

import { useState, type FormEvent } from "react";

import { TodoProvider } from "./TodoContext";
import { useRemainingCount, useTodoActions, useTodos } from "./useTodo";

function TodoListInner() {
    const todos = useTodos();
    const remaining = useRemainingCount();
    const { addTodo, toggleTodo, removeTodo, clearCompleted } = useTodoActions();
    const [text, setText] = useState("");

    const handleSubmit = (event: FormEvent) => {
        event.preventDefault();
        const trimmed = text.trim();
        if (!trimmed) return;
        addTodo(trimmed);
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
                                onChange={() => toggleTodo(todo.id)}
                            />
                            <span style={{ textDecoration: todo.completed ? "line-through" : undefined }}>
                                {todo.text}
                            </span>
                        </label>
                        <button type="button" onClick={() => removeTodo(todo.id)}>
                            Remove
                        </button>
                    </li>
                ))}
            </ul>

            <p>{remaining} remaining</p>
            <button type="button" onClick={clearCompleted}>
                Clear completed
            </button>
        </div>
    );
}

/** The provider lives here for a self-contained example — in a real app, mount `TodoProvider` once higher up the tree instead of per-feature. */
export function TodoList() {
    return (
        <TodoProvider>
            <TodoListInner />
        </TodoProvider>
    );
}
