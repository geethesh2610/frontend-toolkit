import type { Table } from '@tanstack/react-table'

export function DataTableColumnVisibility<TData>({
  table,
}: {
  table: Table<TData>
}) {
  const columns = table
    .getAllLeafColumns()
    .filter((column) => column.getCanHide())

  if (!columns.length) return null

  return (
    <details>
      <summary>Columns</summary>

      <fieldset>
        <legend>Visible columns</legend>

        {columns.map((column) => (
          <label key={column.id}>
            <input
              type="checkbox"
              checked={column.getIsVisible()}
              onChange={column.getToggleVisibilityHandler()}
            />
            <span>
              {typeof column.columnDef.header === 'string'
                ? column.columnDef.header
                : column.id}
            </span>
          </label>
        ))}
      </fieldset>
    </details>
  )
}
