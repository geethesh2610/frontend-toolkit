/*
 * Detects which OTHER files-in-this-repo a shown source file imports, so
 * CodeView can render them as "Depends on" links. Two kinds of link target:
 *
 *   - a file that happens to be (one of) another catalog item's own files
 *     -> links to that item's code page (#code/<key>)
 *   - a file that isn't its own catalog entry (a small internal helper, a
 *     shared type file, a CSS file, ...) -> links to a generic raw-source
 *     view for that single file (#file/<path>)
 *
 * Only LOCAL (relative) imports are considered — bare specifiers ("react",
 * "@tanstack/react-table", ...) are external packages, not something this
 * toolkit can link to.
 */

import { FLAT_ITEMS } from "./App.data";
import { ALL_SOURCE_PATHS, getSource } from "./toolkitSource";

const CANDIDATE_EXTENSIONS = [".ts", ".tsx", ".css", ".json"];

const KNOWN_PATHS = new Set(ALL_SOURCE_PATHS);

/** file path -> the catalog item key it belongs to (first match wins). */
const FILE_TO_ITEM_KEY: Record<string, string> = {};
for (const entry of FLAT_ITEMS) {
    for (const file of entry.item.files) {
        if (!(file in FILE_TO_ITEM_KEY)) {
            FILE_TO_ITEM_KEY[file] = entry.key;
        }
    }
}

/** file path -> the catalog item name it belongs to, for a readable chip label. */
const FILE_TO_ITEM_NAME: Record<string, string> = {};
for (const entry of FLAT_ITEMS) {
    for (const file of entry.item.files) {
        if (!(file in FILE_TO_ITEM_NAME)) {
            FILE_TO_ITEM_NAME[file] = entry.item.name;
        }
    }
}

const IMPORT_PATTERN = /(?:import|export)(?:[^'"]*?)from\s+["']([^"']+)["']|import\s*\(\s*["']([^"']+)["']\s*\)/g;

function extractLocalSpecifiers(source: string): string[] {
    const specifiers = new Set<string>();
    let match: RegExpExecArray | null;
    IMPORT_PATTERN.lastIndex = 0;
    while ((match = IMPORT_PATTERN.exec(source)) !== null) {
        const specifier = match[1] ?? match[2];
        if (specifier && (specifier.startsWith("./") || specifier.startsWith("../"))) {
            specifiers.add(specifier);
        }
    }
    return Array.from(specifiers);
}

function resolveSpecifier(fromFile: string, specifier: string): string | undefined {
    const fromDir = fromFile.slice(0, fromFile.lastIndexOf("/"));
    const segments = `${fromDir}/${specifier}`.split("/");

    const resolved: string[] = [];
    for (const segment of segments) {
        if (segment === "" || segment === ".") continue;
        if (segment === "..") {
            resolved.pop();
            continue;
        }
        resolved.push(segment);
    }
    const base = `/${resolved.join("/")}`;

    if (KNOWN_PATHS.has(base)) return base;
    for (const ext of CANDIDATE_EXTENSIONS) {
        if (KNOWN_PATHS.has(base + ext)) return base + ext;
    }
    for (const ext of CANDIDATE_EXTENSIONS) {
        const indexPath = `${base}/index${ext}`;
        if (KNOWN_PATHS.has(indexPath)) return indexPath;
    }
    return undefined;
}

export interface FileDependency {
    path: string;
    /** Display label — the resolved item's name if this file belongs to one, else its own filename. */
    label: string;
    /** Link target: a catalog item's code page, or a generic single-file view. */
    href: string;
}

/**
 * Local dependencies of `path`, excluding anything already listed in
 * `ownFiles` (the item's own multi-file source, which is already shown on
 * the page and shouldn't also appear as a "depends on" link).
 */
export function getFileDependencies(path: string, ownFiles: readonly string[]): FileDependency[] {
    const source = getSource(path);
    if (!source) return [];

    const ownSet = new Set(ownFiles);
    const seen = new Set<string>();
    const dependencies: FileDependency[] = [];

    for (const specifier of extractLocalSpecifiers(source)) {
        const resolved = resolveSpecifier(path, specifier);
        if (!resolved || resolved === path || ownSet.has(resolved) || seen.has(resolved)) continue;
        seen.add(resolved);

        const itemKey = FILE_TO_ITEM_KEY[resolved];
        const itemName = FILE_TO_ITEM_NAME[resolved];
        dependencies.push({
            path: resolved,
            label: itemName ?? resolved.replace(/^\/src\//, ""),
            href: itemKey ? `#code/${itemKey}` : `#file${resolved}`,
        });
    }

    return dependencies;
}
