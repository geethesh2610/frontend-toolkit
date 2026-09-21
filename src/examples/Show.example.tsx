import { DemoBox, DemoButton, DemoColumn } from "../App.style";
import Show from "../components/Show/Show";
import { useToggle } from "../react-hooks/useToggle";

export default function ShowExample() {
    const { value: visible, toggle } = useToggle(true);

    return (
        <DemoColumn>
            <DemoButton type="button" $variant="secondary" onClick={toggle}>
                Toggle
            </DemoButton>
            <Show when={visible} fallback={<DemoBox>Fallback content (when=false).</DemoBox>}>
                <DemoBox>Rendered because when=true.</DemoBox>
            </Show>
        </DemoColumn>
    );
}
