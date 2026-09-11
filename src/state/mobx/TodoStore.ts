/*
 * ============================================================================
 * TodoStore — MobX state management template
 * ============================================================================
 *
 * `makeAutoObservable(this)` in the constructor makes every field an
 * observable, every method an action, and every getter a computed value —
 * no manual `@observable`/`@action` decorators needed. Mutate fields
 * directly (`this.todos.push(...)`); that's the point of MobX, unlike
 * Redux's "never mutate state" rule.
 *
 * To copy this into a new project: rename `Todo`/`todos`, adjust the
 * methods/getters, keep instantiating it through StoreContext.tsx rather
 * than as a bare module-level singleton (a context-provided instance can be
 * reset per test / per root, a singleton can't).
 * ============================================================================
 */

import { makeAutoObservable } from "mobx";

import type { Todo } from "../todo.types";

export class TodoStore {
    todos: Todo[] = [];

    constructor() {
        makeAutoObservable(this);
    }

    get remainingCount(): number {
        return this.todos.filter((todo) => !todo.completed).length;
    }

    addTodo(text: string): void {
        this.todos.push({ id: crypto.randomUUID(), text, completed: false });
    }

    toggleTodo(id: string): void {
        const todo = this.todos.find((item) => item.id === id);
        if (todo) {
            todo.completed = !todo.completed;
        }
    }

    removeTodo(id: string): void {
        this.todos = this.todos.filter((item) => item.id !== id);
    }

    clearCompleted(): void {
        this.todos = this.todos.filter((item) => !item.completed);
    }
}
