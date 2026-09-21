import { useState } from "react";

import { DemoButton, DemoColumn, DemoRow, DemoStat, DemoText } from "../App.style";
import { useControllableState } from "../react-hooks/useControllableState";

function Counter({ value, onChange }: { value?: number; onChange?: (value: number) => void }) {
    const [count, setCount] = useControllableState<number>({ value, defaultValue: 0, onChange });

    return (
        <DemoRow>
            <DemoButton type="button" $variant="secondary" onClick={() => setCount((c) => c - 1)}>
                -1
            </DemoButton>
            <DemoStat>{count}</DemoStat>
            <DemoButton type="button" $variant="secondary" onClick={() => setCount((c) => c + 1)}>
                +1
            </DemoButton>
        </DemoRow>
    );
}

export default function UseControllableStateExample() {
    const [external, setExternal] = useState(10);

    return (
        <DemoColumn>
            <DemoText $muted>Uncontrolled — owns its own internal state:</DemoText>
            <Counter />
            <DemoText $muted>
                Controlled — the parent owns the value (currently <DemoStat>{external}</DemoStat>):
            </DemoText>
            <Counter value={external} onChange={setExternal} />
        </DemoColumn>
    );
}
