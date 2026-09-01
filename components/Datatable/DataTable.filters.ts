import type { FilterFn } from '@tanstack/react-table'

export const dataTableFilterFns: Record<string, FilterFn<any>> = {
  dateRange: (row, columnId, value) => {
    const raw = row.getValue(columnId)
    const date = raw instanceof Date ? raw : new Date(String(raw))
    if (Number.isNaN(date.getTime())) return false

    const [from, to] = Array.isArray(value) ? value : [undefined, undefined]
    const fromDate = from ? new Date(String(from)) : undefined
    const toDate = to ? new Date(String(to)) : undefined

    if (fromDate && date < fromDate) return false

    if (toDate) {
      toDate.setHours(23, 59, 59, 999)
      if (date > toDate) return false
    }

    return true
  },

  multiSelect: (row, columnId, value) => {
    if (!Array.isArray(value) || value.length === 0) return true

    const cellValue = row.getValue(columnId)

    return value.includes(String(cellValue))
  },

  boolean: (row, columnId, value) => {
    if (value === undefined || value === '') return true
    return Boolean(row.getValue(columnId)) === Boolean(value)
  },
}

export function getDefaultFilterFn(type: string | undefined): string | undefined {
  switch (type) {
    case 'date-range':
      return 'dateRange'
    case 'multi-select':
      return 'multiSelect'
    case 'boolean':
      return 'boolean'
    default:
      return undefined
  }
}
