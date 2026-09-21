import DataTable from "../components/DataTable/DataTable";
import { createDataTableColumnHelper } from "../components/DataTable/features";

interface Person {
    id: string;
    name: string;
    role: string;
    age: number;
}

const people: Person[] = [
    { id: "1", name: "Ava Patel", role: "Engineer", age: 29 },
    { id: "2", name: "Liam Chen", role: "Designer", age: 34 },
    { id: "3", name: "Noah Brooks", role: "PM", age: 41 },
    { id: "4", name: "Mia Torres", role: "Engineer", age: 26 },
    { id: "5", name: "Sofia Reyes", role: "QA", age: 31 },
    { id: "6", name: "Ethan Walsh", role: "Designer", age: 38 },
];

const helper = createDataTableColumnHelper<Person>();
const columns = helper.columns([
    helper.accessor("name", { header: "Name" }),
    helper.accessor("role", { header: "Role" }),
    helper.accessor("age", { header: "Age" }),
]);

export default function DataTableExample() {
    return (
        <DataTable
            columns={columns}
            data={people}
            getRowId={(row) => row.id}
            defaultPagination={{ pageIndex: 0, pageSize: 4 }}
            classNames={{
                table: "w-full border-collapse text-[12.5px]",
                thead: "text-left",
                th: "px-2.5 py-2 font-semibold border-b border-[var(--ft-border)]",
                tr: "border-b border-[var(--ft-border)] last:border-0",
                td: "px-2.5 py-2",
            }}
        />
    );
}
