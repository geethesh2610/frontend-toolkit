import { DemoBox, DemoButton, DemoColumn, DemoRow, DemoText } from "../App.style";
import { useCopyToClipboard } from "../react-hooks/useCopyToClipboard";

export default function UseCopyToClipboardExample() {
    const { copy, isCopied, error } = useCopyToClipboard();
    const snippet = "npm install frontend-toolkit";

    return (
        <DemoColumn>
            <DemoRow>
                <DemoBox style={{ flex: 1 }}>{snippet}</DemoBox>
                <DemoButton type="button" onClick={() => copy(snippet)}>
                    {isCopied ? "Copied!" : "Copy"}
                </DemoButton>
            </DemoRow>
            {error && <DemoText $muted>Couldn't copy: {error.message}</DemoText>}
        </DemoColumn>
    );
}
