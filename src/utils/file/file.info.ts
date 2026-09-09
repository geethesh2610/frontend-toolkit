export function getFileName(file: File | string): string {
  if (typeof file !== "string") return file.name;
  return file.split(/[?#]/, 1)[0].split(/[\\/]/).pop() ?? "";
}

export function getFileExtension(file: File | string): string {
  const name = getFileName(file);
  const lastDot = name.lastIndexOf(".");
  if (lastDot <= 0 || lastDot === name.length - 1) return "";
  return name.slice(lastDot + 1).toLowerCase();
}

export function getFileNameWithoutExtension(file: File | string): string {
  const name = getFileName(file);
  const extension = getFileExtension(name);
  return extension ? name.slice(0, -(extension.length + 1)) : name;
}

export function getFileMimeType(file: File): string {
  return file.type || "application/octet-stream";
}

export function getFileSize(file: File | Blob): number {
  return file.size;
}

export function isFile(value: unknown): value is File {
  return typeof File !== "undefined" && value instanceof File;
}

export function isBlob(value: unknown): value is Blob {
  return typeof Blob !== "undefined" && value instanceof Blob;
}

export function formatFileSize(
  bytes: number,
  decimals = 2,
): string {
  if (!Number.isFinite(bytes) || bytes < 0) return "0 Bytes";
  if (bytes === 0) return "0 Bytes";

  const units = ["Bytes", "KB", "MB", "GB", "TB", "PB"];
  const index = Math.min(
    Math.floor(Math.log(bytes) / Math.log(1024)),
    units.length - 1,
  );

  const value = bytes / 1024 ** index;
  return `${Number(value.toFixed(Math.max(0, decimals)))} ${units[index]}`;
}
