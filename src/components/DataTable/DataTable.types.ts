import type {
    ColumnDef,
    ColumnFiltersState,
    ColumnPinningState,
    ColumnResizeMode,
    ColumnSizingState,
    ColumnVisibilityState,
    PaginationState,
    ReactTable,
    Row,
    RowData,
    RowSelectionState,
    SortingState,
} from "@tanstack/react-table";
import type { CSSProperties, MouseEvent, ReactNode } from "react";

import type { DataTableFeatures } from "./features";

export interface DataTableClassNames {
    root?: string;
    toolbar?: string;
    searchInput?: string;
    columnsButton?: string;
    columnsMenu?: string;
    exportButton?: string;
    tableWrapper?: string;
    table?: string;
    thead?: string;
    headerRow?: string;
    th?: string;
    resizeHandle?: string;
    filterRow?: string;
    filterInput?: string;
    tbody?: string;
    tr?: string;
    td?: string;
    emptyState?: string;
    pagination?: string;
    paginationButton?: string;
    paginationSelect?: string;
}

export interface DataTableProps<TData extends RowData> {
    columns: ColumnDef<DataTableFeatures, TData>[];
    data: TData[];

    /** Stable row id (recommended for row selection to survive sort/filter/paginate). */
    getRowId?: (row: TData, index: number) => string;

    /* ---------------------------------------------------------------- */
    /* Sorting                                                          */
    /* ---------------------------------------------------------------- */
    sorting?: SortingState;
    defaultSorting?: SortingState;
    onSortingChange?: (sorting: SortingState) => void;
    /** Defer sorting to the server: you sort `data` yourself before passing it in. */
    manualSorting?: boolean;
    enableSorting?: boolean;
    enableMultiSort?: boolean;

    /* ---------------------------------------------------------------- */
    /* Column filters + global search                                  */
    /* ---------------------------------------------------------------- */
    /** Shows a filter-input row under the headers, driven by `column.meta.filterVariant`. */
    enableColumnFilters?: boolean;
    columnFilters?: ColumnFiltersState;
    defaultColumnFilters?: ColumnFiltersState;
    onColumnFiltersChange?: (filters: ColumnFiltersState) => void;

    enableGlobalFilter?: boolean;
    globalFilter?: string;
    defaultGlobalFilter?: string;
    onGlobalFilterChange?: (value: string) => void;
    /** Debounce (ms) between typing in the search box and it actually filtering. Default 250. */
    globalFilterDebounceMs?: number;
    searchPlaceholder?: string;

    /** Defer filtering to the server: you filter `data` yourself before passing it in. */
    manualFiltering?: boolean;

    /* ---------------------------------------------------------------- */
    /* Pagination                                                       */
    /* ---------------------------------------------------------------- */
    /** Default true. Set false to render every row at once (pair with `enableRowVirtualization`). */
    enablePagination?: boolean;
    pagination?: PaginationState;
    defaultPagination?: PaginationState;
    onPaginationChange?: (pagination: PaginationState) => void;
    pageSizeOptions?: number[];

    /** Defer pagination to the server: `data` is just the current page. Requires `pageCount`. */
    manualPagination?: boolean;
    pageCount?: number;
    /** Total row count across all pages, for the "x of y" label under manual pagination. */
    rowCount?: number;

    /* ---------------------------------------------------------------- */
    /* Column pinning                                                   */
    /* ---------------------------------------------------------------- */
    /**
     * Sticks columns to the start/end edge while the rest scroll
     * horizontally underneath. Once enabled, the table switches to a
     * fixed `<colgroup>` layout (each column's `size`, default 150) so
     * the sticky offsets line up with what's actually rendered — set an
     * explicit `size` per column for correct widths. Pinned cells need an
     * opaque background from the consumer (see `[data-pinned]`).
     */
    enableColumnPinning?: boolean;
    columnPinning?: ColumnPinningState;
    defaultColumnPinning?: ColumnPinningState;
    onColumnPinningChange?: (pinning: ColumnPinningState) => void;

    /* ---------------------------------------------------------------- */
    /* Column resizing (width)                                         */
    /* ---------------------------------------------------------------- */
    enableColumnResizing?: boolean;
    columnResizeMode?: ColumnResizeMode;
    columnSizing?: ColumnSizingState;
    defaultColumnSizing?: ColumnSizingState;
    onColumnSizingChange?: (sizing: ColumnSizingState) => void;

    /* ---------------------------------------------------------------- */
    /* Column visibility                                                */
    /* ---------------------------------------------------------------- */
    /** Shows a "Columns" menu to toggle visibility at runtime. */
    enableColumnVisibility?: boolean;
    columnVisibility?: ColumnVisibilityState;
    defaultColumnVisibility?: ColumnVisibilityState;
    onColumnVisibilityChange?: (visibility: ColumnVisibilityState) => void;

    /* ---------------------------------------------------------------- */
    /* Row selection                                                    */
    /* ---------------------------------------------------------------- */
    /** Injects a checkbox column (id `__select__`) at the start of the table. */
    enableRowSelection?: boolean | ((row: Row<DataTableFeatures, TData>) => boolean);
    enableMultiRowSelection?: boolean;
    rowSelection?: RowSelectionState;
    defaultRowSelection?: RowSelectionState;
    onRowSelectionChange?: (
        selectedRows: TData[],
        selection: RowSelectionState,
    ) => void;

    /* ---------------------------------------------------------------- */
    /* CSV export                                                       */
    /* ---------------------------------------------------------------- */
    /** Exports all currently filtered/sorted rows (not just the current page). */
    enableCsvExport?: boolean;
    csvFilename?: string;
    getCsvRow?: (row: TData) => Record<string, unknown>;

    /* ---------------------------------------------------------------- */
    /* Virtualization                                                   */
    /* ---------------------------------------------------------------- */
    /** Renders only the rows scrolled into view. Requires `containerHeight`. */
    enableRowVirtualization?: boolean;
    estimatedRowHeight?: number;
    /** Height of the scrollable body; also enables a sticky header. */
    containerHeight?: CSSProperties["height"];

    /* ---------------------------------------------------------------- */
    /* Loading / empty states                                           */
    /* ---------------------------------------------------------------- */
    isLoading?: boolean;
    loadingRowCount?: number;
    loadingState?: ReactNode;
    emptyState?: ReactNode;

    /* ---------------------------------------------------------------- */
    /* Misc                                                             */
    /* ---------------------------------------------------------------- */
    onRowClick?: (row: TData, event: MouseEvent<HTMLTableRowElement>) => void;
    getRowClassName?: (row: TData, index: number) => string | undefined;

    classNames?: DataTableClassNames;
    className?: string;
    style?: CSSProperties;

    /** Fully replace the built-in toolbar (search/columns/export). */
    renderToolbar?: (table: ReactTable<DataTableFeatures, TData>) => ReactNode;
    /** Fully replace the built-in pagination bar. */
    renderPagination?: (table: ReactTable<DataTableFeatures, TData>) => ReactNode;
}
