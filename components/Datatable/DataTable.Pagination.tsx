import type { Table } from '@tanstack/react-table'
import type { DataTablePaginationConfig } from './DataTable.types'
import { getPageRange } from './DataTable.utils'

export function DataTablePagination<TData>({
  table,
  config,
}: {
  table: Table<TData>
  config: DataTablePaginationConfig
}) {
  const options = typeof config === 'object' ? config : {}
  const { pageIndex, pageSize } = table.getState().pagination

  const pageCount = table.getPageCount()
  const rowCount = table.getRowCount()
  const pageRange = getPageRange(pageIndex, pageCount)

  const firstRow = rowCount === 0 ? 0 : pageIndex * pageSize + 1
  const lastRow =
    rowCount === 0
      ? 0
      : Math.min((pageIndex + 1) * pageSize, rowCount)

  const pageSizeOptions = options.pageSizeOptions ?? [10, 20, 30, 40, 50]

  return (
    <nav
      aria-label="Table pagination"
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        flexWrap: 'wrap',
      }}
    >
      <span aria-live="polite">
        Showing {firstRow}–{lastRow} of {rowCount}
      </span>

      <label>
        <span
          style={{
            position: 'absolute',
            width: 1,
            height: 1,
            overflow: 'hidden',
            clip: 'rect(0 0 0 0)',
          }}
        >
          Rows per page
        </span>

        <select
          value={pageSize}
          onChange={(event) => {
            const nextSize = Number(event.target.value)
            table.setPageSize(nextSize)
            table.setPageIndex(0)
          }}
          aria-label="Rows per page"
        >
          {pageSizeOptions.map((size) => (
            <option key={size} value={size}>
              {size}
            </option>
          ))}
        </select>
      </label>

      <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
        <button
          type="button"
          onClick={() => table.setPageIndex(0)}
          disabled={!table.getCanPreviousPage()}
          aria-label="First page"
        >
          First
        </button>

        <button
          type="button"
          onClick={() => table.previousPage()}
          disabled={!table.getCanPreviousPage()}
          aria-label="Previous page"
        >
          Previous
        </button>

        {pageRange.map((item, index) =>
          item === 'ellipsis' ? (
            <span key={`ellipsis-${index}`} aria-hidden="true">
              …
            </span>
          ) : (
            <button
              key={item}
              type="button"
              onClick={() => table.setPageIndex(item)}
              aria-current={item === pageIndex ? 'page' : undefined}
              aria-label={`Page ${item + 1}`}
              disabled={item === pageIndex}
            >
              {item + 1}
            </button>
          ),
        )}

        <button
          type="button"
          onClick={() => table.nextPage()}
          disabled={!table.getCanNextPage()}
          aria-label="Next page"
        >
          Next
        </button>

        <button
          type="button"
          onClick={() => table.setPageIndex(Math.max(0, pageCount - 1))}
          disabled={!table.getCanNextPage()}
          aria-label="Last page"
        >
          Last
        </button>
      </div>
    </nav>
  )
}
