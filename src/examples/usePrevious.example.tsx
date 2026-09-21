import { useState } from "react";

import { DemoButton, DemoRow, DemoStat, DemoText } from "../App.style";
import { usePrevious } from "../react-hooks/usePrevious";

export default function UsePreviousExample() {
    const [count, setCount] = useState(0);
    const previous = usePrevious(count);

    return (
        <DemoRow>
            <DemoButton type="button" $variant="secondary" onClick={() => setCount((c) => c - 1)}>
                -1
            </DemoButton>
            <DemoText>
                Current <DemoStat>{count}</DemoStat> · Previous <DemoStat>{previous ?? "—"}</DemoStat>
            </DemoText>
            <DemoButton type="button" onClick={() => setCount((c) => c + 1)}>
                +1
            </DemoButton>
        </DemoRow>
    );
}
