import { DemoButton, DemoColumn, DemoInput, DemoRow, DemoText } from "../App.style";
import { useLocalStorage } from "../react-hooks/useLocalStorage";

export default function UseLocalStorageExample() {
    const { value, setValue, removeValue } = useLocalStorage("ft-demo-note", "");

    return (
        <DemoColumn>
            <DemoInput placeholder="Persisted note…" value={value} onChange={(event) => setValue(event.target.value)} />
            <DemoRow>
                <DemoButton type="button" $variant="secondary" onClick={removeValue}>
                    Clear
                </DemoButton>
                <DemoText $muted>Reload the page — this survives it (stored under "ft-demo-note").</DemoText>
            </DemoRow>
        </DemoColumn>
    );
}
