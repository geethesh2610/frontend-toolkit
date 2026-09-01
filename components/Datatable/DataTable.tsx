import {
  getCoreRowModel,
  getExpandedRowModel,
  getFacetedMinMaxValues,
  getFacetedRowModel,
  getFacetedUniqueValues,
  getFilteredRowModel,
  getGroupedRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from '@tanstack/react-table'
import { useMemo } from 'react'
import type { DataTableProps } from './DataTable.types'
import { useDataTableState } from './DataTable.state'
import { getDefaultFilterFn } from './DataTable.filters'
import { getMode, getSearchConfig, isEnabled } from './DataTable.utils'
import { useDataTableVirtualizer } from './DataTable.virtualization'
import { DataTableToolbar } from './DataTable.Toolbar'
import { DataTablePagination } from './DataTable.Pagination'
import { DataTableHeader } from './DataTable.Header'
import { DataTableBody } from './DataTable.Body'
import {
  DataTableEmpty,
  DataTableError,
  DataTableLoading,
  DataTableNoResults,
  DataTableRefetching,
  DataTableSkeleton,
} from './DataTable.States'

export function DataTable<TData>({
  data,
  columns,
  config,
  initialState,
  loading = false,
  refetching = false,
  error,
  getRowId,
  onRowClick,
  renderers,
  stickyHeader = false,
  className,
  tableClassName,
  emptyHeight = 160,
  style,
}: DataTableProps<TData>) {
  const state = useDataTableState(config, initialState)

  const sortingEnabled = isEnabled(config?.sorting)
  const filteringEnabled = isEnabled(config?.filtering)
  const searchConfig = getSearchConfig(config)
  const searchEnabled = Boolean(searchConfig)
  const paginationEnabled = isEnabled(config?.pagination)
  const selectionEnabled = isEnabled(config?.rowSelection)
  const visibilityEnabled = isEnabled(config?.columnVisibility)
  const orderingEnabled = isEnabled(config?.columnOrdering)
  const sizingEnabled = isEnabled(config?.columnSizing)
  const pinningEnabled = isEnabled(config?.columnPinning)
  const groupingEnabled = isEnabled(config?.grouping)
  const expansionEnabled = isEnabled(config?.expansion)

  const serverSorting = getMode(config?.sorting) === 'server'
  const serverFiltering = getMode(config?.filtering) === 'server'
  const serverSearch = getMode(searchConfig) === 'server'
  const serverPagination = getMode(config?.pagination) === 'server'

  const normalizedColumns = useMemo(
    () =>
      columns.map((column) => {
        const meta = column.meta
        const filterType = meta?.filter?.type

        return {
          ...column,
          filterFn:
            column.filterFn ??
            getDefaultFilterFn(filterType),
        }
      }),
    [columns],
  )

  const table = useReactTable({
    data,
    columns: normalizedColumns,

    state: {
      sorting: state.sorting[0],
      globalFilter: state.globalFilter[0],
      columnFilters: state.columnFilters[0],
      pagination: state.pagination[0],
      columnVisibility: state.columnVisibility[0],
      columnOrder: state.columnOrder[0],
      columnSizing: state.columnSizing[0],
      columnPinning: state.columnPinning[0],
      rowSelection: state.rowSelection[0],
      grouping: state.grouping[0],
      expanded: state.expanded[0],
    },

    onSortingChange: state.sorting[1],
    onGlobalFilterChange: state.globalFilter[1],
    onColumnFiltersChange: state.columnFilters[1],
    onPaginationChange: state.pagination[1],
    onColumnVisibilityChange: state.columnVisibility[1],
    onColumnOrderChange: state.columnOrder[1],
    onColumnSizingChange: state.columnSizing[1],
    onColumnPinningChange: state.columnPinning[1],
    onRowSelectionChange: state.rowSelection[1],
    onGroupingChange: state.grouping[1],
    onExpandedChange: state.expanded[1],

    getRowId,

    enableSorting: sortingEnabled,
    enableMultiSort:
      typeof config?.sorting === 'object'
        ? config.sorting.enableMultiSort ?? true
        : true,
    maxMultiSortColCount:
      typeof config?.sorting === 'object'
        ? config.sorting.maxMultiSortColCount
        : undefined,

    enableFilters: filteringEnabled,
    enableHiding: visibilityEnabled,
    enableColumnOrdering: orderingEnabled,
    enableColumnResizing: sizingEnabled,
    columnResizeMode:
      typeof config?.columnSizing === 'object'
        ? config.columnSizing.mode ?? 'onChange'
        : 'onChange',
    enableColumnPinning: pinningEnabled,
    enableGrouping: groupingEnabled,
    enableExpanding: expansionEnabled,

    enableRowSelection: selectionEnabled
      ? typeof config?.rowSelection === 'object' &&
        config.rowSelection.enableRowSelection !== undefined
        ? config.rowSelection.enableRowSelection
        : true
      : false,

    enableMultiRowSelection:
      typeof config?.rowSelection === 'object'
        ? config.rowSelection.mode !== 'single'
        : true,

    manualSorting: serverSorting,
    manualFiltering: serverFiltering || serverSearch,
    manualPagination: serverPagination,

    rowCount:
      serverPagination && typeof config?.pagination === 'object'
        ? config.pagination.rowCount
        : undefined,

    pageCount:
      serverPagination && typeof config?.pagination === 'object'
        ? config.pagination.pageCount
        : undefined,

    autoResetPageIndex: !serverPagination,

    getCoreRowModel: getCoreRowModel(),

    ...(sortingEnabled && !serverSorting
      ? { getSortedRowModel: getSortedRowModel() }
      : {}),

    ...(filteringEnabled || searchEnabled
      ? {
          getFilteredRowModel:
            !serverFiltering && !serverSearch
              ? getFilteredRowModel()
              : undefined,
          getFacetedRowModel: getFacetedRowModel(),
          getFacetedUniqueValues: getFacetedUniqueValues(),
          getFacetedMinMaxValues: getFacetedMinMaxValues(),
        }
      : {}),

    ...(paginationEnabled && !serverPagination
      ? { getPaginationRowModel: getPaginationRowModel() }
      : {}),

    ...(groupingEnabled
      ? { getGroupedRowModel: getGroupedRowModel() }
      : {}),

    ...(expansionEnabled
      ? { getExpandedRowModel: getExpandedRowModel() }
      : {}),

    ...(expansionEnabled &&
    typeof config?.expansion === 'object' &&
    config.expansion.getRowCanExpand
      ? { getRowCanExpand: config.expansion.getRowCanExpand }
      : {}),
  })

  const virtualizationConfig = config?.virtualization
  const virtualized =
    virtualizationConfig === true ||
    (typeof virtualizationConfig === 'object' &&
      virtualizationConfig.enabled !== false)

  const rows = table.getRowModel().rows

  const estimateRowHeight =
    typeof virtualizationConfig === 'object'
      ? virtualizationConfig.estimateRowHeight ?? 40
      : 40

  const overscan =
    typeof virtualizationConfig === 'object'
      ? virtualizationConfig.overscan ?? 8
      : 8

  const { scrollRef, virtualizer } = useDataTableVirtualizer(
    rows.length,
    virtualized,
    estimateRowHeight,
    overscan,
  )

  const virtualItems = virtualized
    ? virtualizer.getVirtualItems().map((item) => ({
        index: item.index,
        start: item.start,
        key: String(item.key),
      }))
    : []

  const stateView = useMemo(() => {
    if (error) {
      return renderers?.error ?? <DataTableError />
    }

    if (loading) {
      return (
        renderers?.skeleton ?? (
          <DataTableSkeleton
            rows={5}
            columns={Math.min(columns.length, 6)}
          />
        )
      )
    }

    if (data.length === 0) {
      return renderers?.empty ?? <DataTableEmpty />
    }

    if (rows.length === 0) {
      return renderers?.noResults ?? <DataTableNoResults />
    }

    return null
  }, [
    error,
    loading,
    data.length,
    rows.length,
    columns.length,
    renderers,
  ])

  if (stateView) {
    return (
      <section
        className={className}
        style={style}
        aria-busy={loading}
      >
        <DataTableToolbar
          table={table}
          config={config}
          renderers={renderers}
        />

        <div style={{ minHeight: emptyHeight }}>
          {stateView}
        </div>
      </section>
    )
  }

  const virtualHeight =
    typeof virtualizationConfig === 'object'
      ? virtualizationConfig.height ?? 480
      : 480

  return (
    <section
      className={className}
      style={style}
      aria-busy={loading}
    >
      {renderers?.toolbar?.({ table })}

      {!renderers?.toolbar && (
        <DataTableToolbar
          table={table}
          config={config}
          renderers={renderers}
        />
      )}

      {refetching &&
        (renderers?.refetching ?? <DataTableRefetching />)}

      <div
        ref={scrollRef}
        style={
          virtualized
            ? {
                height: virtualHeight,
                overflow: 'auto',
              }
            : {
                overflowX: 'auto',
              }
        }
      >
        <table className={tableClassName}>
          <DataTableHeader
            table={table}
            selectionEnabled={selectionEnabled}
            sizingEnabled={sizingEnabled}
            pinningEnabled={pinningEnabled}
            stickyHeader={stickyHeader}
          />

          <DataTableBody
            table={table}
            rows={rows}
            virtualized={virtualized}
            virtualItems={virtualItems}
            selectionEnabled={selectionEnabled}
            pinningEnabled={pinningEnabled}
            expansionEnabled={expansionEnabled}
            renderExpandedRow={
              renderers?.expandedRow ??
              (typeof config?.expansion === 'object'
                ? config.expansion.renderExpandedRow
                : undefined)
            }
            onRowClick={onRowClick}
          />
        </table>
      </div>

      {paginationEnabled &&
        (renderers?.pagination?.({
          table,
          config: config?.pagination ?? true,
        }) ?? (
          <DataTablePagination
            table={table}
            config={config?.pagination ?? true}
          />
        ))}
    </section>
  )
}
