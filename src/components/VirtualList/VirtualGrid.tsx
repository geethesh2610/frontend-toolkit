/**
 * VirtualGrid
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   A generic, headless virtualized GRID for uniform fixed-size cells (photo
 *   grids, card grids, thumbnail pickers) — virtualizes ROWS (only rows near
 *   the viewport are rendered), where each row lays out `columnCount`
 *   fixed-width cells with CSS grid, rather than virtualizing a second axis.
 *
 * WHEN TO USE
 *   - A grid of same-sized cells (thumbnails, product cards) with hundreds+
 *     of items, where all `columnCount` columns fit on screen at once (the
 *     common case for a responsive card grid) — only the vertical scroll
 *     needs virtualizing.
 *
 * WHEN NOT TO USE
 *   - A grid wider than the viewport that ALSO needs horizontal
 *     virtualization (e.g. a huge spreadsheet) — this only virtualizes
 *     rows; every cell in a rendered row still mounts. For true two-axis
 *     virtualization, use `@tanstack/react-virtual`'s column virtualizer
 *     directly instead of this component.
 *   - Variable-size cells — this assumes every cell is `rowHeight` tall.
 *     For variable sizing, `VirtualList` with one item per "row" (your own
 *     multi-column row component) fits better than forcing it in here.
 *
 * PROPS
 *   items         Full flat array of items — NOT pre-chunked into rows.
 *   columnCount   Fixed number of columns per row.
 *   renderItem    `(item, index) => ReactNode` — renders one cell.
 *   rowHeight     Fixed height (px) of each row.
 *   height        Fixed height (px) of the scrollable viewport.
 *   gap           Gap (px) between cells, both axes. Default `0`.
 *   overscan      Extra ROWS rendered above/below the visible area. Default `3`.
 *   getItemKey    `(item, index) => React.Key`. Default: the array index.
 *   className/style   Applied to the scroll container.
 *
 * BEHAVIOR
 *   Items are grouped into `Math.ceil(items.length / columnCount)` rows;
 *   only rows in/near the viewport render, each as a CSS grid of
 *   `columnCount` fixed-width tracks.
 *
 * PERFORMANCE
 *   Mounted DOM node count scales with (visible rows + overscan) ×
 *   columnCount, not with `items.length` — the point of virtualizing at all.
 *
 * USAGE
 *   <VirtualGrid
 *     items={photos}
 *     columnCount={4}
 *     rowHeight={180}
 *     height={600}
 *     gap={8}
 *     getItemKey={(photo) => photo.id}
 *     renderItem={(photo) => <Thumbnail photo={photo} />}
 *   />
 * ----------------------------------------------------------------------------
 */

import { useRef, type CSSProperties, type Key, type ReactNode } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

export interface VirtualGridProps<T> {
    items: T[];
    columnCount: number;
    renderItem: (item: T, index: number) => ReactNode;
    rowHeight: number;
    height: number;
    gap?: number;
    overscan?: number;
    getItemKey?: (item: T, index: number) => Key;
    className?: string;
    style?: CSSProperties;
}

export function VirtualGrid<T>({ items, columnCount, renderItem, rowHeight, height, gap = 0, overscan = 3, getItemKey, className, style }: VirtualGridProps<T>) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const rowCount = Math.ceil(items.length / columnCount);

    const virtualizer = useVirtualizer({
        count: rowCount,
        getScrollElement: () => scrollRef.current,
        estimateSize: () => rowHeight + gap,
        overscan,
    });

    return (
        <div ref={scrollRef} className={className} style={{ height, overflowY: "auto", ...style }}>
            <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const rowStart = virtualRow.index * columnCount;
                    const rowItems = items.slice(rowStart, rowStart + columnCount);

                    return (
                        <div
                            key={virtualRow.index}
                            data-index={virtualRow.index}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: rowHeight,
                                transform: `translateY(${virtualRow.start}px)`,
                                display: "grid",
                                gridTemplateColumns: `repeat(${columnCount}, 1fr)`,
                                gap,
                            }}
                        >
                            {rowItems.map((item, columnIndex) => {
                                const index = rowStart + columnIndex;
                                return <div key={getItemKey ? getItemKey(item, index) : index}>{renderItem(item, index)}</div>;
                            })}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
