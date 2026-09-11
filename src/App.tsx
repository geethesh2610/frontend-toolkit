import { useMemo, useState } from "react";

import DataTable from "./components/DataTable/DataTable";
import { createDataTableColumnHelper } from "./components/DataTable/features";

interface Employee {
    id: string;
    name: string;
    email: string;
    department: string;
    role: string;
    salary: number;
    active: boolean;
    joinedAt: string;
}

const DEPARTMENTS = ["Engineering", "Sales", "Marketing", "Support", "Finance"] as const;
const ROLES = ["Manager", "Lead", "Senior", "Junior", "Intern"] as const;
const FIRST_NAMES = ["Ada", "Grace", "Alan", "Linus", "Margaret", "Dennis", "Barbara", "Ken"];
const LAST_NAMES = ["Lovelace", "Hopper", "Turing", "Torvalds", "Hamilton", "Ritchie", "Liskov", "Thompson"];

function generateEmployees(count: number): Employee[] {
    return Array.from({ length: count }, (_, index) => {
        const first = FIRST_NAMES[index % FIRST_NAMES.length];
        const last = LAST_NAMES[(index * 3) % LAST_NAMES.length];
        return {
            id: String(index + 1),
            name: `${first} ${last} ${index + 1}`,
            email: `${first.toLowerCase()}.${last.toLowerCase()}${index}@example.com`,
            department: DEPARTMENTS[index % DEPARTMENTS.length],
            role: ROLES[index % ROLES.length],
            salary: 50000 + ((index * 1337) % 120000),
            active: index % 4 !== 0,
            joinedAt: new Date(2015, index % 12, (index % 28) + 1).toISOString().slice(0, 10),
        };
    });
}

const helper = createDataTableColumnHelper<Employee>();

const smallColumns = helper.columns([
    helper.accessor("name", {
        header: "Name",
        size: 200,
        meta: { filterVariant: "text" },
    }),
    helper.accessor("email", { header: "Email", size: 240 }),
    helper.accessor("department", {
        header: "Department",
        size: 160,
        meta: {
            filterVariant: "select",
            filterOptions: DEPARTMENTS.map((d) => ({ label: d, value: d })),
        },
    }),
    helper.accessor("role", { header: "Role", size: 140 }),
    helper.accessor("salary", {
        header: "Salary",
        size: 140,
        cell: (info) => `$${info.getValue().toLocaleString()}`,
        meta: { filterVariant: "number", align: "right" },
    }),
    helper.accessor("active", {
        header: "Active",
        size: 100,
        cell: (info) => (info.getValue() ? "Yes" : "No"),
    }),
    helper.accessor("joinedAt", { header: "Joined", size: 140 }),
]);

const virtualColumns = helper.columns([
    helper.accessor("name", { header: "Name", size: 220 }),
    helper.accessor("department", { header: "Department", size: 160 }),
    helper.accessor("role", { header: "Role", size: 140 }),
    helper.accessor("salary", {
        header: "Salary",
        size: 140,
        cell: (info) => `$${info.getValue().toLocaleString()}`,
    }),
]);

export const App = () => {
    const employees = useMemo(() => generateEmployees(60), []);
    const bigEmployees = useMemo(() => generateEmployees(10000), []);
    const [selected, setSelected] = useState<Employee[]>([]);

    return (
        <div style={{ padding: 24, display: "flex", flexDirection: "column", gap: 40 }}>
            <section>
                <h2>Full-featured (sort, filter, search, pin, resize, select, export)</h2>
                <p>Selected: {selected.length} row(s)</p>
                <DataTable
                    columns={smallColumns}
                    data={employees}
                    getRowId={(row) => row.id}
                    enableColumnFilters
                    enableColumnPinning
                    enableColumnResizing
                    enableColumnVisibility
                    enableRowSelection
                    enableCsvExport
                    defaultColumnPinning={{ start: ["__select__", "name"], end: [] }}
                    onRowSelectionChange={setSelected}
                    classNames={{
                        table: "demo-table",
                        th: "demo-th",
                        td: "demo-td",
                        toolbar: "demo-toolbar",
                        pagination: "demo-pagination",
                    }}
                />
            </section>

            <section>
                <h2>Virtualized, no pagination (10,000 rows)</h2>
                <DataTable
                    columns={virtualColumns}
                    data={bigEmployees}
                    getRowId={(row) => row.id}
                    enablePagination={false}
                    enableRowVirtualization
                    containerHeight={480}
                    classNames={{ table: "demo-table", th: "demo-th", td: "demo-td" }}
                />
            </section>

            <style>{`
                .demo-table { border-collapse: collapse; font-family: system-ui, sans-serif; font-size: 14px; }
                .demo-th, .demo-td { border: 1px solid #ddd; padding: 6px 10px; background: white; text-align: left; }
                .demo-th { background: #f5f5f5; font-weight: 600; }
                .demo-th[data-sorted] { background: #e8f0fe; }
                .demo-toolbar { margin-bottom: 8px; }
                .demo-pagination { margin-top: 8px; }
                [data-pinned] { background: white; }
                .demo-th[data-pinned] { background: #f5f5f5; }
            `}</style>
        </div>
    );
};
