import type {
  ColumnDef,
  ColumnFiltersState,
  ColumnOrderState,
  ColumnPinningState,
  ColumnSizingState,
  ExpandedState,
  GroupingState,
  PaginationState,
  Row,
  RowSelectionState,
  SortingState,
  Table,
  Updater,
  VisibilityState,
} from '@tanstack/react-table'
import type { CSSProperties, ReactNode } from 'react'

export type DataTableMode = 'client' | 'server'

export type DataTableFilterType =
  | 'text'
  | 'number'
  | 'date'
  | 'date-range'
  | 'select'
  | 'multi-select'
  | 'boolean'
  | 'custom'

export type DataTableFilterOption = {
  label: string
  value: string
}

export type DataTableFilterMeta = {
  type: DataTableFilterType
  options?: DataTableFilterOption[]
  placeholder?: string
}

export type DataTableColumnMeta = {
  filter?: DataTableFilterMeta
  align?: 'left' | 'center' | 'right'
  className?: string
  headerClassName?: string
}

export type DataTableColumnDef<TData> = ColumnDef<TData, unknown> & {
  meta?: DataTableColumnMeta
}

export type DataTableInitialState = {
  sorting?: SortingState
  globalFilter?: string
  columnFilters?: ColumnFiltersState
  pagination?: PaginationState
  columnVisibility?: VisibilityState
  columnOrder?: ColumnOrderState
  columnSizing?: ColumnSizingState
  columnPinning?: ColumnPinningState
  rowSelection?: RowSelectionState
  grouping?: GroupingState
  expanded?: ExpandedState
}

export type DataTableChangeHandler<T> = (updater: Updater<T>) => void

export type DataTableSortingConfig =
  | boolean
  | {
      mode?: DataTableMode
      state?: SortingState
      initialState?: SortingState
      onChange?: DataTableChangeHandler<SortingState>
      enableMultiSort?: boolean
      maxMultiSortColCount?: number
    }

export type DataTableSearchConfig =
  | boolean
  | {
      mode?: DataTableMode
      state?: string
      initialState?: string
      onChange?: DataTableChangeHandler<string>
      debounceMs?: number
      placeholder?: string
    }

export type DataTableFilteringConfig =
  | boolean
  | {
      mode?: DataTableMode
      state?: ColumnFiltersState
      initialState?: ColumnFiltersState
      onChange?: DataTableChangeHandler<ColumnFiltersState>
    }

export type DataTablePaginationConfig =
  | boolean
  | {
      mode?: DataTableMode
      state?: PaginationState
      initialState?: PaginationState
      onChange?: DataTableChangeHandler<PaginationState>
      rowCount?: number
      pageCount?: number
      pageSizeOptions?: number[]
    }

export type DataTableSelectionConfig =
  | boolean
  | {
      mode?: 'single' | 'multiple'
      state?: RowSelectionState
      initialState?: RowSelectionState
      onChange?: DataTableChangeHandler<RowSelectionState>
      enableRowSelection?: boolean | ((row: Row<unknown>) => boolean)
    }

export type DataTableVisibilityConfig =
  | boolean
  | {
      state?: VisibilityState
      initialState?: VisibilityState
      onChange?: DataTableChangeHandler<VisibilityState>
    }

export type DataTableOrderingConfig =
  | boolean
  | {
      state?: ColumnOrderState
      initialState?: ColumnOrderState
      onChange?: DataTableChangeHandler<ColumnOrderState>
    }

export type DataTableSizingConfig =
  | boolean
  | {
      state?: ColumnSizingState
      initialState?: ColumnSizingState
      onChange?: DataTableChangeHandler<ColumnSizingState>
      mode?: 'onChange' | 'onEnd'
    }

export type DataTablePinningConfig =
  | boolean
  | {
      state?: ColumnPinningState
      initialState?: ColumnPinningState
      onChange?: DataTableChangeHandler<ColumnPinningState>
    }

export type DataTableGroupingConfig =
  | boolean
  | {
      state?: GroupingState
      initialState?: GroupingState
      onChange?: DataTableChangeHandler<GroupingState>
    }

export type DataTableExpansionConfig<TData> =
  | boolean
  | {
      state?: ExpandedState
      initialState?: ExpandedState
      onChange?: DataTableChangeHandler<ExpandedState>
      getRowCanExpand?: (row: Row<TData>) => boolean
      renderExpandedRow?: (props: { row: Row<TData> }) => ReactNode
    }

export type DataTableVirtualizationConfig =
  | boolean
  | {
      enabled?: boolean
      estimateRowHeight?: number
      overscan?: number
      height?: number | string
    }

export type DataTableConfig<TData> = {
  search?: DataTableSearchConfig
  searchable?: boolean
  sorting?: DataTableSortingConfig
  filtering?: DataTableFilteringConfig
  pagination?: DataTablePaginationConfig
  rowSelection?: DataTableSelectionConfig
  columnVisibility?: DataTableVisibilityConfig
  columnOrdering?: DataTableOrderingConfig
  columnSizing?: DataTableSizingConfig
  columnPinning?: DataTablePinningConfig
  grouping?: DataTableGroupingConfig
  expansion?: DataTableExpansionConfig<TData>
  virtualization?: DataTableVirtualizationConfig
}

export type DataTableRenderers<TData> = {
  toolbar?: (props: { table: Table<TData> }) => ReactNode
  search?: (props: { table: Table<TData>; config: DataTableSearchConfig }) => ReactNode
  filters?: (props: { table: Table<TData> }) => ReactNode
  pagination?: (props: { table: Table<TData>; config: DataTablePaginationConfig }) => ReactNode
  columnVisibility?: (props: { table: Table<TData> }) => ReactNode
  loading?: ReactNode
  skeleton?: ReactNode
  refetching?: ReactNode
  empty?: ReactNode
  noResults?: ReactNode
  error?: ReactNode
  expandedRow?: (props: { row: Row<TData> }) => ReactNode
}

export type DataTableProps<TData> = {
  data: TData[]
  columns: DataTableColumnDef<TData>[]
  config?: DataTableConfig<TData>
  initialState?: DataTableInitialState

  loading?: boolean
  refetching?: boolean
  error?: unknown

  getRowId?: (originalRow: TData, index: number, parent?: Row<TData>) => string
  onRowClick?: (row: Row<TData>) => void

  renderers?: DataTableRenderers<TData>

  stickyHeader?: boolean
  className?: string
  tableClassName?: string
  emptyHeight?: number | string
  style?: CSSProperties
}
