/*
 * Thin PrismJS wrapper for the code-view page. Content highlighted here is
 * always our own bundled source (via toolkitSource.ts), never user input —
 * safe to drop into dangerouslySetInnerHTML.
 */

import Prism from "prismjs";
import "prismjs/components/prism-typescript";
import "prismjs/components/prism-jsx";
import "prismjs/components/prism-tsx";
import "prismjs/components/prism-json";

function grammarFor(path: string) {
    const ext = path.split(".").pop() ?? "";
    switch (ext) {
        case "tsx":
            return { grammar: Prism.languages.tsx, language: "tsx" };
        case "ts":
            return { grammar: Prism.languages.typescript, language: "typescript" };
        case "json":
            return { grammar: Prism.languages.json, language: "json" };
        case "css":
            return { grammar: Prism.languages.css, language: "css" };
        default:
            return { grammar: Prism.languages.markup, language: "markup" };
    }
}

export function highlight(code: string, path: string): string {
    const { grammar, language } = grammarFor(path);
    return Prism.highlight(code, grammar, language);
}
