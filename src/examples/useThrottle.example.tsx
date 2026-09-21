import { useState } from "react";

import { DemoColumn, DemoStat, DemoText } from "../App.style";
import { useThrottle } from "../react-hooks/useThrottle";

export default function UseThrottleExample() {
    const [value, setValue] = useState(0);
    const throttled = useThrottle(value, 400);

    return (
        <DemoColumn>
            <input
                type="range"
                min={0}
                max={100}
                value={value}
                onChange={(event) => setValue(Number(event.target.value))}
                style={{ width: "100%" }}
            />
            <DemoText $muted>
                Raw: <DemoStat>{value}</DemoStat> · Throttled (400ms): <DemoStat>{throttled}</DemoStat>
            </DemoText>
            <DemoText $muted>Drag quickly — the throttled number lags behind, updating at most once every 400ms.</DemoText>
        </DemoColumn>
    );
}
