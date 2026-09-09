import {
    EXCEL_EXTENSIONS,
    EXCEL_MIME_TYPES,
} from './excel.constants'

export function isValidExcelFormat(file: File): boolean {
    const fileName = file.name.toLowerCase()

    const hasValidExtension = EXCEL_EXTENSIONS.some((extension) =>
        fileName.endsWith(extension),
    )

    const hasValidMimeType =
        !file.type || EXCEL_MIME_TYPES.includes(file.type as never)

    return hasValidExtension && hasValidMimeType
}