export function blobToFile(
  blob: Blob,
  fileName: string,
  options?: FilePropertyBag,
): File {
  return new File([blob], fileName, {
    type: options?.type ?? blob.type,
    lastModified: options?.lastModified ?? Date.now(),
  });
}

export function fileToBlob(file: File): Blob {
  return new Blob([file], { type: file.type });
}

export function base64ToBlob(
  base64: string,
  mimeType = "application/octet-stream",
): Blob {
  const binary = atob(base64.replace(/\s/g, ""));
  const bytes = new Uint8Array(binary.length);

  for (let i = 0; i < binary.length; i += 1) {
    bytes[i] = binary.charCodeAt(i);
  }

  return new Blob([bytes], { type: mimeType });
}

export function base64ToFile(
  base64: string,
  fileName: string,
  mimeType = "application/octet-stream",
): File {
  return blobToFile(base64ToBlob(base64, mimeType), fileName, {
    type: mimeType,
  });
}

export function dataUrlToBlob(dataUrl: string): Blob {
  const match = dataUrl.match(/^data:([^;,]+)?(;base64)?,(.*)$/s);

  if (!match) throw new TypeError("Invalid data URL.");

  const mimeType = match[1] || "text/plain";
  const data = match[3];

  if (match[2]) return base64ToBlob(data, mimeType);

  return new Blob([decodeURIComponent(data)], { type: mimeType });
}

export function dataUrlToFile(dataUrl: string, fileName: string): File {
  const blob = dataUrlToBlob(dataUrl);
  return blobToFile(blob, fileName, { type: blob.type });
}
