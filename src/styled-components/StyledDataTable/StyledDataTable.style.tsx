/**
 * StyledDataTable styles
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   DataTable (src/components/DataTable/) is intentionally headless — it
 *   renders a real <table> but ships no colors/borders of its own, styled
 *   entirely through the string class names passed to its `classNames`
 *   prop (see DataTable.tsx's top comment).
 *
 *   This file is the one place that actually styles it with
 *   styled-components: `TableWrapper` targets the class names in
 *   `dataTableClassNames` via nested selectors (stylis automatically scopes
 *   them under the wrapper's own generated class), and every consumer in
 *   this toolkit spreads `dataTableClassNames` into `<DataTable classNames>`
 *   so every table in the app looks the same by default.
 *
 * USAGE
 *   import DataTable from '@/components/DataTable/DataTable'
 *   import { TableWrapper, dataTableClassNames } from '@/styled-components/StyledDataTable/StyledDataTable.style'
 *
 *   <TableWrapper>
 *     <DataTable columns={columns} data={data} classNames={dataTableClassNames} />
 *   </TableWrapper>
 *
 *   Need to override/add a slot for one table? Spread and extend:
 *   `classNames={{ ...dataTableClassNames, td: `${dataTableClassNames.td} text-right` }}`
 * ----------------------------------------------------------------------------
 */

import styled from 'styled-components'

import type { DataTableClassNames } from '../../components/DataTable/DataTable.types'

export const dataTableClassNames: DataTableClassNames = {
    toolbar: 'styled-datatable-toolbar',
    searchInput: 'styled-datatable-search',
    columnsButton: 'styled-datatable-btn',
    exportButton: 'styled-datatable-btn',
    tableWrapper: 'styled-datatable-scroll',
    table: 'styled-datatable-table',
    thead: 'styled-datatable-thead',
    th: 'styled-datatable-th',
    filterRow: 'styled-datatable-filter-row',
    filterInput: 'styled-datatable-filter-input',
    tr: 'styled-datatable-tr',
    td: 'styled-datatable-td',
    emptyState: 'styled-datatable-empty',
    pagination: 'styled-datatable-pagination',
    paginationButton: 'styled-datatable-btn',
    paginationSelect: 'styled-datatable-filter-input',
}

export const TableWrapper = styled.div`
    font-family: system-ui, sans-serif;
    font-size: 14px;

    .styled-datatable-toolbar {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-bottom: 8px;
    }

    .styled-datatable-search,
    .styled-datatable-filter-input {
        padding: 6px 10px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        font: inherit;
    }

    .styled-datatable-btn {
        padding: 6px 10px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background: #ffffff;
        cursor: pointer;

        &:hover {
            background: #f1f5f9;
        }
    }

    .styled-datatable-scroll {
        overflow-x: auto;
        border: 1px solid #e2e8f0;
        border-radius: 8px;
    }

    .styled-datatable-table {
        width: 100%;
        border-collapse: collapse;
    }

    .styled-datatable-thead {
        background: #f8fafc;
    }

    .styled-datatable-th,
    .styled-datatable-td {
        border-bottom: 1px solid #e2e8f0;
        padding: 8px 12px;
        text-align: left;
        background: #ffffff;
    }

    .styled-datatable-th {
        background: #f8fafc;
        font-weight: 600;
        white-space: nowrap;
    }

    .styled-datatable-th[data-sorted] {
        background: #e0e7ff;
    }

    .styled-datatable-tr:hover .styled-datatable-td {
        background: #f8fafc;
    }

    [data-pinned] {
        background: #ffffff;
    }

    .styled-datatable-th[data-pinned] {
        background: #f8fafc;
    }

    .styled-datatable-filter-row .styled-datatable-td,
    .styled-datatable-filter-row .styled-datatable-th {
        padding: 4px 8px;
    }

    .styled-datatable-empty {
        padding: 24px;
        text-align: center;
        color: #94a3b8;
    }

    .styled-datatable-pagination {
        display: flex;
        align-items: center;
        gap: 8px;
        margin-top: 8px;
    }
`
