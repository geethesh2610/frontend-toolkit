import { DemoColumn, DemoRow, DemoStat, DemoText } from "../App.style";
import { useMediaQuery } from "../react-hooks/useMediaQuery";

export default function UseMediaQueryExample() {
    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
    const isNarrow = useMediaQuery("(max-width: 700px)");

    return (
        <DemoColumn>
            <DemoRow>
                <DemoText>System prefers dark:</DemoText>
                <DemoStat>{prefersDark ? "yes" : "no"}</DemoStat>
            </DemoRow>
            <DemoRow>
                <DemoText>Viewport ≤ 700px:</DemoText>
                <DemoStat>{isNarrow ? "yes" : "no"}</DemoStat>
            </DemoRow>
            <DemoText $muted>Resize the window (or toggle your OS theme) to see these flip live.</DemoText>
        </DemoColumn>
    );
}
