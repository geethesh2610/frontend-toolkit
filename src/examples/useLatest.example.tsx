import { useEffect, useState } from "react";

import { DemoColumn, DemoInput, DemoScrollBox, DemoText } from "../App.style";
import { useLatest } from "../react-hooks/useLatest";

export default function UseLatestExample() {
    const [text, setText] = useState("hello");
    const [log, setLog] = useState<string[]>([]);
    const latestText = useLatest(text);

    // Set up ONCE — never re-subscribes when `text` changes, yet always
    // reads the CURRENT value through the ref on every tick.
    useEffect(() => {
        const id = setInterval(() => {
            setLog((prev) => [...prev.slice(-6), `tick read: "${latestText.current}"`]);
        }, 1000);
        return () => clearInterval(id);
    }, [latestText]);

    return (
        <DemoColumn>
            <DemoInput value={text} onChange={(event) => setText(event.target.value)} placeholder="Type while it's running…" />
            <DemoScrollBox>
                {log.length === 0 ? (
                    <DemoText $muted>Waiting for the first tick…</DemoText>
                ) : (
                    log.map((line, index) => <div key={index}>{line}</div>)
                )}
            </DemoScrollBox>
        </DemoColumn>
    );
}
