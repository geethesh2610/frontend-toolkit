/*
 * Styled-components for TodoList.tsx. Kept in this folder (not shared across
 * state/context, state/zustand, state/redux, state/mobx) on purpose — each
 * state/* folder is meant to be copy-pasted as a standalone starter kit, so
 * this file travels with it instead of creating a cross-folder dependency.
 */

import styled from 'styled-components'

export const Wrapper = styled.div`
    font-family: system-ui, sans-serif;
    font-size: 14px;
`

export const Form = styled.form`
    display: flex;
    gap: 8px;
    margin-bottom: 12px;
`

export const Input = styled.input`
    flex: 1;
    min-width: 0;
    padding: 6px 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    font: inherit;
`

export const AddButton = styled.button`
    padding: 6px 12px;
    border: none;
    border-radius: 6px;
    background: #2563eb;
    color: #ffffff;
    font-weight: 500;
    cursor: pointer;

    &:hover {
        background: #1d4ed8;
    }
`

export const List = styled.ul`
    list-style: none;
    margin: 0 0 12px;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 4px;
`

export const ListItem = styled.li`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    padding: 6px 8px;
    border: 1px solid #e2e8f0;
    border-radius: 6px;
    background: #ffffff;
`

export const TodoLabel = styled.label`
    display: flex;
    align-items: center;
    gap: 8px;
    cursor: pointer;
`

export const TodoText = styled.span<{ $completed: boolean }>`
    text-decoration: ${({ $completed }) => ($completed ? 'line-through' : 'none')};
    color: ${({ $completed }) => ($completed ? '#94a3b8' : 'inherit')};
`

export const RemoveButton = styled.button`
    border: none;
    background: none;
    color: #ef4444;
    cursor: pointer;
    font-size: 12px;

    &:hover {
        text-decoration: underline;
    }
`

export const Footer = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
`

export const RemainingCount = styled.p`
    margin: 0;
    color: #475569;
`

export const ClearButton = styled.button`
    padding: 4px 10px;
    border: 1px solid #cbd5e1;
    border-radius: 6px;
    background: #ffffff;
    cursor: pointer;

    &:hover {
        background: #f1f5f9;
    }
`
