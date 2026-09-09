import type {
  DownloadJsonOptions,
  DownloadOptions,
} from "../file/file.types";
import { ensureFileExtension, sanitizeFileName } from "../file/file.name";

function triggerDownload(url: string, filename?: string): void {
  const anchor = document.createElement("a");
  anchor.href = url;
  if (filename) anchor.download = sanitizeFileName(filename);
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
}

export function downloadBlob(
  blob: Blob,
  filename: string,
  options: DownloadOptions = {},
): void {
  const url = URL.createObjectURL(blob);

  try {
    if (options.openInNewTab) {
      window.open(url, "_blank", "noopener,noreferrer");
    } else {
      triggerDownload(url, filename);
    }
  } finally {
    if (options.revokeUrl !== false) {
      setTimeout(() => URL.revokeObjectURL(url), 0);
    }
  }
}

export function downloadFile(
  file: File,
  filename = file.name,
  options?: DownloadOptions,
): void {
  downloadBlob(file, filename, options);
}

export function downloadText(
  content: string,
  filename: string,
  mimeType = "text/plain;charset=utf-8",
): void {
  downloadBlob(new Blob([content], { type: mimeType }), filename);
}

export function downloadJson(
  data: unknown,
  filename = "data.json",
  options: DownloadJsonOptions = {},
): void {
  const json = JSON.stringify(
    data,
    null,
    options.pretty === false ? 0 : options.indent ?? 2,
  );

  if (json === undefined) {
    throw new TypeError("The supplied value cannot be serialized to JSON.");
  }

  downloadText(
    json,
    ensureFileExtension(filename, "json"),
    "application/json;charset=utf-8",
  );
}

export function downloadFromUrl(
  url: string,
  filename?: string,
  options: DownloadOptions = {},
): void {
  if (!url) throw new TypeError("A download URL is required.");

  if (options.openInNewTab) {
    window.open(url, "_blank", "noopener,noreferrer");
    return;
  }

  triggerDownload(url, filename);
}
