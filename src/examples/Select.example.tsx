import { useState } from "react";

import { DemoColumn, DemoText } from "../App.style";
import Select from "../components/Select/Select";

const options = [
    { value: "js", label: "JavaScript" },
    { value: "ts", label: "TypeScript" },
    { value: "py", label: "Python" },
    { value: "go", label: "Go" },
    { value: "rs", label: "Rust" },
];

export default function SelectExample() {
    const [value, setValue] = useState<string | null>(null);

    return (
        <DemoColumn>
            <Select
                options={options}
                value={value}
                onChange={setValue}
                searchable
                placeholder="Choose a language…"
                classNames={{
                    trigger: "flex items-center justify-between gap-2 px-2.5 py-1.5 text-[12.5px] border border-[var(--ft-border)] rounded-md bg-[var(--ft-bg)] cursor-pointer",
                    dropdown: "mt-1 border border-[var(--ft-border)] rounded-md bg-[var(--ft-bg-elevated)] shadow-lg overflow-hidden text-[12.5px]",
                    option: "px-2.5 py-1.5 cursor-pointer data-[active=true]:bg-[var(--ft-accent-tint-2)]",
                    searchInput: "w-full px-2.5 py-1.5 text-[12.5px] border-b border-[var(--ft-border)] outline-none bg-transparent",
                }}
            />
            <DemoText $muted>Selected: {value ?? "none"}</DemoText>
        </DemoColumn>
    );
}
