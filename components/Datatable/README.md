# Global DataTable

This is intentionally a **component folder**, not a package.

Copy this folder into any React + TypeScript application:

```text
src/
└── components/
    └── DataTable/
```

Then:

```tsx
import { DataTable } from '@/components/DataTable'
```

## Required dependencies

The application needs:

```bash
npm install @tanstack/react-table @tanstack/react-virtual
```

No Axios, React Query, Redux, Zustand, shadcn, MUI, Chakra or other UI library is required.

## Basic usage

```tsx
<DataTable
  data={users}
  columns={columns}
/>
```

## Recommended server-side 10,000-row setup

```tsx
<DataTable
  data={rows}
  columns={columns}
  initialState={{
    columnPinning: {
      left: ['select', 'id'],
      right: ['actions'],
    },
  }}
  config={{
    search: {
      mode: 'server',
      debounceMs: 300,
      placeholder: 'Search users...',
    },
    sorting: {
      mode: 'server',
      enableMultiSort: true,
    },
    filtering: {
      mode: 'server',
    },
    pagination: {
      mode: 'server',
      rowCount: totalRows,
      state: pagination,
      onChange: setPagination,
      pageSizeOptions: [10, 20, 30, 40, 50],
    },
    rowSelection: {
      mode: 'multiple',
    },
    columnVisibility: true,
    columnOrdering: true,
    columnSizing: true,
    columnPinning: true,
  }}
/>
```

## Important server-side rule

The DataTable does **not** call your API.

Your page/query layer owns:

```text
DataTable state
    ↓
API/query
    ↓
rows + totalRows
    ↓
DataTable
```

For example, when the user changes page size from 10 to 50:

```text
pageIndex = 0
pageSize = 50
```

Your API/query layer should request:

```text
page = 1
pageSize = 50
```

When the user sorts:

```text
sorting = [{ id: 'name', desc: false }]
```

your API layer translates that state into its own API parameters.

## Column filters

```tsx
const columns: DataTableColumnDef<User>[] = [
  {
    accessorKey: 'name',
    header: 'Name',
    meta: {
      filter: {
        type: 'text',
        placeholder: 'Search name',
      },
    },
  },
  {
    accessorKey: 'role',
    header: 'Role',
    meta: {
      filter: {
        type: 'select',
        options: [
          { label: 'Admin', value: 'admin' },
          { label: 'User', value: 'user' },
        ],
      },
    },
  },
]
```

Supported built-in filter UI types:

- text
- number
- date
- date-range
- select
- multi-select
- boolean
- custom escape hatch

For server-side filtering, the filter state is emitted to your application. The API decides how to interpret it.

## Pinning

```tsx
initialState={{
  columnPinning: {
    left: ['select', 'id'],
    right: ['actions'],
  },
}}
```

The table does not assume that "first two" or "last one" are special. Use stable column IDs. This is safer because applications can reorder or hide columns.

## Pagination

The built-in pagination renders:

```text
Showing 1–10 of 10,000

[First] [Previous] [1] [2] [3] … [1000] [Next] [Last]

Rows per page: [10]
```

Page sizes default to:

```ts
[10, 20, 30, 40, 50]
```

and can be overridden.

## Virtualization

```tsx
<DataTable
  data={largeData}
  columns={columns}
  config={{
    virtualization: {
      height: 600,
      estimateRowHeight: 42,
      overscan: 10,
    },
  }}
/>
```

Virtualization is independent of pagination. It reduces DOM work; it does not replace server-side data operations.

## UI library independence

Replace the built-in UI using `renderers`:

```tsx
<DataTable
  ...
  renderers={{
    search: ({ table }) => <YourSearch table={table} />,
    filters: ({ table }) => <YourFilters table={table} />,
    pagination: ({ table }) => <YourPagination table={table} />,
    loading: <YourLoading />,
    empty: <YourEmpty />,
    error: <YourError />,
  }}
/>
```

## Performance expectations

For large datasets:

- Prefer server-side pagination when the full dataset should not live in the browser.
- Prefer server-side sorting/filtering/search when pagination is server-side.
- Keep `columns` stable.
- Keep `data` stable unless the actual rows changed.
- Use virtualization when rendering many rows locally.
- Memoize expensive custom cell components only when profiling shows a need.
- Do not duplicate TanStack row models in React state.

## Architecture

```text
DataTable
 ├── State wiring
 ├── TanStack Table
 ├── Toolbar
 │    ├── Search
 │    ├── Filters
 │    └── Column visibility
 ├── Header
 ├── Body
 │    └── Row
 ├── Pagination
 └── Virtualization
```
