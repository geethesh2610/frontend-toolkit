import { useRef, useState } from "react";

import { DemoBox, DemoButton, DemoColumn, DemoRow, DemoText } from "../App.style";
import { useFocusTrap } from "../react-hooks/useFocusTrap";

export default function UseFocusTrapExample() {
    const [open, setOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useFocusTrap(containerRef, { enabled: open });

    return (
        <DemoColumn>
            <DemoButton type="button" onClick={() => setOpen(true)}>
                Activate trap
            </DemoButton>
            {open && (
                <DemoBox ref={containerRef}>
                    <DemoText style={{ marginBottom: 8 }}>Tab/Shift+Tab cycles only through these three buttons:</DemoText>
                    <DemoRow>
                        <DemoButton type="button" $variant="secondary">
                            First
                        </DemoButton>
                        <DemoButton type="button" $variant="secondary">
                            Second
                        </DemoButton>
                        <DemoButton type="button" onClick={() => setOpen(false)}>
                            Close
                        </DemoButton>
                    </DemoRow>
                </DemoBox>
            )}
        </DemoColumn>
    );
}
