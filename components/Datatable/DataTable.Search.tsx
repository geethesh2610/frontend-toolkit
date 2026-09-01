import { useEffect, useState } from 'react'
import type { Table } from '@tanstack/react-table'
import type { DataTableSearchConfig } from './DataTable.types'
import { useDebouncedValue } from './DataTable.state'

export function DataTableSearch<TData>({
  table,
  config,
}: {
  table: Table<TData>
  config: DataTableSearchConfig
}) {
  const options = typeof config === 'object' ? config : {}
  const tableValue = String(table.getState().globalFilter ?? '')
  const [value, setValue] = useState(tableValue)
  const debouncedValue = useDebouncedValue(value, options.debounceMs ?? 300)

  useEffect(() => {
    setValue(tableValue)
  }, [tableValue])

  useEffect(() => {
    if (debouncedValue !== tableValue) {
      table.setGlobalFilter(debouncedValue)
    }
  }, [debouncedValue, table, tableValue])

  const clear = () => {
    setValue('')
    table.setGlobalFilter('')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
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
          Search table
        </span>
        <input
          type="search"
          value={value}
          onChange={(event) => setValue(event.target.value)}
          placeholder={options.placeholder ?? 'Search…'}
          autoComplete="off"
        />
      </label>

      {value !== '' && (
        <button type="button" onClick={clear} aria-label="Clear search">
          Clear
        </button>
      )}
    </div>
  )
}
