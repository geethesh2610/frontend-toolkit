export const FILE_SIZE_UNITS = [
  "Bytes", "KB", "MB", "GB", "TB", "PB",
] as const;

export const COMMON_MIME_TYPES = {
  PDF: "application/pdf",
  JSON: "application/json",
  CSV: "text/csv",
  TEXT: "text/plain",
  XML: "application/xml",
  ZIP: "application/zip",
  JPEG: "image/jpeg",
  PNG: "image/png",
  GIF: "image/gif",
  WEBP: "image/webp",
  SVG: "image/svg+xml",
  DOC: "application/msword",
  DOCX: "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  XLS: "application/vnd.ms-excel",
  XLSX: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
} as const;
