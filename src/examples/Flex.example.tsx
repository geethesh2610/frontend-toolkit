import { useState } from "react";

import { DemoButton, DemoColumn, DemoRow } from "../App.style";
import Flex from "../components/Flex/Flex";

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

export default function FlexExample() {
    const [justify, setJustify] = useState<"flex-start" | "center" | "space-between">("flex-start");

    return (
        <DemoColumn>
            <DemoRow>
                <DemoButton
                    type="button"
                    $variant="secondary"
                    onClick={() =>
                        setJustify((j) => (j === "flex-start" ? "center" : j === "center" ? "space-between" : "flex-start"))
                    }
                >
                    justify: {justify}
                </DemoButton>
            </DemoRow>
            <Flex justify={justify} gap={10} style={{ border: "1px dashed var(--ft-border-dashed)", borderRadius: 8, padding: 10 }}>
                <div style={swatchStyle}>1</div>
                <div style={swatchStyle}>2</div>
            </Flex>
        </DemoColumn>
    );
}
