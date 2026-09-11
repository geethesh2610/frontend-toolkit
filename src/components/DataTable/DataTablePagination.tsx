import type { ReactTable, RowData } from "@tanstack/react-table";

import type { DataTableClassNames } from "./DataTable.types";
import type { DataTableFeatures } from "./features";

export interface DataTablePaginationProps<TData extends RowData> {
    table: ReactTable<DataTableFeatures, TData>;
    pageSizeOptions: number[];
    /** Total row count across all pages, when known (manual pagination). */
    rowCount?: number;
    classNames?: DataTableClassNames;
}

export default function DataTablePagination<TData extends RowData>({
    table,
    pageSizeOptions,
    rowCount,
    classNames,
}: DataTablePaginationProps<TData>) {
    const { pageIndex, pageSize } = table.state.pagination;
    const pageCount = table.getPageCount();
    const totalRows = rowCount ?? table.getFilteredRowModel().rows.length;

    const rangeStart = totalRows === 0 ? 0 : pageIndex * pageSize + 1;
    const rangeEnd = Math.min(totalRows, (pageIndex + 1) * pageSize);

    return (
        <div
            className={classNames?.pagination}
            style={{
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 16,
                flexWrap: "wrap",
            }}
        >
            <label style={{ display: "flex", alignItems: "center", gap: 8 }}>
                Rows per page
                <select
                    className={classNames?.paginationSelect}
                    value={pageSize}
                    onChange={(event) => {
                        table.setPageSize(Number(event.target.value));
                    }}
                >
                    {pageSizeOptions.map((size) => (
                        <option key={size} value={size}>
                            {size}
                        </option>
                    ))}
                </select>
            </label>

            <span>
                {totalRows === 0
                    ? "No rows"
                    : `${rangeStart}–${rangeEnd} of ${totalRows}`}
            </span>

            <div style={{ display: "flex", gap: 4 }}>
                <button
                    type="button"
                    className={classNames?.paginationButton}
                    onClick={() => table.firstPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="First page"
                >
                    {"«"}
                </button>
                <button
                    type="button"
                    className={classNames?.paginationButton}
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                    aria-label="Previous page"
                >
                    {"‹"}
                </button>
                <span>
                    Page {pageCount === 0 ? 0 : pageIndex + 1} of {pageCount}
                </span>
                <button
                    type="button"
                    className={classNames?.paginationButton}
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Next page"
                >
                    {"›"}
                </button>
                <button
                    type="button"
                    className={classNames?.paginationButton}
                    onClick={() => table.lastPage()}
                    disabled={!table.getCanNextPage()}
                    aria-label="Last page"
                >
                    {"»"}
                </button>
            </div>
        </div>
    );
}
