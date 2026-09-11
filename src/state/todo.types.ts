/**
 * Shared across every state-management template in this folder (context/,
 * zustand/, redux/, mobx/) so the four are a direct, side-by-side comparison
 * of the same domain rather than four unrelated examples.
 */
export interface Todo {
    id: string;
    text: string;
    completed: boolean;
}
