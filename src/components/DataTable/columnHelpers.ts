import type { Column, RowData } from "@tanstack/react-table";
import type { CSSProperties } from "react";

import type { DataTableFeatures } from "./features";

/**
 * Positioning styles for a pinned column's <th>/<td>.
 *
 * NOTE: sticky offsets are computed by TanStack from each column's `size`
 * (default 150, see DataTable's `enableColumnPinning` doc comment), not its
 * actual rendered width — so pinning only lines up pixel-perfectly once the
 * table also renders a fixed-width `<colgroup>` (DataTable does this
 * automatically whenever pinning or resizing is on).
 *
 * This only sets *functional* CSS (position/offset/z-index). Pinned cells
 * need an opaque background to avoid see-through content scrolling
 * underneath them — that's a visual choice left to the consumer, who can
 * target it with `[data-pinned]` / `[data-pinned="start"]` selectors.
 */
export function getPinnedCellStyle<TData extends RowData, TValue>(
    column: Column<DataTableFeatures, TData, TValue>,
    isHeader: boolean,
): CSSProperties {
    const pinned = column.getIsPinned();

    if (!pinned) {
        return {};
    }

    return {
        position: "sticky",
        insetInlineStart: pinned === "start" ? column.getStart("start") : undefined,
        insetInlineEnd: pinned === "end" ? column.getAfter("end") : undefined,
        zIndex: isHeader ? 3 : 1,
    };
}
