import { flexRender, type Row } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { getColumnMeta, getPinnedStyle } from './DataTable.utils'

export function DataTableRow<TData>({
  row,
  virtualStart,
  virtualized,
  selectionEnabled,
  pinningEnabled,
  onRowClick,
  expandedContent,
  expansionEnabled,
}: {
  row: Row<TData>
  virtualStart: number
  virtualized: boolean
  selectionEnabled: boolean
  pinningEnabled: boolean
  onRowClick?: (row: Row<TData>) => void
  expandedContent?: ReactNode
  expansionEnabled: boolean
}) {
  const cells = row.getVisibleCells()

  return (
    <>
      <tr
        data-row-id={row.id}
        onClick={onRowClick ? () => onRowClick(row) : undefined}
        style={
          virtualized
            ? {
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                transform: `translateY(${virtualStart}px)`,
              }
            : undefined
        }
      >
        {selectionEnabled && (
          <td>
            <input
              type="checkbox"
              checked={row.getIsSelected()}
              disabled={!row.getCanSelect()}
              ref={(element) => {
                if (element) {
                  element.indeterminate = row.getIsSomeSelected()
                }
              }}
              onChange={row.getToggleSelectedHandler()}
              onClick={(event) => event.stopPropagation()}
              aria-label={`Select row ${row.id}`}
            />
          </td>
        )}

        {cells.map((cell) => {
          const meta = getColumnMeta(cell.column)

          return (
            <td
              key={cell.id}
              className={meta?.className}
              style={{
                width: cell.column.getSize(),
                minWidth: cell.column.columnDef.minSize,
                maxWidth: cell.column.columnDef.maxSize,
                textAlign: meta?.align,
                ...(pinningEnabled
                  ? getPinnedStyle(cell.column)
                  : {}),
              }}
            >
              {flexRender(
                cell.column.columnDef.cell,
                cell.getContext(),
              )}
            </td>
          )
        })}
      </tr>

      {expansionEnabled &&
        row.getIsExpanded() &&
        expandedContent && (
          <tr data-expanded-for={row.id}>
            <td colSpan={cells.length + (selectionEnabled ? 1 : 0)}>
              {expandedContent}
            </td>
          </tr>
        )}
    </>
  )
}
