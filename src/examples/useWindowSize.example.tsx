import { DemoColumn, DemoStat, DemoText } from "../App.style";
import { useWindowSize } from "../react-hooks/useWindowSize";

export default function UseWindowSizeExample() {
    const { width, height } = useWindowSize();

    return (
        <DemoColumn>
            <DemoText>
                Viewport: <DemoStat>{width}</DemoStat> × <DemoStat>{height}</DemoStat> px
            </DemoText>
            <DemoText $muted>Resize the browser window to see this update.</DemoText>
        </DemoColumn>
    );
}
