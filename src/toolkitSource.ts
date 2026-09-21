/*
 * Reads every source file's raw text at build time (Vite's `?raw` query) so
 * the code-view page can show/copy actual file contents client-side, with
 * no server and no per-file import statements to maintain by hand.
 */

const rawModules = import.meta.glob("/src/**/*.{ts,tsx,css,json}", {
    eager: true,
    query: "?raw",
    import: "default",
}) as Record<string, string>;

export function getSource(path: string): string | undefined {
    return rawModules[path];
}
