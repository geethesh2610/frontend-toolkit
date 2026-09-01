import {
  flexRender,
  type HeaderGroup,
  type Table,
} from '@tanstack/react-table'
import { getHeaderLabel, getPinnedStyle } from './DataTable.utils'

export function DataTableHeader<TData>({
  table,
  selectionEnabled,
  sizingEnabled,
  pinningEnabled,
  stickyHeader,
}: {
  table: Table<TData>
  selectionEnabled: boolean
  sizingEnabled: boolean
  pinningEnabled: boolean
  stickyHeader: boolean
}) {
  return (
    <thead
      style={
        stickyHeader
          ? {
              position: 'sticky',
              top: 0,
              zIndex: 3,
            }
          : undefined
      }
    >
      {table.getHeaderGroups().map((headerGroup) => (
        <HeaderGroupRow
          key={headerGroup.id}
          headerGroup={headerGroup}
          table={table}
          selectionEnabled={selectionEnabled}
          sizingEnabled={sizingEnabled}
          pinningEnabled={pinningEnabled}
        />
      ))}
    </thead>
  )
}

function HeaderGroupRow<TData>({
  headerGroup,
  table,
  selectionEnabled,
  sizingEnabled,
  pinningEnabled,
}: {
  headerGroup: HeaderGroup<TData>
  table: Table<TData>
  selectionEnabled: boolean
  sizingEnabled: boolean
  pinningEnabled: boolean
}) {
  return (
    <tr>
      {selectionEnabled && headerGroup.depth === 0 && (
        <th scope="col" aria-label="Select all rows">
          <input
            type="checkbox"
            checked={table.getIsAllRowsSelected()}
            ref={(element) => {
              if (element) {
                element.indeterminate = table.getIsSomeRowsSelected()
              }
            }}
            onChange={table.getToggleAllRowsSelectedHandler()}
            aria-label="Select all rows"
          />
        </th>
      )}

      {headerGroup.headers.map((header) => {
        const column = header.column
        const sorted = column.getIsSorted()
        const meta = column.columnDef.meta as
          | { headerClassName?: string }
          | undefined

        return (
          <th
            key={header.id}
            colSpan={header.colSpan}
            scope="col"
            className={meta?.headerClassName}
            style={{
              width: header.getSize(),
              minWidth: column.columnDef.minSize,
              maxWidth: column.columnDef.maxSize,
              ...(pinningEnabled ? getPinnedStyle(column) : {}),
            }}
          >
            {header.isPlaceholder ? null : (
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: 4 }}>
                {column.getCanSort() ? (
                  <button
                    type="button"
                    onClick={column.getToggleSortingHandler()}
                    aria-label={`Sort by ${getHeaderLabel(header)}`}
                    aria-sort={
                      sorted === 'asc'
                        ? 'ascending'
                        : sorted === 'desc'
                          ? 'descending'
                          : 'none'
                    }
                  >
                    {flexRender(
                      column.columnDef.header,
                      header.getContext(),
                    )}
                    {sorted === 'asc'
                      ? ' ↑'
                      : sorted === 'desc'
                        ? ' ↓'
                        : ''}
                  </button>
                ) : (
                  flexRender(
                    column.columnDef.header,
                    header.getContext(),
                  )
                )}

                {sizingEnabled && column.getCanResize() && (
                  <button
                    type="button"
                    aria-label={`Resize ${getHeaderLabel(header)}`}
                    onMouseDown={header.getResizeHandler()}
                    onTouchStart={header.getResizeHandler()}
                    style={{
                      cursor: 'col-resize',
                      touchAction: 'none',
                      width: 8,
                    }}
                  />
                )}
              </div>
            )}
          </th>
        )
      })}
    </tr>
  )
}
