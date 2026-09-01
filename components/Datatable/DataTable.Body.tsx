import { type Row, type Table } from '@tanstack/react-table'
import type { ReactNode } from 'react'
import { DataTableRow } from './DataTable.Row'

export function DataTableBody<TData>({
  table,
  rows,
  virtualized,
  virtualItems,
  selectionEnabled,
  pinningEnabled,
  expansionEnabled,
  renderExpandedRow,
  onRowClick,
}: {
  table: Table<TData>
  rows: Row<TData>[]
  virtualized: boolean
  virtualItems: Array<{ index: number; start: number; key: string }>
  selectionEnabled: boolean
  pinningEnabled: boolean
  expansionEnabled: boolean
  renderExpandedRow?: (props: { row: Row<TData> }) => ReactNode
  onRowClick?: (row: Row<TData>) => void
}) {
  const items = virtualized
    ? virtualItems
        .map((item) => ({
          row: rows[item.index],
          start: item.start,
        }))
        .filter(
          (item): item is { row: Row<TData>; start: number } =>
            Boolean(item.row),
        )
    : rows.map((row) => ({
        row,
        start: 0,
      }))

  return (
    <tbody
      style={
        virtualized
          ? {
              position: 'relative',
              height: table.getRowModel().rows.length
                ? undefined
                : 0,
            }
          : undefined
      }
    >
      {items.map(({ row, start }) => (
        <DataTableRow
          key={row.id}
          row={row}
          virtualStart={start}
          virtualized={virtualized}
          selectionEnabled={selectionEnabled}
          pinningEnabled={pinningEnabled}
          expansionEnabled={expansionEnabled}
          expandedContent={renderExpandedRow?.({ row })}
          onRowClick={onRowClick}
        />
      ))}
    </tbody>
  )
}
