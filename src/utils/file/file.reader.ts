export function readFileAsText(
  file: Blob,
  encoding = "utf-8",
): Promise<string> {
  if (encoding.toLowerCase() === "utf-8") {
    return file.text();
  }

  return file
    .arrayBuffer()
    .then((buffer) => new TextDecoder(encoding).decode(buffer));
}

export function readFileAsArrayBuffer(file: Blob): Promise<ArrayBuffer> {
  return file.arrayBuffer();
}

export function readFileAsDataURL(file: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () =>
      reject(reader.error ?? new Error("Failed to read file."));
    reader.onabort = () =>
      reject(new DOMException("File read aborted.", "AbortError"));

    reader.readAsDataURL(file);
  });
}

export function fileToBase64(file: Blob): Promise<string> {
  return readFileAsDataURL(file).then((dataUrl) => {
    const commaIndex = dataUrl.indexOf(",");
    return commaIndex >= 0 ? dataUrl.slice(commaIndex + 1) : dataUrl;
  });
}
