import { useState } from "react";

import { DemoButton, DemoColumn, DemoRow, DemoScrollBox, DemoText } from "../App.style";
import { useWebWorker } from "../react-hooks/useWebWorker";

export default function UseWebWorkerExample() {
    const [status, setStatus] = useState<"idle" | "running" | "done">("idle");
    const [result, setResult] = useState<number[] | null>(null);
    const { run } = useWebWorker<number[], number[]>(() => new Worker(new URL("./demoWorker.ts", import.meta.url), { type: "module" }));

    const handleRun = async () => {
        setStatus("running");
        const input = Array.from({ length: 20 }, () => Math.round(Math.random() * 1000));
        const sorted = await run(input);
        setResult(sorted);
        setStatus("done");
    };

    return (
        <DemoColumn>
            <DemoRow>
                <DemoButton type="button" onClick={handleRun} disabled={status === "running"}>
                    {status === "running" ? "Sorting on worker…" : "Sort 20 random numbers"}
                </DemoButton>
                <DemoText $muted>Runs on a separate thread — the UI never blocks.</DemoText>
            </DemoRow>
            {result && <DemoScrollBox>{result.join(", ")}</DemoScrollBox>}
        </DemoColumn>
    );
}
