import Center from "../components/Center/Center";

export default function CenterExample() {
    return (
        <Center
            style={{
                height: 120,
                border: "1px dashed var(--ft-border-dashed)",
                borderRadius: 8,
            }}
        >
            <span
                style={{
                    padding: "6px 12px",
                    borderRadius: 999,
                    background: "var(--ft-accent-tint-3)",
                    color: "var(--ft-accent-strong)",
                    fontSize: 12.5,
                    fontWeight: 700,
                }}
            >
                centered both ways
            </span>
        </Center>
    );
}
