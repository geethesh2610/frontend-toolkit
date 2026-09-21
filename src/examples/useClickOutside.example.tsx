import { useRef, useState } from "react";

import { DemoBox, DemoButton, DemoColumn } from "../App.style";
import { useClickOutside } from "../react-hooks/useClickOutside";

export default function UseClickOutsideExample() {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useClickOutside(containerRef, () => setOpen(false), { enabled: open });

    return (
        <DemoColumn ref={containerRef}>
            <DemoButton type="button" onClick={() => setOpen((v) => !v)}>
                {open ? "Menu open" : "Open menu"}
            </DemoButton>
            {open && <DemoBox>Click anywhere outside this box to close it.</DemoBox>}
        </DemoColumn>
    );
}
