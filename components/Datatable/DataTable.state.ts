import { useCallback, useEffect, useRef, useState } from 'react'
import type { Updater } from '@tanstack/react-table'
import type {
  DataTableChangeHandler,
  DataTableConfig,
  DataTableInitialState,
} from './DataTable.types'

function resolveUpdater<T>(updater: Updater<T>, previous: T): T {
  return typeof updater === 'function'
    ? (updater as (previous: T) => T)(previous)
    : updater
}

export function useControllableState<T>(
  controlled: T | undefined,
  initial: T,
  onChange?: DataTableChangeHandler<T>,
) {
  const [internal, setInternal] = useState(initial)
  const value = controlled === undefined ? internal : controlled

  const setValue = useCallback(
    (updater: Updater<T>) => {
      if (controlled === undefined) {
        setInternal((previous) => resolveUpdater(updater, previous))
      }
      onChange?.(updater)
    },
    [controlled, onChange],
  )

  return [value, setValue] as const
}

export function useDataTableState<TData>(
  config: DataTableConfig<TData> | undefined,
  initial: DataTableInitialState | undefined,
) {
  const sortingConfig = typeof config?.sorting === 'object' ? config.sorting : undefined
  const searchConfig = typeof config?.search === 'object' ? config.search : undefined
  const filteringConfig = typeof config?.filtering === 'object' ? config.filtering : undefined
  const paginationConfig = typeof config?.pagination === 'object' ? config.pagination : undefined
  const selectionConfig = typeof config?.rowSelection === 'object' ? config.rowSelection : undefined
  const visibilityConfig = typeof config?.columnVisibility === 'object' ? config.columnVisibility : undefined
  const orderingConfig = typeof config?.columnOrdering === 'object' ? config.columnOrdering : undefined
  const sizingConfig = typeof config?.columnSizing === 'object' ? config.columnSizing : undefined
  const pinningConfig = typeof config?.columnPinning === 'object' ? config.columnPinning : undefined
  const groupingConfig = typeof config?.grouping === 'object' ? config.grouping : undefined
  const expansionConfig = typeof config?.expansion === 'object' ? config.expansion : undefined

  return {
    sorting: useControllableState(
      sortingConfig?.state,
      sortingConfig?.initialState ?? initial?.sorting ?? [],
      sortingConfig?.onChange,
    ),

    globalFilter: useControllableState(
      searchConfig?.state,
      searchConfig?.initialState ?? initial?.globalFilter ?? '',
      searchConfig?.onChange,
    ),

    columnFilters: useControllableState(
      filteringConfig?.state,
      filteringConfig?.initialState ?? initial?.columnFilters ?? [],
      filteringConfig?.onChange,
    ),

    pagination: useControllableState(
      paginationConfig?.state,
      paginationConfig?.initialState ?? initial?.pagination ?? {
        pageIndex: 0,
        pageSize: 10,
      },
      paginationConfig?.onChange,
    ),

    columnVisibility: useControllableState(
      visibilityConfig?.state,
      visibilityConfig?.initialState ?? initial?.columnVisibility ?? {},
      visibilityConfig?.onChange,
    ),

    columnOrder: useControllableState(
      orderingConfig?.state,
      orderingConfig?.initialState ?? initial?.columnOrder ?? [],
      orderingConfig?.onChange,
    ),

    columnSizing: useControllableState(
      sizingConfig?.state,
      sizingConfig?.initialState ?? initial?.columnSizing ?? {},
      sizingConfig?.onChange,
    ),

    columnPinning: useControllableState(
      pinningConfig?.state,
      pinningConfig?.initialState ?? initial?.columnPinning ?? {
        left: [],
        right: [],
      },
      pinningConfig?.onChange,
    ),

    rowSelection: useControllableState(
      selectionConfig?.state,
      selectionConfig?.initialState ?? initial?.rowSelection ?? {},
      selectionConfig?.onChange,
    ),

    grouping: useControllableState(
      groupingConfig?.state,
      groupingConfig?.initialState ?? initial?.grouping ?? [],
      groupingConfig?.onChange,
    ),

    expanded: useControllableState(
      expansionConfig?.state,
      expansionConfig?.initialState ?? initial?.expanded ?? {},
      expansionConfig?.onChange,
    ),
  }
}

export function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value)
  const latest = useRef(value)

  useEffect(() => {
    latest.current = value
    const timer = window.setTimeout(() => {
      if (latest.current === value) setDebounced(value)
    }, Math.max(0, delay))

    return () => window.clearTimeout(timer)
  }, [value, delay])

  return debounced
}
