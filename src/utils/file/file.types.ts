export type FileValidationErrorCode =
  | "INVALID_FILE"
  | "EMPTY_FILE"
  | "FILE_TOO_LARGE"
  | "FILE_TOO_SMALL"
  | "INVALID_MIME_TYPE"
  | "INVALID_EXTENSION"
  | "INVALID_FILE_NAME"
  | "TOO_MANY_FILES";

export type FileValidationResult =
  | { valid: true }
  | { valid: false; code: FileValidationErrorCode; message: string };

export interface FileValidationOptions {
  maxSize?: number;
  minSize?: number;
  mimeTypes?: readonly string[];
  extensions?: readonly string[];
  maxFileNameLength?: number;
  allowEmpty?: boolean;
}

export interface FilesValidationOptions extends FileValidationOptions {
  maxFiles?: number;
  minFiles?: number;
}

export interface DownloadOptions {
  filename?: string;
  openInNewTab?: boolean;
  revokeUrl?: boolean;
}

export interface DownloadJsonOptions extends DownloadOptions {
  pretty?: boolean;
  indent?: number;
}

export interface CsvOptions {
  delimiter?: string;
  lineBreak?: string;
  includeBom?: boolean;
}
