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
                {store.todos.map((todo) => (
                    <ListItem key={todo.id}>
                        <TodoLabel>
                            <input
                                type="checkbox"
                                checked={todo.completed}
                                onChange={() => store.toggleTodo(todo.id)}
                            />
                            <TodoText $completed={todo.completed}>{todo.text}</TodoText>
                        </TodoLabel>
                        <RemoveButton type="button" onClick={() => store.removeTodo(todo.id)}>
                            Remove
                        </RemoveButton>
                    </ListItem>
                ))}
            </List>

            <Footer>
                <RemainingCount>{store.remainingCount} remaining</RemainingCount>
                <ClearButton type="button" onClick={() => store.clearCompleted()}>
                    Clear completed
                </ClearButton>
            </Footer>
        </Wrapper>
    );
});

export function TodoList() {
    return (
        <StoreProvider>
            <TodoListInner />
        </StoreProvider>
    );
}
