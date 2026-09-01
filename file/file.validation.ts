import type {
  FileValidationOptions,
  FileValidationResult,
  FilesValidationOptions,
} from "./file.types";
import { getFileExtension, isFile } from "./file.info";

const DEFAULT_MAX_FILE_NAME_LENGTH = 255;

function normalizeExtension(extension: string): string {
  return extension.trim().replace(/^\./, "").toLowerCase();
}

function matchesMimeType(
  actual: string,
  allowed: readonly string[],
): boolean {
  const normalized = actual.toLowerCase();

  return allowed.some((pattern) => {
    const value = pattern.trim().toLowerCase();
    if (!value) return false;
    return value.endsWith("/*")
      ? normalized.startsWith(value.slice(0, -1))
      : normalized === value;
  });
}

export function validateFile(
  file: unknown,
  options: FileValidationOptions = {},
): FileValidationResult {
  if (!isFile(file)) {
    return {
      valid: false,
      code: "INVALID_FILE",
      message: "A valid File is required.",
    };
  }

  if (!options.allowEmpty && file.size === 0) {
    return {
      valid: false,
      code: "EMPTY_FILE",
      message: "The file is empty.",
    };
  }

  if (options.minSize !== undefined && file.size < options.minSize) {
    return {
      valid: false,
      code: "FILE_TOO_SMALL",
      message: `File size must be at least ${options.minSize} bytes.`,
    };
  }

  if (options.maxSize !== undefined && file.size > options.maxSize) {
    return {
      valid: false,
      code: "FILE_TOO_LARGE",
      message: `File size must not exceed ${options.maxSize} bytes.`,
    };
  }

  if (
    options.mimeTypes?.length &&
    !matchesMimeType(file.type, options.mimeTypes)
  ) {
    return {
      valid: false,
      code: "INVALID_MIME_TYPE",
      message: "File type is not allowed.",
    };
  }

  if (options.extensions?.length) {
    const extension = getFileExtension(file);
    const allowed = options.extensions.map(normalizeExtension);

    if (!extension || !allowed.includes(extension)) {
      return {
        valid: false,
        code: "INVALID_EXTENSION",
        message: "File extension is not allowed.",
      };
    }
  }

  const maxNameLength =
    options.maxFileNameLength ?? DEFAULT_MAX_FILE_NAME_LENGTH;

  if (file.name.length > maxNameLength) {
    return {
      valid: false,
      code: "INVALID_FILE_NAME",
      message: `File name must not exceed ${maxNameLength} characters.`,
    };
  }

  return { valid: true };
}

export function validateFiles(
  files: unknown,
  options: FilesValidationOptions = {},
): FileValidationResult {
  if (!Array.isArray(files)) {
    return {
      valid: false,
      code: "INVALID_FILE",
      message: "An array of files is required.",
    };
  }

  if (options.minFiles !== undefined && files.length < options.minFiles) {
    return {
      valid: false,
      code: "TOO_MANY_FILES",
      message: `At least ${options.minFiles} file(s) are required.`,
    };
  }

  if (options.maxFiles !== undefined && files.length > options.maxFiles) {
    return {
      valid: false,
      code: "TOO_MANY_FILES",
      message: `No more than ${options.maxFiles} file(s) are allowed.`,
    };
  }

  for (const file of files) {
    const result = validateFile(file, options);
    if (!result.valid) return result;
  }

  return { valid: true };
}

export function isValidFile(
  file: unknown,
  options?: FileValidationOptions,
): boolean {
  return validateFile(file, options).valid;
}

export function isValidFileType(
  file: File,
  mimeTypes: readonly string[],
): boolean {
  return validateFile(file, { mimeTypes }).valid;
}

export function isValidExtension(
  file: File,
  extensions: readonly string[],
): boolean {
  return validateFile(file, { extensions }).valid;
}

export function isValidFileSize(
  file: File,
  options: Pick<FileValidationOptions, "minSize" | "maxSize">,
): boolean {
  return validateFile(file, options).valid;
}
