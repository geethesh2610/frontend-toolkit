/*
 * ============================================================================
 * DataTable
 * ============================================================================
 *
 * A headless-styled, drop-in-anywhere wrapper around @tanstack/react-table
 * (v9). "Headless" here means the same thing it does for Modal/ScrollArea in
 * this toolkit: DataTable renders real <table> markup and wires up all the
 * behavior (sorting, filtering, pagination, pinning, resizing, selection,
 * virtualization), but ships no colors/fonts/borders. Visual design is
 * entirely up to the consumer via `classNames` (one key per slot) and
 * `[data-*]` attributes (`data-sorted`, `data-pinned`, `data-selected`,
 * `data-resizing`) exposed on the relevant elements.
 *
 * V9 requires columns to be typed against a fixed, statically-registered
 * feature set (see ./features.ts) — build columns with
 * `createDataTableColumnHelper<Row>()` so they line up with what this
 * component registers:
 *
 * import { createDataTableColumnHelper } from './DataTable/features'
 * const helper = createDataTableColumnHelper<Person>()
 * const columns = helper.columns([
 *   helper.accessor('name', { header: 'Name' }),
 *   helper.accessor('age', { header: 'Age' }),
 * ])
 *
 * <DataTable columns={columns} data={data} />
 *
 *
 * With sticky columns + resizing (they're designed to be used together —
 * pinning only lines up correctly once columns have real, fixed widths):
 *
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   enableColumnPinning
 *   enableColumnResizing
 *   defaultColumnPinning={{ start: ['id'], end: [] }}
 * />
 *
 *
 * Server-side data (you own sorting/filtering/pagination, DataTable just
 * renders whatever page of `data` you hand it):
 *
 * <DataTable
 *   columns={columns}
 *   data={currentPageRows}
 *   manualSorting
 *   manualFiltering
 *   manualPagination
 *   pageCount={totalPages}
 *   rowCount={totalRows}
 *   sorting={sorting}
 *   onSortingChange={setSorting}
 *   pagination={pagination}
 *   onPaginationChange={setPagination}
 * />
 *
 *
 * Large in-memory dataset, no pagination, only render visible rows:
 *
 * <DataTable
 *   columns={columns}
 *   data={tenThousandRows}
 *   enablePagination={false}
 *   enableRowVirtualization
 *   containerHeight={600}
 * />
 *
 *
 * Per-column filters (declare `meta.filterVariant` on the column def):
 *
 * const columns = helper.columns([
 *   helper.accessor('region', { header: 'Region', meta: { filterVariant: 'select', filterOptions: [...] } }),
 *   helper.accessor('population', { header: 'Population', meta: { filterVariant: 'number' } }),
 * ])
 * <DataTable columns={columns} data={data} enableColumnFilters />
 *
 *
 * Row selection:
 *
 * <DataTable
 *   columns={columns}
 *   data={data}
 *   getRowId={(row) => row.id}
 *   enableRowSelection
 *   onRowSelectionChange={(selectedRows) => setSelected(selectedRows)}
 * />
 *
 * ============================================================================
 */

import {
    useCallback,
    useEffect,
    useMemo,
    useRef,
    useState,
    type CSSProperties,
    type ReactNode,
} from "react";

import { useTable, type Column, type ColumnDef, type Row, type RowData } from "@tanstack/react-table";
import { useVirtualizer } from "@tanstack/react-virtual";

import { useControllableState } from "../../react-hooks/useControllableState";
import { useDebounce } from "../../react-hooks/useDebounce";
import { downloadCsv } from "../../utils/download/csv";

import { getPinnedCellStyle } from "./columnHelpers";
import DataTablePagination from "./DataTablePagination";
import DataTableToolbar from "./DataTableToolbar";
import type { DataTableProps } from "./DataTable.types";
import { dataTableFeatures, type DataTableFeatures } from "./features";

const SELECT_COLUMN_ID = "__select__";

/* -------------------------------------------------------------------------- */
/* Per-column filter input                                                    */
/* -------------------------------------------------------------------------- */

function ColumnFilterInput<TData extends RowData>({
    column,
    className,
}: {
    column: Column<DataTableFeatures, TData, unknown>;
    className?: string;
}) {
    const variant = column.columnDef.meta?.filterVariant ?? "text";
    const value = column.getFilterValue();

    if (variant === "select") {
        const options = column.columnDef.meta?.filterOptions ?? [];
        return (
            <select
                className={className}
                value={(value as string) ?? ""}
                onChange={(event) =>
                    column.setFilterValue(event.target.value || undefined)
                }
                aria-label={`Filter ${column.id}`}
            >
                <option value="">All</option>
                {options.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        );
    }

    if (variant === "number") {
        // A numeric column's filterFn auto-resolves to `inNumberRange` (see
        // TanStack's `column_getAutoFilterFn`), which expects `[min, max]`.
        // A single input still means "exact match" — sent as `[n, n]` so it
        // fits what `inNumberRange`'s `resolveFilterValue` expects instead
        // of the bare number it used to send (which crashed with "val is
        // not iterable" the moment a filter value was set).
        const [rangeMin] = (value as [number, number] | undefined) ?? [];
        return (
            <input
                type="number"
                className={className}
                value={rangeMin ?? ""}
                onChange={(event) => {
                    if (event.target.value === "") {
                        column.setFilterValue(undefined);
                        return;
                    }
                    const num = Number(event.target.value);
                    column.setFilterValue([num, num]);
                }}
                aria-label={`Filter ${column.id}`}
            />
        );
    }

    return (
        <input
            type="text"
            className={className}
            value={(value as string) ?? ""}
            onChange={(event) => column.setFilterValue(event.target.value || undefined)}
            aria-label={`Filter ${column.id}`}
        />
    );
}

/* -------------------------------------------------------------------------- */
/* DataTable                                                                   */
/* -------------------------------------------------------------------------- */

export default function DataTable<TData extends RowData>({
    columns,
    data,
    getRowId,

    sorting: sortingProp,
    defaultSorting = [],
    onSortingChange,
    manualSorting = false,
    enableSorting = true,
    enableMultiSort = false,

    enableColumnFilters = false,
    columnFilters: columnFiltersProp,
    defaultColumnFilters = [],
    onColumnFiltersChange,

    enableGlobalFilter = true,
    globalFilter: globalFilterProp,
    defaultGlobalFilter = "",
    onGlobalFilterChange,
    globalFilterDebounceMs = 250,
    searchPlaceholder = "Search...",

    manualFiltering = false,

    enablePagination = true,
    pagination: paginationProp,
    defaultPagination = { pageIndex: 0, pageSize: 10 },
    onPaginationChange,
    pageSizeOptions = [10, 25, 50, 100],

    manualPagination = false,
    pageCount,
    rowCount,

    enableColumnPinning = false,
    columnPinning: columnPinningProp,
    defaultColumnPinning = { start: [], end: [] },
    onColumnPinningChange,

    enableColumnResizing = false,
    columnResizeMode = "onChange",
    columnSizing: columnSizingProp,
    defaultColumnSizing = {},
    onColumnSizingChange,

    enableColumnVisibility = false,
    columnVisibility: columnVisibilityProp,
    defaultColumnVisibility = {},
    onColumnVisibilityChange,

    enableRowSelection = false,
    enableMultiRowSelection = true,
    rowSelection: rowSelectionProp,
    defaultRowSelection = {},
    onRowSelectionChange,

    enableCsvExport = false,
    csvFilename = "data.csv",
    getCsvRow,

    enableRowVirtualization = false,
    estimatedRowHeight = 40,
    containerHeight,

    isLoading = false,
    loadingRowCount = 5,
    loadingState,
    emptyState,

    onRowClick,
    getRowClassName,

    classNames,
    className,
    style,

    renderToolbar,
    renderPagination,
}: DataTableProps<TData>) {
    /* ---------------------------------------------------------------- */
    /* Controlled/uncontrolled state                                    */
    /* ---------------------------------------------------------------- */

    const [sorting, setSorting] = useControllableState({
        value: sortingProp,
        defaultValue: defaultSorting,
        onChange: onSortingChange,
    });

    const [columnFilters, setColumnFilters] = useControllableState({
        value: columnFiltersProp,
        defaultValue: defaultColumnFilters,
        onChange: onColumnFiltersChange,
    });

    const [globalFilter, setGlobalFilter] = useControllableState({
        value: globalFilterProp,
        defaultValue: defaultGlobalFilter,
        onChange: onGlobalFilterChange,
    });

    // The search box updates instantly; the actual filter is debounced so
    // large in-memory datasets don't re-filter on every keystroke.
    const [searchInput, setSearchInput] = useState(globalFilter);
    const debouncedSearchInput = useDebounce(searchInput, globalFilterDebounceMs);

    useEffect(() => {
        setSearchInput(globalFilter);
    }, [globalFilter]);

    useEffect(() => {
        if (debouncedSearchInput !== globalFilter) {
            setGlobalFilter(debouncedSearchInput);
        }
    }, [debouncedSearchInput, globalFilter, setGlobalFilter]);

    const [pagination, setPagination] = useControllableState({
        value: paginationProp,
        defaultValue: defaultPagination,
        onChange: onPaginationChange,
    });

    // Row-model row-slicing is a static, always-registered feature in v9
    // (see ./features.ts) — there's no runtime way to omit it. Pagination's
    // own state type documents `pageSize: Infinity` as the supported way to
    // put every row on a single "page", so that's how `enablePagination`
    // disables paging without a second table configuration.
    const effectivePagination = enablePagination
        ? pagination
        : { pageIndex: 0, pageSize: Number.POSITIVE_INFINITY };

    const [columnPinning, setColumnPinning] = useControllableState({
        value: columnPinningProp,
        defaultValue: defaultColumnPinning,
        onChange: onColumnPinningChange,
    });

    const [columnSizing, setColumnSizing] = useControllableState({
        value: columnSizingProp,
        defaultValue: defaultColumnSizing,
        onChange: onColumnSizingChange,
    });

    const [columnVisibility, setColumnVisibility] = useControllableState({
        value: columnVisibilityProp,
        defaultValue: defaultColumnVisibility,
        onChange: onColumnVisibilityChange,
    });

    const [rowSelection, setRowSelection] = useControllableState({
        value: rowSelectionProp,
        defaultValue: defaultRowSelection,
        onChange: undefined,
    });

    /* ---------------------------------------------------------------- */
    /* Columns (+ injected selection column)                            */
    /* ---------------------------------------------------------------- */

    const resolvedColumns = useMemo<ColumnDef<DataTableFeatures, TData>[]>(() => {
        if (!enableRowSelection) return columns;

        const selectColumn: ColumnDef<DataTableFeatures, TData> = {
            id: SELECT_COLUMN_ID,
            header: ({ table }) => (
                <input
                    type="checkbox"
                    aria-label="Select all rows"
                    checked={table.getIsAllRowsSelected()}
                    ref={(element) => {
                        if (element) {
                            element.indeterminate =
                                table.getIsSomeRowsSelected() && !table.getIsAllRowsSelected();
                        }
                    }}
                    onChange={table.getToggleAllRowsSelectedHandler()}
                />
            ),
            cell: ({ row }) => (
                <input
                    type="checkbox"
                    aria-label={`Select row ${row.id}`}
                    checked={row.getIsSelected()}
                    disabled={!row.getCanSelect()}
                    onChange={row.getToggleSelectedHandler()}
                />
            ),
            size: 40,
            minSize: 40,
            maxSize: 40,
            enableSorting: false,
            enableColumnFilter: false,
            enableResizing: false,
            enableHiding: false,
        };

        return [selectColumn, ...columns];
    }, [columns, enableRowSelection]);

    /* ---------------------------------------------------------------- */
    /* Table instance                                                    */
    /* ---------------------------------------------------------------- */

    const table = useTable<DataTableFeatures, TData>({
        features: dataTableFeatures,
        data,
        columns: resolvedColumns,
        getRowId,

        state: {
            sorting,
            columnFilters,
            globalFilter,
            pagination: effectivePagination,
            columnPinning,
            columnSizing,
            columnVisibility,
            rowSelection,
        },

        onSortingChange: setSorting,
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        onPaginationChange: setPagination,
        onColumnPinningChange: setColumnPinning,
        onColumnSizingChange: setColumnSizing,
        onColumnVisibilityChange: setColumnVisibility,
        onRowSelectionChange: setRowSelection,

        manualSorting,
        manualFiltering,
        manualPagination,
        pageCount: manualPagination ? pageCount : undefined,
        rowCount,

        enableSorting,
        enableMultiSort,
        enableColumnFilters,
        enableGlobalFilter,
        enableColumnPinning,
        enableRowSelection,
        enableMultiRowSelection,
        enableColumnResizing,
        columnResizeMode,
    });

    const { FlexRender } = table;

    // Fire the richer `onRowSelectionChange(selectedRows, selection)` callback
    // after the table has re-rendered with the new selection state, so
    // `getSelectedRowModel()` reflects it.
    const onRowSelectionChangeRef = useRef(onRowSelectionChange);
    onRowSelectionChangeRef.current = onRowSelectionChange;
    const isFirstSelectionRender = useRef(true);

    useEffect(() => {
        if (isFirstSelectionRender.current) {
            isFirstSelectionRender.current = false;
            return;
        }
        onRowSelectionChangeRef.current?.(
            table.getSelectedRowModel().rows.map((row) => row.original),
            rowSelection,
        );
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [rowSelection]);

    /* ---------------------------------------------------------------- */
    /* CSV export                                                        */
    /* ---------------------------------------------------------------- */

    const handleExportCsv = useCallback(() => {
        const rows = table.getFilteredRowModel().rows.map((row) => row.original);
        const csvRows = getCsvRow
            ? rows.map(getCsvRow)
            : (rows as unknown as Record<string, unknown>[]);
        downloadCsv(csvRows, csvFilename);
    }, [table, getCsvRow, csvFilename]);

    /* ---------------------------------------------------------------- */
    /* Layout                                                            */
    /* ---------------------------------------------------------------- */

    // Pinning's sticky offsets are computed from each column's `size`
    // (defaults to 150), so it only lines up once the table also commits
    // to those widths via a fixed <colgroup> layout. Resizing needs the
    // same thing.
    const useFixedLayout = enableColumnPinning || enableColumnResizing;
    const stickyHeader = Boolean(containerHeight);
    const leafColumnCount = table.getVisibleLeafColumns().length;
    const headerGroups = table.getHeaderGroups();
    const filterRowHeaders = headerGroups[headerGroups.length - 1].headers;

    if (typeof process !== "undefined" && process.env.NODE_ENV !== "production" && enableRowVirtualization && !containerHeight) {
        console.warn(
            "DataTable: `enableRowVirtualization` requires `containerHeight` to have a scroll " +
            "container to measure against. Virtualization is disabled until one is provided.",
        );
    }

    const canVirtualize = enableRowVirtualization && Boolean(containerHeight);

    /* ---------------------------------------------------------------- */
    /* Virtualization                                                    */
    /* ---------------------------------------------------------------- */

    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const { rows } = table.getRowModel();

    const rowVirtualizer = useVirtualizer({
        count: rows.length,
        getScrollElement: () => scrollContainerRef.current,
        estimateSize: () => estimatedRowHeight,
        overscan: 8,
        enabled: canVirtualize,
    });

    /* ---------------------------------------------------------------- */
    /* Row rendering                                                     */
    /* ---------------------------------------------------------------- */

    const renderRow = (row: Row<DataTableFeatures, TData>) => (
        <tr
            key={row.id}
            className={classNames?.tr ?? getRowClassName?.(row.original, row.index)}
            data-selected={row.getIsSelected() || undefined}
            onClick={onRowClick ? (event) => onRowClick(row.original, event) : undefined}
            style={onRowClick ? { cursor: "pointer" } : undefined}
        >
            {row.getVisibleCells().map((cell) => (
                <td
                    key={cell.id}
                    className={classNames?.td}
                    data-pinned={cell.column.getIsPinned() || undefined}
                    style={getPinnedCellStyle(cell.column, false)}
                >
                    <FlexRender cell={cell} />
                </td>
            ))}
        </tr>
    );

    let bodyContent: ReactNode;

    if (isLoading) {
        bodyContent =
            loadingState ?? (
                <>
                    {Array.from({ length: loadingRowCount }).map((_, index) => (
                        <tr key={index} className={classNames?.tr}>
                            <td className={classNames?.td} colSpan={leafColumnCount}>
                                Loading…
                            </td>
                        </tr>
                    ))}
                </>
            );
    } else if (rows.length === 0) {
        bodyContent = (
            <tr>
                <td className={classNames?.emptyState ?? classNames?.td} colSpan={leafColumnCount}>
                    {emptyState ?? "No results."}
                </td>
            </tr>
        );
    } else if (canVirtualize) {
        const virtualRows = rowVirtualizer.getVirtualItems();
        const totalSize = rowVirtualizer.getTotalSize();
        const paddingTop = virtualRows.length > 0 ? virtualRows[0].start : 0;
        const paddingBottom =
            virtualRows.length > 0 ? totalSize - virtualRows[virtualRows.length - 1].end : 0;

        bodyContent = (
            <>
                {paddingTop > 0 && (
                    <tr aria-hidden style={{ height: paddingTop }}>
                        <td colSpan={leafColumnCount} style={{ padding: 0, border: "none" }} />
                    </tr>
                )}
                {virtualRows.map((virtualRow) => renderRow(rows[virtualRow.index]))}
                {paddingBottom > 0 && (
                    <tr aria-hidden style={{ height: paddingBottom }}>
                        <td colSpan={leafColumnCount} style={{ padding: 0, border: "none" }} />
                    </tr>
                )}
            </>
        );
    } else {
        bodyContent = <>{rows.map((row) => renderRow(row))}</>;
    }

    /* ---------------------------------------------------------------- */
    /* Render                                                            */
    /* ---------------------------------------------------------------- */

    return (
        <div className={classNames?.root ?? className} style={style}>
            {renderToolbar ? (
                renderToolbar(table)
            ) : (
                <DataTableToolbar
                    table={table}
                    enableGlobalFilter={enableGlobalFilter}
                    searchValue={searchInput}
                    onSearchChange={setSearchInput}
                    searchPlaceholder={searchPlaceholder}
                    enableColumnVisibility={enableColumnVisibility}
                    enableCsvExport={enableCsvExport}
                    onExportCsv={handleExportCsv}
                    classNames={classNames}
                />
            )}

            <div
                ref={scrollContainerRef}
                className={classNames?.tableWrapper}
                style={{
                    overflow: "auto",
                    height: containerHeight,
                }}
            >
                <table
                    className={classNames?.table}
                    style={{
                        width: useFixedLayout ? table.getTotalSize() : "100%",
                        tableLayout: useFixedLayout ? "fixed" : undefined,
                        borderCollapse: "collapse",
                    }}
                >
                    {useFixedLayout && (
                        <colgroup>
                            {table.getVisibleLeafColumns().map((column) => (
                                <col key={column.id} style={{ width: column.getSize() }} />
                            ))}
                        </colgroup>
                    )}

                    <thead className={classNames?.thead}>
                        {headerGroups.map((headerGroup) => (
                            <tr key={headerGroup.id} className={classNames?.headerRow}>
                                {headerGroup.headers.map((header) => {
                                    const pinned = header.column.getIsPinned();
                                    const style: CSSProperties = {
                                        position: pinned || stickyHeader ? "sticky" : "relative",
                                        top: stickyHeader ? 0 : undefined,
                                        zIndex: pinned ? 3 : stickyHeader ? 2 : undefined,
                                        ...getPinnedCellStyle(header.column, true),
                                    };

                                    const canSort = header.column.getCanSort();
                                    const sortDirection = header.column.getIsSorted();

                                    return (
                                        <th
                                            key={header.id}
                                            className={classNames?.th}
                                            colSpan={header.colSpan}
                                            data-pinned={pinned || undefined}
                                            data-sorted={sortDirection || undefined}
                                            style={style}
                                        >
                                            {header.isPlaceholder ? null : (
                                                <span
                                                    onClick={
                                                        canSort
                                                            ? header.column.getToggleSortingHandler()
                                                            : undefined
                                                    }
                                                    style={{
                                                        cursor: canSort ? "pointer" : undefined,
                                                        userSelect: canSort ? "none" : undefined,
                                                    }}
                                                >
                                                    <FlexRender header={header} />
                                                    {sortDirection === "asc"
                                                        ? " ▲"
                                                        : sortDirection === "desc"
                                                            ? " ▼"
                                                            : null}
                                                </span>
                                            )}

                                            {enableColumnResizing && header.column.getCanResize() && (
                                                <div
                                                    className={classNames?.resizeHandle}
                                                    onMouseDown={header.getResizeHandler()}
                                                    onTouchStart={header.getResizeHandler()}
                                                    data-resizing={header.column.getIsResizing() || undefined}
                                                    style={{
                                                        position: "absolute",
                                                        right: 0,
                                                        top: 0,
                                                        height: "100%",
                                                        width: 6,
                                                        cursor: "col-resize",
                                                        userSelect: "none",
                                                        touchAction: "none",
                                                    }}
                                                />
                                            )}
                                        </th>
                                    );
                                })}
                            </tr>
                        ))}

                        {enableColumnFilters && (
                            <tr className={classNames?.filterRow}>
                                {filterRowHeaders.map((header) => {
                                        const column = header.column;
                                        const variant = column.columnDef.meta?.filterVariant ?? "text";
                                        const canFilter = column.getCanFilter() && variant !== "none";

                                        return (
                                            <th
                                                key={header.id}
                                                data-pinned={column.getIsPinned() || undefined}
                                                style={getPinnedCellStyle(column, true)}
                                            >
                                                {canFilter && (
                                                    <ColumnFilterInput
                                                        column={column}
                                                        className={classNames?.filterInput}
                                                    />
                                                )}
                                            </th>
                                        );
                                    })}
                            </tr>
                        )}
                    </thead>

                    <tbody className={classNames?.tbody}>{bodyContent}</tbody>
                </table>
            </div>

            {enablePagination &&
                (renderPagination ? (
                    renderPagination(table)
                ) : (
                    <DataTablePagination
                        table={table}
                        pageSizeOptions={pageSizeOptions}
                        rowCount={rowCount}
                        classNames={classNames}
                    />
                ))}
        </div>
    );
}
