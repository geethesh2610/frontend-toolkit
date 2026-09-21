import { useRef, useState } from "react";

import { DemoColumn, DemoScrollBox, DemoStat, DemoText } from "../App.style";
import { useIntersectionObserver } from "../react-hooks/useIntersectionObserver";

export default function UseIntersectionObserverExample() {
    const [container, setContainer] = useState<HTMLDivElement | null>(null);
    const targetRef = useRef<HTMLDivElement>(null);
    const { isIntersecting } = useIntersectionObserver(targetRef, { root: container, threshold: 0.6 });

    return (
        <DemoColumn>
            <DemoScrollBox ref={setContainer}>
                <div style={{ height: 160 }}>Scroll down…</div>
                <div
                    ref={targetRef}
                    style={{
                        padding: "10px 0",
                        textAlign: "center",
                        border: "1px dashed var(--ft-border-dashed)",
                        borderRadius: 6,
                    }}
                >
                    👀 target
                </div>
                <div style={{ height: 160 }}>…and back up.</div>
            </DemoScrollBox>
            <DemoText $muted>
                Target visible: <DemoStat>{isIntersecting ? "yes" : "no"}</DemoStat>
            </DemoText>
        </DemoColumn>
    );
}
