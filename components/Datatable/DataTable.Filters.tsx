import type { Table } from '@tanstack/react-table'
import { getColumnMeta } from './DataTable.utils'
import type { DataTableFilteringConfig } from './DataTable.types'

export function DataTableFilters<TData>({
  table,
  config,
}: {
  table: Table<TData>
  config: DataTableFilteringConfig
}) {
  if (!config) return null

  const columns = table.getAllLeafColumns().filter((column) => column.getCanFilter())

  if (columns.length === 0) return null

  return (
    <div role="group" aria-label="Table filters">
      {columns.map((column) => {
        const filterMeta = getColumnMeta(column)?.filter
        const value = column.getFilterValue()

        if (filterMeta?.type === 'select') {
          return (
            <label key={column.id}>
              <span>{column.id}</span>
              <select
                value={String(value ?? '')}
                onChange={(event) =>
                  column.setFilterValue(event.target.value || undefined)
                }
              >
                <option value="">All</option>
                {(filterMeta.options ?? []).map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          )
        }

        if (filterMeta?.type === 'multi-select') {
          const selected = Array.isArray(value) ? value.map(String) : []

          return (
            <fieldset key={column.id}>
              <legend>{column.id}</legend>
              {(filterMeta.options ?? []).map((option) => (
                <label key={option.value}>
                  <input
                    type="checkbox"
                    checked={selected.includes(option.value)}
                    onChange={(event) => {
                      const next = event.target.checked
                        ? [...selected, option.value]
                        : selected.filter((item) => item !== option.value)

                      column.setFilterValue(next.length ? next : undefined)
                    }}
                  />
                  {option.label}
                </label>
              ))}
            </fieldset>
          )
        }

        if (filterMeta?.type === 'boolean') {
          return (
            <label key={column.id}>
              <span>{column.id}</span>
              <select
                value={value == null ? '' : String(value)}
                onChange={(event) => {
                  const next = event.target.value
                  column.setFilterValue(
                    next === '' ? undefined : next === 'true',
                  )
                }}
              >
                <option value="">All</option>
                <option value="true">Yes</option>
                <option value="false">No</option>
              </select>
            </label>
          )
        }

        if (filterMeta?.type === 'date-range') {
          const range = Array.isArray(value) ? value : ['', '']

          return (
            <div key={column.id}>
              <span>{column.id}</span>
              <input
                type="date"
                value={String(range[0] ?? '')}
                onChange={(event) =>
                  column.setFilterValue([
                    event.target.value,
                    String(range[1] ?? ''),
                  ])
                }
                aria-label={`${column.id} from`}
              />
              <input
                type="date"
                value={String(range[1] ?? '')}
                onChange={(event) =>
                  column.setFilterValue([
                    String(range[0] ?? ''),
                    event.target.value,
                  ])
                }
                aria-label={`${column.id} to`}
              />
            </div>
          )
        }

        return (
          <label key={column.id}>
            <span>{column.id}</span>
            <input
              type={filterMeta?.type === 'number' ? 'number' : 'text'}
              value={String(value ?? '')}
              onChange={(event) =>
                column.setFilterValue(event.target.value || undefined)
              }
              placeholder={
                filterMeta?.placeholder ?? `Filter ${column.id}`
              }
            />
          </label>
        )
      })}
    </div>
  )
}
