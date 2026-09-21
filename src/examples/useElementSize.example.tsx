import { DemoColumn, DemoStat, DemoText } from "../App.style";
import { useElementSize } from "../react-hooks/useElementSize";

export default function UseElementSizeExample() {
    const { ref, width, height } = useElementSize<HTMLDivElement>();

    return (
        <DemoColumn>
            <div
                ref={ref}
                style={{
                    resize: "both",
                    overflow: "auto",
                    minWidth: 120,
                    minHeight: 60,
                    maxWidth: "100%",
                    padding: 12,
                    border: "1px dashed var(--ft-border-dashed)",
                    borderRadius: 8,
                    fontSize: 12.5,
                    color: "var(--ft-text-muted)",
                }}
            >
                Drag the bottom-right corner to resize me.
            </div>
            <DemoText $muted>
                Measured: <DemoStat>{Math.round(width)}</DemoStat> × <DemoStat>{Math.round(height)}</DemoStat> px
            </DemoText>
        </DemoColumn>
    );
}
