import Tabs from "../components/Tabs/Tabs";

const panelStyle = { fontSize: 12.5, color: "var(--ft-text-muted)", margin: 0 };

export default function TabsExample() {
    return (
        <Tabs
            tabs={[
                { id: "overview", label: "Overview", content: <p style={panelStyle}>Overview content.</p> },
                { id: "details", label: "Details", content: <p style={panelStyle}>Details content — panel swaps, state stays in the hook.</p> },
                { id: "disabled", label: "Disabled", content: null, disabled: true },
            ]}
        />
    );
}
