import { DemoButton, DemoDot, DemoRow, DemoText } from "../App.style";
import { useToggle } from "../react-hooks/useToggle";

export default function UseToggleExample() {
    const { value, toggle, enable, disable } = useToggle(false);

    return (
        <DemoRow>
            <DemoDot $active={value} />
            <DemoText>{value ? "On" : "Off"}</DemoText>
            <DemoButton type="button" onClick={toggle}>
                Toggle
            </DemoButton>
            <DemoButton type="button" $variant="secondary" onClick={enable}>
                Enable
            </DemoButton>
            <DemoButton type="button" $variant="secondary" onClick={disable}>
                Disable
            </DemoButton>
        </DemoRow>
    );
}
