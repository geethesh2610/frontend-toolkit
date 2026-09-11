/*
 * TanStack Table v9 replaced global `declare module` augmentation and
 * automatic feature bundling with explicit, statically-registered
 * `tableFeatures()`. A single component that wants sorting + filtering +
 * pagination + pinning + sizing/resizing + visibility + row selection as
 * *optional, runtime-toggleable* behavior has to register all of those
 * features once, here, and then turn individual ones on/off per table
 * instance with plain boolean options (`enableSorting`, `enableRowSelection`,
 * ...) — v9's per-instance escape hatch for a "maybe use this" feature.
 *
 * Every consumer of <DataTable> builds columns through
 * `createDataTableColumnHelper` (or the `DataTableColumnDef` type) so their
 * columns are typed against this exact feature set.
 */

import {
    columnFilteringFeature,
    columnPinningFeature,
    columnResizingFeature,
    columnSizingFeature,
    columnVisibilityFeature,
    createColumnHelper,
    createFilteredRowModel,
    createPaginatedRowModel,
    createSortedRowModel,
    filterFn_equalsString,
    filterFn_inNumberRange,
    filterFn_includesString,
    globalFilteringFeature,
    metaHelper,
    rowPaginationFeature,
    rowSelectionFeature,
    rowSortingFeature,
    sortFn_alphanumeric,
    sortFn_datetime,
    tableFeatures,
    type ColumnDef,
    type RowData,
} from "@tanstack/react-table";

export interface DataTableColumnMeta {
    /** Which input the built-in per-column filter row renders. Omit (or 'none') to skip filtering UI for this column. */
    filterVariant?: "text" | "number" | "select" | "none";
    /** Options for `filterVariant: 'select'`. */
    filterOptions?: readonly { label: string; value: string }[];
    /** Text alignment for the column's header/cell content. */
    align?: "left" | "center" | "right";
}

export const dataTableFeatures = tableFeatures({
    rowSortingFeature,
    sortedRowModel: createSortedRowModel(),
    sortFns: { alphanumeric: sortFn_alphanumeric, datetime: sortFn_datetime },

    columnFilteringFeature,
    globalFilteringFeature,
    filteredRowModel: createFilteredRowModel(),
    filterFns: {
        includesString: filterFn_includesString,
        equalsString: filterFn_equalsString,
        inNumberRange: filterFn_inNumberRange,
    },

    rowPaginationFeature,
    paginatedRowModel: createPaginatedRowModel(),

    columnSizingFeature,
    columnResizingFeature,
    columnPinningFeature,
    columnVisibilityFeature,
    rowSelectionFeature,

    columnMeta: metaHelper<DataTableColumnMeta>(),
});

export type DataTableFeatures = typeof dataTableFeatures;

export function createDataTableColumnHelper<TData extends RowData>() {
    return createColumnHelper<DataTableFeatures, TData>();
}

export type DataTableColumnDef<TData extends RowData, TValue = unknown> = ColumnDef<
    DataTableFeatures,
    TData,
    TValue
>;
