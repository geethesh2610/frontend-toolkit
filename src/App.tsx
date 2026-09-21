import { useMemo, useState } from "react";

import DataTable from "./components/DataTable/DataTable";
import { createDataTableColumnHelper } from "./components/DataTable/features";
import Select from "./components/Select/Select";
import type { SelectOption } from "./components/Select/Select.types";
import { AxiosExampleSection } from "./examples/AxiosExampleSection";
import { TodoList as ContextTodoList } from "./state/context/TodoList";
import { TodoList as MobxTodoList } from "./state/mobx/TodoList";
import { TodoList as ReduxTodoList } from "./state/redux/TodoList";
import { TodoList as ZustandTodoList } from "./state/zustand/TodoList";
import { Button, type ButtonSize, type ButtonVariant } from "./styled-components/Button";
import { TableWrapper, dataTableClassNames } from "./styled-components/StyledDataTable/StyledDataTable.style";
import { SelectWrapper, selectClassNames } from "./styled-components/StyledSelect/StyledSelect.style";
import {
    ButtonVariantRow,
    ButtonVariantRows,
    FieldLabel,
    PageWrapper,
    SectionCard,
    SectionMeta,
    SectionTitle,
    SelectField,
    SelectGrid,
    StateCard,
    StateCardTitle,
    StateGrid,
    VariantLabel,
} from "./App.style";

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
        <PageWrapper>
            <AxiosExampleSection />

            <SectionCard>
                <SectionTitle>Full-featured (sort, filter, search, pin, resize, select, export)</SectionTitle>
                <SectionMeta>Selected: {selected.length} row(s)</SectionMeta>
                <TableWrapper>
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
                        classNames={dataTableClassNames}
                    />
                </TableWrapper>
            </SectionCard>

            <SectionCard>
                <SectionTitle>Virtualized, no pagination (10,000 rows)</SectionTitle>
                <TableWrapper>
                    <DataTable
                        columns={virtualColumns}
                        data={bigEmployees}
                        getRowId={(row) => row.id}
                        enablePagination={false}
                        enableRowVirtualization
                        containerHeight={480}
                        classNames={dataTableClassNames}
                    />
                </TableWrapper>
            </SectionCard>

            <SectionCard>
                <SectionTitle>Select (src/components/Select/) — every configuration</SectionTitle>
                <SelectGrid>
                    <SelectField>
                        <FieldLabel>Single, non-searchable</FieldLabel>
                        <SelectWrapper>
                            <Select
                                options={FRUIT_OPTIONS}
                                value={singleValue}
                                onChange={setSingleValue}
                                placeholder="Pick one…"
                                classNames={selectClassNames}
                            />
                        </SelectWrapper>
                    </SelectField>

                    <SelectField>
                        <FieldLabel>Multi, pills + checkboxes, searchable</FieldLabel>
                        <SelectWrapper>
                            <Select
                                multiple
                                searchable
                                options={FRUIT_OPTIONS}
                                value={multiPillsValue}
                                onChange={setMultiPillsValue}
                                placeholder="Pick some…"
                                classNames={selectClassNames}
                            />
                        </SelectWrapper>
                    </SelectField>

                    <SelectField>
                        <FieldLabel>Multi, "N selected" summary, no checkboxes</FieldLabel>
                        <SelectWrapper>
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
                        </SelectWrapper>
                    </SelectField>

                    <SelectField>
                        <FieldLabel>Native (real &lt;select&gt;, grouped)</FieldLabel>
                        <SelectWrapper>
                            <Select
                                variant="native"
                                options={FRUIT_OPTIONS}
                                value={nativeValue}
                                onChange={setNativeValue}
                                placeholder="Pick one…"
                                classNames={selectClassNames}
                            />
                        </SelectWrapper>
                    </SelectField>

                    <SelectField>
                        <FieldLabel>Creatable (searchable, add your own)</FieldLabel>
                        <SelectWrapper>
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
                        </SelectWrapper>
                    </SelectField>

                    <SelectField>
                        <FieldLabel>Async/remote search (400ms simulated latency)</FieldLabel>
                        <SelectWrapper>
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
                        </SelectWrapper>
                    </SelectField>

                    <SelectField>
                        <FieldLabel>Virtualized (5,000 options)</FieldLabel>
                        <SelectWrapper>
                            <Select
                                searchable
                                enableVirtualization
                                options={BIG_OPTION_LIST}
                                value={virtualValue}
                                onChange={setVirtualValue}
                                placeholder="Search 5,000 options…"
                                classNames={selectClassNames}
                            />
                        </SelectWrapper>
                    </SelectField>
                </SelectGrid>
            </SectionCard>

            <SectionCard>
                <SectionTitle>Button (src/styled-components/Button/) — every variant &amp; size</SectionTitle>
                <ButtonVariantRows>
                    {BUTTON_VARIANTS.map((variant) => (
                        <ButtonVariantRow key={variant}>
                            <VariantLabel>{variant}</VariantLabel>
                            {BUTTON_SIZES.map((size) => (
                                <Button key={size} variant={variant} size={size}>
                                    {variant} / {size}
                                </Button>
                            ))}
                            <Button variant={variant} disabled>
                                Disabled
                            </Button>
                        </ButtonVariantRow>
                    ))}
                    <div>
                        <Button variant="primary" fullWidth>
                            Full width primary
                        </Button>
                    </div>
                </ButtonVariantRows>
            </SectionCard>

            <SectionCard>
                <SectionTitle>State management templates (src/state/) — same todo-list domain, four ways</SectionTitle>
                <StateGrid>
                    <StateCard>
                        <StateCardTitle>Context + useReducer</StateCardTitle>
                        <ContextTodoList />
                    </StateCard>
                    <StateCard>
                        <StateCardTitle>Zustand</StateCardTitle>
                        <ZustandTodoList />
                    </StateCard>
                    <StateCard>
                        <StateCardTitle>Redux Toolkit</StateCardTitle>
                        <ReduxTodoList />
                    </StateCard>
                    <StateCard>
                        <StateCardTitle>MobX</StateCardTitle>
                        <MobxTodoList />
                    </StateCard>
                </StateGrid>
            </SectionCard>
        </PageWrapper>
    );
};
