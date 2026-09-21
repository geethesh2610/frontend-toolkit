import { useRef } from "react";

import { DemoColumn, DemoScrollBox, DemoStat, DemoText } from "../App.style";
import { useScrollPosition } from "../react-hooks/useScrollPosition";

export default function UseScrollPositionExample() {
    const scrollRef = useRef<HTMLDivElement>(null);
    const { y } = useScrollPosition({ target: scrollRef });

    return (
        <DemoColumn>
            <DemoScrollBox ref={scrollRef}>
                {Array.from({ length: 30 }, (_, index) => (
                    <div key={index}>Line {index + 1}</div>
                ))}
            </DemoScrollBox>
            <DemoText $muted>
                Scroll top: <DemoStat>{Math.round(y)}</DemoStat>px
            </DemoText>
        </DemoColumn>
    );
}
