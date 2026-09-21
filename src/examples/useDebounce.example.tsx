import { useState } from "react";

import { DemoColumn, DemoInput, DemoStat, DemoText } from "../App.style";
import { useDebounce } from "../react-hooks/useDebounce";

export default function UseDebounceExample() {
    const [text, setText] = useState("");
    const debounced = useDebounce(text, 400);

    return (
        <DemoColumn>
            <DemoInput placeholder="Type something…" value={text} onChange={(event) => setText(event.target.value)} />
            <DemoText $muted>
                Live: <DemoStat>{text || "—"}</DemoStat>
            </DemoText>
            <DemoText $muted>
                Debounced (400ms): <DemoStat>{debounced || "—"}</DemoStat>
            </DemoText>
        </DemoColumn>
    );
}
