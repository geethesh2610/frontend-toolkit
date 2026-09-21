import { useState } from "react";

import { DemoButton, DemoColumn, DemoRow } from "../App.style";
import Stack from "../components/Stack/Stack";

const swatchStyle = {
    width: 44,
    height: 44,
    borderRadius: 8,
    background: "var(--ft-accent-tint-3)",
    color: "var(--ft-accent-strong)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12.5,
    fontWeight: 700,
};

export default function StackExample() {
    const [direction, setDirection] = useState<"row" | "column">("row");

    return (
        <DemoColumn>
            <DemoRow>
                <DemoButton type="button" $variant="secondary" onClick={() => setDirection((d) => (d === "row" ? "column" : "row"))}>
                    direction: {direction}
                </DemoButton>
            </DemoRow>
            <Stack direction={direction} gap={10}>
                <div style={swatchStyle}>1</div>
                <div style={swatchStyle}>2</div>
                <div style={swatchStyle}>3</div>
            </Stack>
        </DemoColumn>
    );
}
