import type { CSSProperties } from "react";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/Accordion/Accordion";

const itemStyle: CSSProperties = {
    border: "1px solid var(--ft-border)",
    borderRadius: 8,
    marginBottom: 6,
    overflow: "hidden",
};

const triggerStyle: CSSProperties = {
    display: "flex",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "10px 12px",
    background: "var(--ft-bg)",
    border: "none",
    font: "inherit",
    fontSize: 12.5,
    fontWeight: 600,
    color: "var(--ft-text)",
    cursor: "pointer",
};

const contentStyle: CSSProperties = {
    padding: "0 12px",
    fontSize: 12.5,
    color: "var(--ft-text-muted)",
};

export default function AccordionExample() {
    return (
        <Accordion type="single" collapsible defaultValue="one">
            <AccordionItem value="one" style={itemStyle}>
                <AccordionTrigger style={triggerStyle}>What is this?</AccordionTrigger>
                <AccordionContent style={contentStyle}>
                    <p style={{ padding: "10px 0", margin: 0 }}>A headless accordion — this markup/behavior, your CSS.</p>
                </AccordionContent>
            </AccordionItem>
            <AccordionItem value="two" style={itemStyle}>
                <AccordionTrigger style={triggerStyle}>Can multiple be open?</AccordionTrigger>
                <AccordionContent style={contentStyle}>
                    <p style={{ padding: "10px 0", margin: 0 }}>Yes — pass type="multiple" to Accordion.</p>
                </AccordionContent>
            </AccordionItem>
        </Accordion>
    );
}
