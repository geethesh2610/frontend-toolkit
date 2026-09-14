import { useMemo, useState } from "react";

import DataTable from "./components/DataTable/DataTable";
import { createDataTableColumnHelper } from "./components/DataTable/features";
import Select from "./components/Select/Select";
import type { SelectOption } from "./components/Select/Select.types";
import { TodoList as ContextTodoList } from "./state/context/TodoList";
import { TodoList as MobxTodoList } from "./state/mobx/TodoList";
import { TodoList as ReduxTodoList } from "./state/redux/TodoList";
import { TodoList as ZustandTodoList } from "./state/zustand/TodoList";
import { Button, type ButtonSize, type ButtonVariant } from "./styled-components/Button";

const BUTTON_VARIANTS: ButtonVariant[] = ["primary", "secondary", "ghost"];
const BUTTON_SIZES: ButtonSize[] = ["sm", "md", "lg"];

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

const FRUIT_OPTIONS: SelectOption<string>[] = [
    { value: "apple", label: "Apple", group: "Fruit" },
    { value: "banana", label: "Banana", group: "Fruit" },
    { value: "mango", label: "Mango", group: "Fruit" },
    { value: "carrot", label: "Carrot", group: "Vegetable" },
    { value: "potato", label: "Potato", group: "Vegetable" },
    { value: "spinach", label: "Spinach", group: "Vegetable", disabled: true },
];

const BIG_OPTION_LIST: SelectOption<number>[] = Array.from({ length: 5000 }, (_, index) => ({
    value: index,
    label: `Option ${index + 1}`,
}));

const selectClassNames = {
    root: "demo-select",
    trigger: "demo-select-trigger",
    dropdown: "demo-select-dropdown",
    option: "demo-select-option",
    groupHeading: "demo-select-group",
    pill: "demo-select-pill",
    pillRemoveButton: "demo-select-pill-remove",
    clearButton: "demo-select-clear",
    chevron: "demo-select-chevron",
    searchInput: "demo-select-search",
    placeholder: "demo-select-placeholder",
    valueSummary: "demo-select-summary",
    emptyState: "demo-select-empty",
    loadingState: "demo-select-empty",
    createOption: "demo-select-create",
};

function simulateUserSearch(query: string): Promise<SelectOption<string>[]> {
    const pool = ["Ada Lovelace", "Grace Hopper", "Alan Turing", "Linus Torvalds", "Margaret Hamilton"];
    const matches = pool.filter((name) => name.toLowerCase().includes(query.toLowerCase()));
    return new Promise((resolve) => setTimeout(() => resolve(matches.map((name) => ({ value: name, label: name }))), 400));
}

export const App = () => {
    const employees = useMemo(() => generateEmployees(60), []);
    const bigEmployees = useMemo(() => generateEmployees(10000), []);
    const [selected, setSelected] = useState<Employee[]>([]);

    const [singleValue, setSingleValue] = useState<string | null>(null);
    const [multiPillsValue, setMultiPillsValue] = useState<string[]>([]);
    const [multiSummaryValue, setMultiSummaryValue] = useState<string[]>([]);
    const [nativeValue, setNativeValue] = useState<string | null>(null);
    const [virtualValue, setVirtualValue] = useState<number | null>(null);

    const [creatableOptions, setCreatableOptions] = useState<SelectOption<string>[]>(FRUIT_OPTIONS);
    const [creatableValue, setCreatableValue] = useState<string | null>(null);

    const [asyncOptions, setAsyncOptions] = useState<SelectOption<string>[]>([]);
    const [asyncLoading, setAsyncLoading] = useState(false);
    const [asyncValue, setAsyncValue] = useState<string | null>(null);

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

            <section>
                <h2>Select (src/components/Select/) — every configuration</h2>
                <div className="select-demo-grid">
                    <div>
                        <label>Single, non-searchable</label>
                        <Select
                            options={FRUIT_OPTIONS}
                            value={singleValue}
                            onChange={setSingleValue}
                            placeholder="Pick one…"
                            classNames={selectClassNames}
                        />
                    </div>

                    <div>
                        <label>Multi, pills + checkboxes, searchable</label>
                        <Select
                            multiple
                            searchable
                            options={FRUIT_OPTIONS}
                            value={multiPillsValue}
                            onChange={setMultiPillsValue}
                            placeholder="Pick some…"
                            classNames={selectClassNames}
                        />
                    </div>

                    <div>
                        <label>Multi, "N selected" summary, no checkboxes</label>
                        <Select
                            multiple
                            showSelectedAsPills={false}
                            showCheckboxes={false}
                            options={FRUIT_OPTIONS}
                            value={multiSummaryValue}
                            onChange={setMultiSummaryValue}
                            placeholder="Pick some…"
                            classNames={selectClassNames}
                        />
                    </div>

                    <div>
                        <label>Native (real &lt;select&gt;, grouped)</label>
                        <Select
                            variant="native"
                            options={FRUIT_OPTIONS}
                            value={nativeValue}
                            onChange={setNativeValue}
                            placeholder="Pick one…"
                            classNames={selectClassNames}
                        />
                    </div>

                    <div>
                        <label>Creatable (searchable, add your own)</label>
                        <Select
                            searchable
                            enableCreatable
                            options={creatableOptions}
                            value={creatableValue}
                            onChange={setCreatableValue}
                            onCreateOption={(text) => {
                                const newOption = { value: text, label: text };
                                setCreatableOptions((prev) => [...prev, newOption]);
                                return newOption.value;
                            }}
                            placeholder="Pick or create…"
                            classNames={selectClassNames}
                        />
                    </div>

                    <div>
                        <label>Async/remote search (400ms simulated latency)</label>
                        <Select
                            searchable
                            isLoading={asyncLoading}
                            options={asyncOptions}
                            value={asyncValue}
                            onChange={setAsyncValue}
                            onSearch={(query) => {
                                setAsyncLoading(true);
                                simulateUserSearch(query).then((results) => {
                                    setAsyncOptions(results);
                                    setAsyncLoading(false);
                                });
                            }}
                            placeholder="Search a name…"
                            classNames={selectClassNames}
                        />
                    </div>

                    <div>
                        <label>Virtualized (5,000 options)</label>
                        <Select
                            searchable
                            enableVirtualization
                            options={BIG_OPTION_LIST}
                            value={virtualValue}
                            onChange={setVirtualValue}
                            placeholder="Search 5,000 options…"
                            classNames={selectClassNames}
                        />
                    </div>
                </div>
            </section>

            <section>
                <h2>Button (src/styled-components/Button/) — every variant &amp; size</h2>
                <div style={{ display: "flex", flexDirection: "column", gap: 16, fontFamily: "system-ui, sans-serif", fontSize: 14 }}>
                    {BUTTON_VARIANTS.map((variant) => (
                        <div key={variant} style={{ display: "flex", alignItems: "center", gap: 12 }}>
                            <span style={{ width: 80, textTransform: "capitalize" }}>{variant}</span>
                            {BUTTON_SIZES.map((size) => (
                                <Button key={size} variant={variant} size={size}>
                                    {variant} / {size}
                                </Button>
                            ))}
                            <Button variant={variant} disabled>
                                Disabled
                            </Button>
                        </div>
                    ))}
                    <div>
                        <Button variant="primary" fullWidth>
                            Full width primary
                        </Button>
                    </div>
                </div>
            </section>

            <section>
                <h2>State management templates (src/state/) — same todo-list domain, four ways</h2>
                <div className="state-demo-grid">
                    <div>
                        <h3>Context + useReducer</h3>
                        <ContextTodoList />
                    </div>
                    <div>
                        <h3>Zustand</h3>
                        <ZustandTodoList />
                    </div>
                    <div>
                        <h3>Redux Toolkit</h3>
                        <ReduxTodoList />
                    </div>
                    <div>
                        <h3>MobX</h3>
                        <MobxTodoList />
                    </div>
                </div>
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
                .state-demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 24px; font-family: system-ui, sans-serif; font-size: 14px; }
                .state-demo-grid ul { list-style: none; padding: 0; }
                .state-demo-grid li { display: flex; align-items: center; justify-content: space-between; gap: 8px; padding: 2px 0; }

                .select-demo-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 24px; font-family: system-ui, sans-serif; font-size: 14px; }
                .select-demo-grid label { display: block; margin-bottom: 4px; font-weight: 600; }
                .demo-select { display: inline-block; width: 100%; }
                .demo-select-trigger { display: flex; align-items: center; flex-wrap: wrap; gap: 4px; min-height: 36px; padding: 4px 8px; border: 1px solid #ccc; border-radius: 4px; background: white; cursor: pointer; }
                .demo-select-search { border: none; outline: none; flex: 1; min-width: 60px; font: inherit; }
                .demo-select-placeholder { color: #888; }
                .demo-select-summary { color: #111; }
                .demo-select-pill { display: inline-flex; align-items: center; gap: 4px; background: #e8f0fe; border-radius: 12px; padding: 2px 6px 2px 10px; font-size: 12px; }
                .demo-select-pill-remove { border: none; background: none; cursor: pointer; font-size: 14px; line-height: 1; padding: 0; }
                .demo-select-clear, .demo-select-chevron { border: none; background: none; cursor: pointer; font-size: 12px; color: #666; margin-left: 4px; }
                .demo-select-dropdown { background: white; border: 1px solid #ccc; border-radius: 4px; margin-top: 4px; box-shadow: 0 4px 12px rgba(0,0,0,0.1); overflow: hidden; }
                .demo-select-option { padding: 6px 10px; cursor: pointer; display: flex; align-items: center; gap: 8px; }
                .demo-select-option[data-active] { background: #f0f4ff; }
                .demo-select-option[data-selected] { font-weight: 600; }
                .demo-select-option[data-disabled] { color: #aaa; cursor: not-allowed; }
                .demo-select-group { padding: 6px 10px 2px; font-size: 11px; text-transform: uppercase; color: #888; }
                .demo-select-create { padding: 6px 10px; cursor: pointer; font-style: italic; color: #3355dd; }
                .demo-select-empty { padding: 8px 10px; color: #888; }
            `}</style>
        </div>
    );
};
