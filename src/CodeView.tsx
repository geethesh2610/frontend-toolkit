import { useState } from "react";

import { slugifyFolder, type FlatItem } from "./App.data";
import {
    Breadcrumb,
    CodeMeta,
    CodeTitle,
    CopyButton,
    DemoPanel,
    DemoPanelLabel,
    DependencyChip,
    DependsOnLabel,
    DependsOnRow,
    FileBlock,
    FileHeader,
    FilePath,
    MissingNote,
    Pre,
    SourceHeading,
    WindowDots,
} from "./App.style";
import { getFileDependencies } from "./depGraph";
import { EXAMPLES } from "./examples";
import { highlight } from "./highlight";
import { getSource } from "./toolkitSource";

export function CodeFile({ path, ownFiles = [] }: { path: string; ownFiles?: readonly string[] }) {
    const [copied, setCopied] = useState(false);
    const source = getSource(path);
    const dependencies = getFileDependencies(path, ownFiles);

    const handleCopy = () => {
        if (source === undefined) return;
        navigator.clipboard.writeText(source).then(() => {
            setCopied(true);
            setTimeout(() => setCopied(false), 1500);
        });
    };

    return (
        <>
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

            {dependencies.length > 0 && (
                <DependsOnRow>
                    <DependsOnLabel>Depends on:</DependsOnLabel>
                    {dependencies.map((dep) => (
                        <DependencyChip key={dep.path} href={dep.href}>
                            {dep.label}
                        </DependencyChip>
                    ))}
                </DependsOnRow>
            )}
        </>
    );
}

export function CodeView({ entry }: { entry: FlatItem }) {
    const { folder, item } = entry;
    const Example = EXAMPLES[item.name];

    return (
        <div>
            <Breadcrumb href={`#${slugifyFolder(folder)}`}>← src/{folder}</Breadcrumb>
            <CodeTitle>{item.name}</CodeTitle>
            <CodeMeta>{item.use}</CodeMeta>

            {Example && (
                <DemoPanel>
                    <DemoPanelLabel>Live example</DemoPanelLabel>
                    <Example />
                </DemoPanel>
            )}

            <SourceHeading>{item.files.length > 1 ? `Source (${item.files.length} files)` : "Source"}</SourceHeading>
            {item.files.map((path) => (
                <CodeFile key={path} path={path} ownFiles={item.files} />
            ))}
        </div>
    );
}

/** Generic single-file source view for a dependency that isn't itself a catalog item (e.g. an internal helper). */
export function RawFileView({ path }: { path: string }) {
    return (
        <div>
            <Breadcrumb href="#">← Home</Breadcrumb>
            <CodeTitle>{path.replace(/^\/src\//, "")}</CodeTitle>
            <CodeMeta>Referenced by another item on this page — not a catalog entry of its own.</CodeMeta>
            <SourceHeading>Source</SourceHeading>
            <CodeFile path={path} />
        </div>
    );
}
