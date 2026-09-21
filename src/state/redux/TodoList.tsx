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
                                onChange={() => dispatch(toggle(todo.id))}
                            />
                            <TodoText $completed={todo.completed}>{todo.text}</TodoText>
                        </TodoLabel>
                        <RemoveButton type="button" onClick={() => dispatch(remove(todo.id))}>
                            Remove
                        </RemoveButton>
                    </ListItem>
                ))}
            </List>

            <Footer>
                <RemainingCount>{remaining} remaining</RemainingCount>
                <ClearButton type="button" onClick={() => dispatch(clearCompleted())}>
                    Clear completed
                </ClearButton>
            </Footer>
        </Wrapper>
    );
}

export function TodoList() {
    return (
        <Provider store={store}>
            <TodoListInner />
        </Provider>
    );
}
