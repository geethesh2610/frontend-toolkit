import { DemoBox, DemoButton, DemoColumn, DemoRow } from "../App.style";
import { useDisclosure } from "../react-hooks/useDisclosure";

export default function UseDisclosureExample() {
    const { isOpen, open, close, toggle } = useDisclosure();

    return (
        <DemoColumn>
            <DemoRow>
                <DemoButton type="button" onClick={open}>
                    Open
                </DemoButton>
                <DemoButton type="button" $variant="secondary" onClick={close}>
                    Close
                </DemoButton>
                <DemoButton type="button" $variant="secondary" onClick={toggle}>
                    Toggle
                </DemoButton>
            </DemoRow>
            {isOpen && <DemoBox>Panel is open — this is the same boolean a Modal/Drawer/Accordion would use.</DemoBox>}
        </DemoColumn>
    );
}
