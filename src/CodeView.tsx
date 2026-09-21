import { useState } from "react";

import { slugifyFolder, type FlatItem } from "./App.data";
import { Breadcrumb, CodeMeta, CodeTitle, CopyButton, FileBlock, FileHeader, FilePath, MissingNote, Pre, SourceHeading, WindowDots } from "./App.style";
import { highlight } from "./highlight";
import { getSource } from "./toolkitSource";

function CodeFile({ path }: { path: string }) {
    const [copied, setCopied] = useState(false);
    const source = getSource(path);

    const handleCopy = () => {
        if (source === undefined) return;
        navigator.clipboard.writeText(source).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    return (
        <FileBlock>
            <FileHeader>
                <WindowDots>
                    <span />
                    <span />
                    <span />
                </WindowDots>
                <FilePath>{path.replace(/^\//, "")}</FilePath>
                <CopyButton type="button" onClick={handleCopy} disabled={source === undefined} $copied={copied}>
                    {copied ? "Copied!" : "Copy"}
                </CopyButton>
            </FileHeader>
            {source === undefined ? (
                <MissingNote>Couldn't load this file's source.</MissingNote>
            ) : (
                <Pre>
                    <code dangerouslySetInnerHTML={{ __html: highlight(source, path) }} />
                </Pre>
            )}
        </FileBlock>
    );
}

export function CodeView({ entry }: { entry: FlatItem }) {
    const { folder, item } = entry;

    return (
        <div>
            <Breadcrumb href={`#${slugifyFolder(folder)}`}>← src/{folder}</Breadcrumb>
            <CodeTitle>{item.name}</CodeTitle>
            <CodeMeta>{item.use}</CodeMeta>
            <SourceHeading>{item.files.length > 1 ? `Source (${item.files.length} files)` : "Source"}</SourceHeading>
            {item.files.map((path) => (
                <CodeFile key={path} path={path} />
            ))}
        </div>
    );
}
