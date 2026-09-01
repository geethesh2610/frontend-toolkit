import type { Table } from '@tanstack/react-table'
import type { DataTableConfig, DataTableRenderers } from './DataTable.types'
import { getSearchConfig, isEnabled } from './DataTable.utils'
import { DataTableSearch } from './DataTable.Search'
import { DataTableFilters } from './DataTable.Filters'
import { DataTableColumnVisibility } from './DataTable.ColumnVisibility'

export function DataTableToolbar<TData>({
  table,
  config,
  renderers,
}: {
  table: Table<TData>
  config?: DataTableConfig<TData>
  renderers?: DataTableRenderers<TData>
}) {
  const search = getSearchConfig(config)
  const filtering = config?.filtering
  const visibility = config?.columnVisibility

  if (!search && !isEnabled(filtering) && !isEnabled(visibility)) {
    return null
  }

  return (
    <div role="toolbar" aria-label="Table toolbar">
      {search &&
        (renderers?.search?.({ table, config: search }) ?? (
          <DataTableSearch table={table} config={search} />
        ))}

      {filtering &&
        (renderers?.filters?.({ table }) ?? (
          <DataTableFilters table={table} config={filtering} />
        ))}

      {visibility &&
        (renderers?.columnVisibility?.({ table }) ?? (
          <DataTableColumnVisibility table={table} />
        ))}
    </div>
  )
}
