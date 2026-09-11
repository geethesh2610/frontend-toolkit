/*
 * Typed replacements for react-redux's plain `useDispatch`/`useSelector` —
 * use these two everywhere instead of the untyped originals so `dispatch`
 * and selector state are inferred instead of `any`.
 */

import { useDispatch, useSelector, type TypedUseSelectorHook } from "react-redux";

import type { AppDispatch, RootState } from "./store";

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
