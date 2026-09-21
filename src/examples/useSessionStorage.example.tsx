import { DemoButton, DemoColumn, DemoInput, DemoRow, DemoText } from "../App.style";
import { useSessionStorage } from "../react-hooks/useSessionStorage";

export default function UseSessionStorageExample() {
    const { value, setValue, removeValue } = useSessionStorage("ft-demo-session-note", "");

    return (
        <DemoColumn>
            <DemoInput placeholder="Persisted note…" value={value} onChange={(event) => setValue(event.target.value)} />
            <DemoRow>
                <DemoButton type="button" $variant="secondary" onClick={removeValue}>
                    Clear
                </DemoButton>
                <DemoText $muted>Survives a reload, but not a new tab — try opening this page in a second tab.</DemoText>
            </DemoRow>
        </DemoColumn>
    );
}
