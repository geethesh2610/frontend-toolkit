import { useState } from "react";

import { DemoColumn, DemoStat, DemoText } from "../App.style";
import { useEventListener } from "../react-hooks/useEventListener";

export default function UseEventListenerExample() {
    const [lastKey, setLastKey] = useState<string | null>(null);

    useEventListener("keydown", (event) => {
        setLastKey(event.key);
    });

    return (
        <DemoColumn>
            <DemoText>
                Last key pressed: <DemoStat>{lastKey ?? "—"}</DemoStat>
            </DemoText>
            <DemoText $muted>Attached via a plain `window` keydown listener — try pressing any key.</DemoText>
        </DemoColumn>
    );
}
