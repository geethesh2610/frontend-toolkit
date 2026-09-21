import { DemoDot, DemoRow, DemoText } from "../App.style";
import { usePageVisibility } from "../react-hooks/usePageVisibility";

export default function UsePageVisibilityExample() {
    const isVisible = usePageVisibility();

    return (
        <DemoRow>
            <DemoDot $active={isVisible} />
            <DemoText>{isVisible ? "Visible" : "Hidden"}</DemoText>
            <DemoText $muted>Switch to another tab and back — this flips without any polling.</DemoText>
        </DemoRow>
    );
}
