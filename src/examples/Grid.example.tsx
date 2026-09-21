import { useState } from "react";

import { DemoButton, DemoColumn, DemoRow } from "../App.style";
import Grid from "../components/Grid/Grid";

const swatchStyle = {
    height: 40,
    borderRadius: 8,
    background: "var(--ft-accent-tint-3)",
    color: "var(--ft-accent-strong)",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    fontSize: 12.5,
    fontWeight: 700,
};

export default function GridExample() {
    const [columns, setColumns] = useState(3);

    return (
        <DemoColumn>
            <DemoRow>
                <DemoButton type="button" $variant="secondary" onClick={() => setColumns((c) => (c === 4 ? 2 : c + 1))}>
                    columns: {columns}
                </DemoButton>
            </DemoRow>
            <Grid columns={columns} gap={8}>
                {Array.from({ length: 6 }, (_, index) => (
                    <div key={index} style={swatchStyle}>
                        {index + 1}
                    </div>
                ))}
            </Grid>
        </DemoColumn>
    );
}
