import type { ReactNode } from 'react'

const visuallyHidden: React.CSSProperties = {
  position: 'absolute',
  width: 1,
  height: 1,
  padding: 0,
  margin: -1,
  overflow: 'hidden',
  clip: 'rect(0, 0, 0, 0)',
  whiteSpace: 'nowrap',
  border: 0,
}

export function DataTableLoading({ children }: { children?: ReactNode }) {
  return (
    <div role="status" aria-live="polite">
      {children ?? 'Loading…'}
    </div>
  )
}

export function DataTableSkeleton({
  rows = 5,
  columns = 5,
}: {
  rows?: number
  columns?: number
}) {
  return (
    <div role="status" aria-label="Loading table">
      {Array.from({ length: rows }).map((_, rowIndex) => (
        <div key={rowIndex} style={{ display: 'flex', gap: 8, marginBlock: 8 }}>
          {Array.from({ length: columns }).map((__, columnIndex) => (
            <div
              key={columnIndex}
              aria-hidden="true"
              style={{
                height: 16,
                flex: 1,
                background: 'currentColor',
                opacity: 0.08,
                borderRadius: 4,
              }}
            />
          ))}
        </div>
      ))}
      <span style={visuallyHidden}>Loading table…</span>
    </div>
  )
}

export function DataTableRefetching({ children }: { children?: ReactNode }) {
  return (
    <div role="status" aria-live="polite">
      {children ?? 'Refreshing…'}
    </div>
  )
}

export function DataTableEmpty({ children }: { children?: ReactNode }) {
  return <div role="status">{children ?? 'No data available.'}</div>
}

export function DataTableNoResults({ children }: { children?: ReactNode }) {
  return <div role="status">{children ?? 'No results found.'}</div>
}

export function DataTableError({ children }: { children?: ReactNode }) {
  return <div role="alert">{children ?? 'Unable to load data.'}</div>
}
