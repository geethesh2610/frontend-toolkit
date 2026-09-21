import { memo, useEffect, useRef, useState } from "react";

import { DemoButton, DemoColumn, DemoInput, DemoRow, DemoStat, DemoText } from "../App.style";
import { useStableCallback } from "../react-hooks/useStableCallback";

const Child = memo(function Child({ onClick }: { onClick: () => void }) {
    // Counts renders via an effect (not during render itself) — bumps only
    // when `onClick`'s identity actually changes, which is exactly the
    // condition `React.memo` re-renders this component for.
    const [renderCount, setRenderCount] = useState(1);
    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
        }
        setRenderCount((count) => count + 1);
    }, [onClick]);

    return (
        <DemoButton type="button" $variant="secondary" onClick={onClick}>
            Child button (rendered {renderCount}×)
        </DemoButton>
    );
});

export default function UseStableCallbackExample() {
    const [label, setLabel] = useState("");
    const [clicks, setClicks] = useState(0);

    // Recreated every render (closes over the latest `label`), but the
    // function `useStableCallback` RETURNS never changes identity — so the
    // memoized Child doesn't re-render just because `label` changed.
    const handleClick = useStableCallback(() => {
        setClicks((c) => c + 1);
    });

    return (
        <DemoColumn>
            <DemoInput value={label} onChange={(event) => setLabel(event.target.value)} placeholder="Typing here re-renders the parent…" />
            <DemoRow>
                <Child onClick={handleClick} />
                <DemoText>
                    Parent clicks: <DemoStat>{clicks}</DemoStat>
                </DemoText>
            </DemoRow>
            <DemoText $muted>Type above — the parent re-renders every keystroke, but the child's render count stays at 1.</DemoText>
        </DemoColumn>
    );
}
