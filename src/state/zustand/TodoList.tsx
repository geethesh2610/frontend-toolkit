/*
 * Example consumer for useTodoStore — copy this alongside useTodoStore.ts as
 * a starting point for your own feature component, or delete it once you've
 * seen how the hook is meant to be used.
 */

import { useState, type FormEvent } from "react";

import { selectRemainingCount, useTodoStore } from "./useTodoStore";

export function TodoList() {
    const todos = useTodoStore((state) => state.todos);
    const remaining = useTodoStore(selectRemainingCount);
    const addTodo = useTodoStore((state) => state.addTodo);
    const toggleTodo = useTodoStore((state) => state.toggleTodo);
    const removeTodo = useTodoStore((state) => state.removeTodo);
    const clearCompleted = useTodoStore((state) => state.clearCompleted);
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
