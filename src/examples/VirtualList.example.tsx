import { VirtualGrid, VirtualList } from "../components/VirtualList";
import { DemoColumn, DemoText } from "../App.style";

const listItems = Array.from({ length: 5000 }, (_, index) => `Row ${index + 1}`);
const gridItems = Array.from({ length: 500 }, (_, index) => `#${index + 1}`);

const rowStyle = {
    padding: "8px 12px",
    fontSize: 12.5,
    color: "var(--ft-text-secondary)",
    borderBottom: "1px solid var(--ft-border)",
};

const cellStyle = {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    height: "100%",
    borderRadius: 8,
    background: "var(--ft-accent-tint-2)",
    color: "var(--ft-accent-strong)",
    fontSize: 12,
    fontWeight: 600,
};

export default function VirtualListExample() {
    return (
        <DemoColumn>
            <DemoText $muted>VirtualList — {listItems.length.toLocaleString()} rows, only the visible ones are mounted:</DemoText>
            <VirtualList
                items={listItems}
                height={160}
                estimateSize={32}
                style={{ border: "1px solid var(--ft-border)", borderRadius: 8 }}
                renderItem={(item) => <div style={rowStyle}>{item}</div>}
            />

            <DemoText $muted>VirtualGrid — {gridItems.length.toLocaleString()} cells, 5 columns:</DemoText>
            <VirtualGrid
                items={gridItems}
                columnCount={5}
                rowHeight={48}
                height={160}
                gap={6}
                style={{ border: "1px solid var(--ft-border)", borderRadius: 8, padding: 6 }}
                renderItem={(item) => <div style={cellStyle}>{item}</div>}
            />
        </DemoColumn>
    );
}
