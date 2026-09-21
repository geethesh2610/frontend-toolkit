/**
 * VirtualList
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   A generic, headless virtualized list: renders only the rows currently
 *   in (or near) the visible scroll area, no matter how many `items` there
 *   are. Built on `@tanstack/react-virtual` — the same virtualization
 *   engine already used inside `DataTable` and `Select`'s dropdown, exposed
 *   here as a standalone component for anywhere else you need a long list
 *   (chat messages, activity feeds, search results, ...).
 *
 * WHEN TO USE
 *   - Rendering hundreds/thousands of rows where mounting them all at once
 *     would be slow to render and heavy on memory (every DOM node stays
 *     mounted, every one participates in layout).
 *
 * WHEN NOT TO USE
 *   - Short lists (a few dozen items or fewer) — virtualization has its own
 *     overhead (measuring, scroll math) that isn't worth paying for a list
 *     that would render instantly anyway.
 *   - Rows whose heights vary wildly and unpredictably where you can't even
 *     provide a rough `estimateSize` — virtualization still works, but
 *     scrollbar-jumping during fast scrolls gets worse the less accurate
 *     the estimate is.
 *   - You need the browser's native find-in-page (Ctrl+F) to find off-screen
 *     items — virtualized items that aren't rendered can't be found, since
 *     they're not in the DOM.
 *
 * PROPS
 *   items          The full array of data to render — NOT sliced/paginated
 *                  by you; this component decides what's visible.
 *   renderItem     `(item, index) => ReactNode` — renders one row. Called
 *                  only for items currently in/near the viewport.
 *   estimateSize   Row height in pixels, or `(index) => number` for
 *                  variable-height rows. Used as the INITIAL layout guess
 *                  before a row is actually measured; get this roughly
 *                  right for smooth scrolling.
 *   height         Fixed height (px) of the scrollable viewport. Required —
 *                  virtualization needs a bounded viewport to know what
 *                  "visible" means.
 *   overscan       Extra rows rendered above/below the visible area, to
 *                  reduce blank flashes on fast scroll. Default `6`.
 *   getItemKey     `(item, index) => React.Key`. Default: the array index —
 *                  override this if items can reorder/insert/remove so React
 *                  can track identity correctly.
 *   className/style   Applied to the scroll container.
 *
 * BEHAVIOR
 *   Renders a single scrollable container with one tall spacer element
 *   (`getTotalSize()`) so the scrollbar reflects the FULL list's size, and
 *   absolutely-positions each currently-visible row inside it at its
 *   measured offset.
 *
 * PERFORMANCE
 *   Mounted DOM node count stays roughly constant (visible rows + overscan)
 *   regardless of `items.length` — the whole point of this component.
 *
 * USAGE
 *   <VirtualList
 *     items={messages}
 *     height={480}
 *     estimateSize={56}
 *     getItemKey={(message) => message.id}
 *     renderItem={(message) => <ChatBubble message={message} />}
 *   />
 * ----------------------------------------------------------------------------
 */

import { useRef, type CSSProperties, type Key, type ReactNode } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

export interface VirtualListProps<T> {
    items: T[];
    renderItem: (item: T, index: number) => ReactNode;
    estimateSize: number | ((index: number) => number);
    height: number;
    overscan?: number;
    getItemKey?: (item: T, index: number) => Key;
    className?: string;
    style?: CSSProperties;
}

export function VirtualList<T>({ items, renderItem, estimateSize, height, overscan = 6, getItemKey, className, style }: VirtualListProps<T>) {
    const scrollRef = useRef<HTMLDivElement>(null);
    const estimate = typeof estimateSize === "function" ? estimateSize : () => estimateSize;

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: estimate,
        overscan,
    });

    return (
        <div ref={scrollRef} className={className} style={{ height, overflowY: "auto", ...style }}>
            <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
                {virtualizer.getVirtualItems().map((virtualRow) => {
                    const item = items[virtualRow.index];
                    return (
                        <div
                            key={getItemKey ? getItemKey(item, virtualRow.index) : virtualRow.index}
                            data-index={virtualRow.index}
                            style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: virtualRow.size,
                                transform: `translateY(${virtualRow.start}px)`,
                            }}
                        >
                            {renderItem(item, virtualRow.index)}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
