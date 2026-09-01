const WINDOWS_RESERVED_NAMES =
  /^(con|prn|aux|nul|com[1-9]|lpt[1-9])(?:\..*)?$/i;

export function sanitizeFileName(
  fileName: string,
  replacement = "_",
): string {
  const cleaned = fileName
    .replace(/[<>:"/\\|?*\u0000-\u001F]/g, replacement)
    .replace(/\s+/g, " ")
    .trim()
    .replace(/[. ]+$/g, "");

  if (!cleaned) return "file";
  return WINDOWS_RESERVED_NAMES.test(cleaned) ? `${cleaned}_` : cleaned;
}

export function ensureFileExtension(
  fileName: string,
  extension: string,
): string {
  const normalized = extension.replace(/^\./, "").toLowerCase();
  if (!normalized) return fileName;

  return fileName.toLowerCase().endsWith(`.${normalized}`)
    ? fileName
    : `${fileName}.${normalized}`;
}

export function removeFileExtension(fileName: string): string {
  const lastDot = fileName.lastIndexOf(".");
  return lastDot > 0 ? fileName.slice(0, lastDot) : fileName;
}
