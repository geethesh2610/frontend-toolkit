/*
 * Example consumer for TodoContext — copy this alongside TodoContext.tsx as
 * a starting point for your own feature component, or delete it once you've
 * seen how the hooks are meant to be used.
 */

import { useState, type FormEvent } from "react";

import { TodoProvider } from "./TodoContext";
import {
    AddButton,
    ClearButton,
    Footer,
    Form,
    Input,
    List,
    ListItem,
    RemainingCount,
    RemoveButton,
    TodoLabel,
    TodoText,
    Wrapper,
} from "./TodoList.style";
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
        <Wrapper>
            <Form onSubmit={handleSubmit}>
                <Input
                    value={text}
                    onChange={(event) => setText(event.target.value)}
                    placeholder="Add a todo"
                />
                <AddButton type="submit">Add</AddButton>
            </Form>

            <List>
                {todos.map((todo) => (
                    <ListItem key={todo.id}>
                        <TodoLabel>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => toggleTodo(todo.id)}
                            />
                            <TodoText $completed={todo.completed}>{todo.text}</TodoText>
                        </TodoLabel>
                        <RemoveButton type="button" onClick={() => removeTodo(todo.id)}>
                            Remove
                        </RemoveButton>
                    </ListItem>
                ))}
            </List>

            <Footer>
                <RemainingCount>{remaining} remaining</RemainingCount>
                <ClearButton type="button" onClick={clearCompleted}>
                    Clear completed
                </ClearButton>
            </Footer>
        </Wrapper>
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
