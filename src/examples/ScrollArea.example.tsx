import ScrollArea from "../components/ScrollArea/ScrollArea";

export default function ScrollAreaExample() {
    return (
        <ScrollArea
            style={{
                height: 140,
                border: "1px solid var(--ft-border)",
                borderRadius: 8,
                padding: "8px 12px",
                fontSize: 12.5,
                color: "var(--ft-text-secondary)",
            }}
        >
            {Array.from({ length: 25 }, (_, index) => (
                <p key={index} style={{ margin: "6px 0" }}>
                    Scrollable line {index + 1}
                </p>
            ))}
        </ScrollArea>
    );
}
