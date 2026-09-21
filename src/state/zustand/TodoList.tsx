/*
 * Example consumer for useTodoStore — copy this alongside useTodoStore.ts as
 * a starting point for your own feature component, or delete it once you've
 * seen how the hook is meant to be used.
 */

import { useState, type FormEvent } from "react";

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
