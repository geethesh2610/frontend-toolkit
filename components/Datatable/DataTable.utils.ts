import type { CSSProperties } from 'react'
import type { Column, Header, Table } from '@tanstack/react-table'
import type {
  DataTableColumnDef,
  DataTableConfig,
  DataTableMode,
  DataTableSearchConfig,
} from './DataTable.types'

export function isEnabled(value: unknown): boolean {
  return value === true || (typeof value === 'object' && value !== null)
}

export function getMode(value: unknown): DataTableMode {
  if (
    typeof value === 'object' &&
    value !== null &&
    'mode' in value &&
    value.mode === 'server'
  ) {
    return 'server'
  }

  return 'client'
}

export function getSearchConfig<TData>(
  config?: DataTableConfig<TData>,
): DataTableSearchConfig | undefined {
  if (config?.search !== undefined) return config.search
  return config?.searchable ? true : undefined
}

export function getColumnMeta<TData>(column: Column<TData, unknown>) {
  return column.columnDef.meta as DataTableColumnDef<TData>['meta']
}

export function getHeaderLabel(header: Header<any, unknown>): string {
  const headerDef = header.column.columnDef.header
  return typeof headerDef === 'string' ? headerDef : header.column.id
}

export function getPinnedStyle<TData>(
  column: Column<TData, unknown>,
): CSSProperties {
  const pinned = column.getIsPinned()

  if (!pinned) return {}

  return {
    position: 'sticky',
    left: pinned === 'left' ? column.getStart('left') : undefined,
    right: pinned === 'right' ? column.getAfter('right') : undefined,
    zIndex: 2,
    background: 'inherit',
  }
}

export function getPageRange(
  currentPage: number,
  pageCount: number,
  siblingCount = 1,
): Array<number | 'ellipsis'> {
  if (pageCount <= 0) return []

  const totalVisible = siblingCount * 2 + 5

  if (pageCount <= totalVisible) {
    return Array.from({ length: pageCount }, (_, index) => index)
  }

  const first = 0
  const last = pageCount - 1
  const left = Math.max(currentPage - siblingCount, 1)
  const right = Math.min(currentPage + siblingCount, pageCount - 2)

  const items: Array<number | 'ellipsis'> = [first]

  if (left > 1) items.push('ellipsis')

  for (let page = left; page <= right; page += 1) {
    items.push(page)
  }

  if (right < pageCount - 2) items.push('ellipsis')

  items.push(last)

  return items
}
