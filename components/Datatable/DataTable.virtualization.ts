import { useVirtualizer } from '@tanstack/react-virtual'
import { useRef } from 'react'

export function useDataTableVirtualizer(
  count: number,
  enabled: boolean,
  estimateRowHeight: number,
  overscan: number,
) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count,
    getScrollElement: () => scrollRef.current,
    estimateSize: () => estimateRowHeight,
    overscan,
    enabled,
    useFlushSync: false,
  })

  return {
    scrollRef,
    virtualizer,
  }
}
