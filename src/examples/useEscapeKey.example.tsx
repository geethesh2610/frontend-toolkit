import { useState } from "react";

import { DemoBox, DemoButton, DemoColumn } from "../App.style";
import { useEscapeKey } from "../react-hooks/useEscapeKey";

export default function UseEscapeKeyExample() {
    const [open, setOpen] = useState(false);

    useEscapeKey(() => setOpen(false), { enabled: open });

    return (
        <DemoColumn>
            <DemoButton type="button" onClick={() => setOpen(true)}>
                Open panel
            </DemoButton>
            {open && <DemoBox>Press Escape (anywhere on the page) to close this.</DemoBox>}
        </DemoColumn>
    );
}
