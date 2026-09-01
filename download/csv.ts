import type { CsvOptions } from "../file/file.types";
import { ensureFileExtension } from "../file/file.name";
import { downloadText } from "./download";

function escapeCsvValue(value: unknown, delimiter: string): string {
  if (value === null || value === undefined) return "";

  const text = typeof value === "object"
    ? JSON.stringify(value)
    : String(value);

  const escaped = text.replace(/"/g, '""');

  return /["\r\n]/.test(text) || text.includes(delimiter)
    ? `"${escaped}"`
    : escaped;
}

export function jsonToCsv(
  rows: readonly Record<string, unknown>[],
  options: CsvOptions = {},
): string {
  const delimiter = options.delimiter ?? ",";
  const lineBreak = options.lineBreak ?? "\r\n";

  if (!rows.length) return "";

  const columns = Array.from(
    new Set(rows.flatMap((row) => Object.keys(row))),
  );

  const header = columns
    .map((column) => escapeCsvValue(column, delimiter))
    .join(delimiter);

  const body = rows.map((row) =>
    columns
      .map((column) => escapeCsvValue(row[column], delimiter))
      .join(delimiter),
  );

  return [header, ...body].join(lineBreak);
}

export function downloadCsv(
  rows: readonly Record<string, unknown>[],
  filename = "data.csv",
  options: CsvOptions = {},
): void {
  const csv = jsonToCsv(rows, options);
  const content = options.includeBom === false ? csv : `\uFEFF${csv}`;

  downloadText(
    content,
    ensureFileExtension(filename, "csv"),
    "text/csv;charset=utf-8",
  );
}
