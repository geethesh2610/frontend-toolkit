export function readFileAsText(
  file: Blob,
  _encoding = "utf-8",
): Promise<string> {
  return file.text();
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
