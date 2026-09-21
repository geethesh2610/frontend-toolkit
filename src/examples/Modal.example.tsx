import { useState } from "react";

import { DemoButton, DemoColumn } from "../App.style";
import Modal from "../components/Modal/Modal";

export default function ModalExample() {
    const [open, setOpen] = useState(false);

    return (
        <DemoColumn>
            <DemoButton type="button" onClick={() => setOpen(true)}>
                Open modal
            </DemoButton>
            <Modal open={open} onClose={() => setOpen(false)} width="360px">
                <div
                    style={{
                        background: "var(--ft-bg-elevated)",
                        border: "1px solid var(--ft-border)",
                        borderRadius: 12,
                        padding: 20,
                    }}
                >
                    <p style={{ margin: "0 0 8px", fontWeight: 700, color: "var(--ft-text)" }}>A real modal</p>
                    <p style={{ margin: "0 0 16px", color: "var(--ft-text-muted)", fontSize: 13, lineHeight: 1.6 }}>
                        Overlay, outside-click, Escape, scroll lock, and focus trap are all wired up already.
                    </p>
                    <DemoButton type="button" onClick={() => setOpen(false)}>
                        Close
                    </DemoButton>
                </div>
            </Modal>
        </DemoColumn>
    );
}
