import { useRef } from "react";
import type { ReactTable, RowData } from "@tanstack/react-table";

import { useClickOutside } from "../../react-hooks/useClickOutside";
import { useDisclosure } from "../../react-hooks/useDisclosure";

import type { DataTableClassNames } from "./DataTable.types";
import type { DataTableFeatures } from "./features";

export interface DataTableToolbarProps<TData extends RowData> {
    table: ReactTable<DataTableFeatures, TData>;
    enableGlobalFilter: boolean;
    searchValue: string;
    onSearchChange: (value: string) => void;
    searchPlaceholder: string;
    enableColumnVisibility: boolean;
    enableCsvExport: boolean;
    onExportCsv: () => void;
    classNames?: DataTableClassNames;
}

export default function DataTableToolbar<TData extends RowData>({
    table,
    enableGlobalFilter,
    searchValue,
    onSearchChange,
    searchPlaceholder,
    enableColumnVisibility,
    enableCsvExport,
    onExportCsv,
    classNames,
}: DataTableToolbarProps<TData>) {
    const menuRef = useRef<HTMLDivElement>(null);
    const { isOpen, toggle, close } = useDisclosure();

    useClickOutside(menuRef, close, { enabled: isOpen });

    const hideableColumns = table
        .getAllLeafColumns()
        .filter((column) => column.getCanHide());

    if (!enableGlobalFilter && !enableColumnVisibility && !enableCsvExport) {
        return null;
    }

    return (
        <div
            className={classNames?.toolbar}
            style={{ display: "flex", alignItems: "center", gap: 8 }}
        >
            {enableGlobalFilter && (
                <input
                    type="search"
                    className={classNames?.searchInput}
                    value={searchValue}
                    placeholder={searchPlaceholder}
                    onChange={(event) => onSearchChange(event.target.value)}
                    aria-label="Search"
                />
            )}

            <div style={{ marginLeft: "auto", position: "relative" }} ref={menuRef}>
                {enableColumnVisibility && (
                    <>
                        <button
                            type="button"
                            className={classNames?.columnsButton}
                            onClick={toggle}
                            aria-haspopup="true"
                            aria-expanded={isOpen}
                        >
                            Columns
                        </button>

                        {isOpen && (
                            <div
                                className={classNames?.columnsMenu}
                                role="menu"
                                style={{
                                    position: "absolute",
                                    top: "100%",
                                    right: 0,
                                    zIndex: 10,
                                }}
                            >
                                {hideableColumns.map((column) => (
                                    <label
                                        key={column.id}
                                        role="menuitemcheckbox"
                                        aria-checked={column.getIsVisible()}
                                        style={{
                                            display: "flex",
                                            alignItems: "center",
                                            gap: 8,
                                            whiteSpace: "nowrap",
                                        }}
                                    >
                                        <input
                                            type="checkbox"
                                            checked={column.getIsVisible()}
                                            onChange={column.getToggleVisibilityHandler()}
                                        />
                                        {typeof column.columnDef.header === "string"
                                            ? column.columnDef.header
                                            : column.id}
                                    </label>
                                ))}
                            </div>
                        )}
                    </>
                )}
            </div>

            {enableCsvExport && (
                <button
                    type="button"
                    className={classNames?.exportButton}
                    onClick={onExportCsv}
                >
                    Export CSV
                </button>
            )}
        </div>
    );
}
