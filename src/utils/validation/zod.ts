import { z } from 'zod'

/**
 * =========================================================
 * STRING VALIDATION
 * =========================================================
 */

/**
 * Required text field.
 *
 * Usage:
 * name: requiredString('Name')
 */
export const requiredString = (fieldName: string) =>
    z
        .string()
        .trim()
        .min(1, `${fieldName} is required`)


/**
 * Optional text field.
 *
 * Empty string is converted to undefined.
 *
 * Usage:
 * middleName: optionalString()
 */
export const optionalString = () =>
    z
        .string()
        .trim()
        .optional()
        .or(z.literal('').transform(() => undefined))


/**
 * String with minimum length.
 *
 * Usage:
 * username: minLengthString('Username', 3)
 */
export const minLengthString = (
    fieldName: string,
    min: number,
) =>
    z
        .string()
        .trim()
        .min(
            min,
            `${fieldName} must be at least ${min} characters`,
        )


/**
 * String with maximum length.
 *
 * Usage:
 * description: maxLengthString('Description', 500)
 */
export const maxLengthString = (
    fieldName: string,
    max: number,
) =>
    z
        .string()
        .trim()
        .max(
            max,
            `${fieldName} must be at most ${max} characters`,
        )


/**
 * String with minimum and maximum length.
 *
 * Usage:
 * username: stringLength('Username', 3, 50)
 */
export const stringLength = (
    fieldName: string,
    min: number,
    max: number,
) =>
    z
        .string()
        .trim()
        .min(
            min,
            `${fieldName} must be at least ${min} characters`,
        )
        .max(
            max,
            `${fieldName} must be at most ${max} characters`,
        )


/**
 * =========================================================
 * EMAIL
 * =========================================================
 */

/**
 * Required email.
 *
 * Usage:
 * email: emailSchema
 */
export const emailSchema = z
    .string()
    .trim()
    .min(1, 'Email is required')
    .email('Enter a valid email address')


/**
 * Optional email.
 */
export const optionalEmailSchema = z
    .string()
    .trim()
    .email('Enter a valid email address')
    .optional()
    .or(z.literal('').transform(() => undefined))


/**
 * =========================================================
 * PHONE
 * =========================================================
 */

/**
 * Generic international phone number.
 *
 * Supports formats such as:
 * +919876543210
 * +91 9876543210
 * +1 555 123 4567
 * (555) 123-4567
 */
export const phoneSchema = z
    .string()
    .trim()
    .min(1, 'Phone number is required')
    .regex(
        /^\+?[0-9\s()-]{7,20}$/,
        'Enter a valid phone number',
    )


/**
 * Optional phone number.
 */
export const optionalPhoneSchema = z
    .string()
    .trim()
    .regex(
        /^\+?[0-9\s()-]{7,20}$/,
        'Enter a valid phone number',
    )
    .optional()
    .or(z.literal('').transform(() => undefined))


/**
 * =========================================================
 * URL
 * =========================================================
 */

export const urlSchema = z
    .string()
    .trim()
    .min(1, 'URL is required')
    .url('Enter a valid URL')


export const optionalUrlSchema = z
    .string()
    .trim()
    .url('Enter a valid URL')
    .optional()
    .or(z.literal('').transform(() => undefined))


/**
 * =========================================================
 * PASSWORD
 * =========================================================
 */

/**
 * Standard strong password.
 *
 * Requirements:
 * - Minimum 8 characters
 * - One uppercase letter
 * - One lowercase letter
 * - One number
 */
export const passwordSchema = z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(
        /[A-Z]/,
        'Password must contain at least one uppercase letter',
    )
    .regex(
        /[a-z]/,
        'Password must contain at least one lowercase letter',
    )
    .regex(
        /[0-9]/,
        'Password must contain at least one number',
    )


/**
 * Strong password with special character.
 */
export const strongPasswordSchema = passwordSchema.regex(
    /[^A-Za-z0-9]/,
    'Password must contain at least one special character',
)


/**
 * =========================================================
 * NUMBERS
 * =========================================================
 */

/**
 * Required number.
 */
export const numberSchema = z.number({
    message: 'Enter a valid number',
})


/**
 * Positive number (> 0).
 */
export const positiveNumberSchema = z
    .number({
        message: 'Enter a valid number',
    })
    .positive('Must be greater than 0')


/**
 * Non-negative number (>= 0).
 */
export const nonNegativeNumberSchema = z
    .number({
        message: 'Enter a valid number',
    })
    .nonnegative('Cannot be negative')


/**
 * Integer.
 */
export const integerSchema = z
    .number({
        message: 'Enter a valid number',
    })
    .int('Must be a whole number')


/**
 * Positive integer.
 */
export const positiveIntegerSchema = z
    .number({
        message: 'Enter a valid number',
    })
    .int('Must be a whole number')
    .positive('Must be greater than 0')


/**
 * Number between a minimum and maximum.
 *
 * Usage:
 * age: numberBetween('Age', 18, 100)
 */
export const numberBetween = (
    fieldName: string,
    min: number,
    max: number,
) =>
    z
        .number({
            message: `${fieldName} must be a number`,
        })
        .min(min, `${fieldName} must be at least ${min}`)
        .max(max, `${fieldName} must be at most ${max}`)


/**
 * =========================================================
 * FORM NUMBER INPUTS
 * =========================================================
 *
 * HTML <input type="number"> often returns a STRING.
 *
 * These helpers transform the value into a number.
 */

/**
 * Required number input.
 *
 * Usage:
 * age: numberInput('Age')
 */
export const numberInput = (fieldName: string) =>
    z.coerce
        .number({
            message: `${fieldName} must be a number`,
        })


/**
 * Positive number input.
 */
export const positiveNumberInput = (
    fieldName: string,
) =>
    z.coerce
        .number({
            message: `${fieldName} must be a number`,
        })
        .positive(`${fieldName} must be greater than 0`)


/**
 * =========================================================
 * DATE
 * =========================================================
 */

/**
 * JavaScript Date object.
 */
export const dateSchema = z.date({
    message: 'Enter a valid date',
})


/**
 * Required date string.
 *
 * Useful when forms/API use strings.
 */
export const dateStringSchema = z
    .string()
    .trim()
    .min(1, 'Date is required')
    .refine(
        (value) => !Number.isNaN(Date.parse(value)),
        'Enter a valid date',
    )


/**
 * Optional date string.
 *
 * Empty string is converted to undefined.
 */
export const optionalDateStringSchema = z
    .string()
    .trim()
    .refine(
        (value) => value === '' || !Number.isNaN(Date.parse(value)),
        'Enter a valid date',
    )
    .optional()
    .transform((value) => (value === '' ? undefined : value))


/**
 * =========================================================
 * IDs
 * =========================================================
 */

/**
 * Generic required ID.
 *
 * Works with UUIDs, database IDs, etc.
 */
export const idSchema = z
    .string()
    .trim()
    .min(1, 'ID is required')


/**
 * UUID.
 */
export const uuidSchema = z
    .string()
    .trim()
    .uuid('Enter a valid ID')


/**
 * Optional UUID.
 *
 * Empty string is converted to undefined.
 */
export const optionalUuidSchema = z
    .string()
    .trim()
    .uuid('Enter a valid ID')
    .optional()
    .or(z.literal('').transform(() => undefined))


/**
 * =========================================================
 * SELECT / ENUM VALUES
 * =========================================================
 */

/**
 * Required select value.
 *
 * Usage:
 * status: requiredSelect('Status')
 */
export const requiredSelect = (
    fieldName: string,
) =>
    z
        .string()
        .min(1, `${fieldName} is required`)


/**
 * Optional select value.
 */
export const optionalSelect = () =>
    z
        .string()
        .optional()


/**
 * =========================================================
 * BOOLEAN / CHECKBOX
 * =========================================================
 */

/**
 * Required boolean.
 */
export const requiredBoolean = (
    fieldName: string,
) =>
    z.boolean({
        message: `${fieldName} is required`,
    })


/**
 * Checkbox that must be checked.
 *
 * Usage:
 * terms: requiredCheckbox()
 */
export const requiredCheckbox = (
    message = 'This field must be checked',
) =>
    z
        .boolean()
        .refine(
            (value) => value === true,
            message,
        )


/**
 * =========================================================
 * FILE VALIDATION
 * =========================================================
 */

/**
 * Required file.
 *
 * Usage:
 * document: fileSchema()
 */
export const fileSchema = (
    fieldName = 'File',
) =>
    z
        .instanceof(File, {
            message: `${fieldName} is required`,
        })


/**
 * File with size restriction.
 *
 * Size is specified in MB.
 *
 * Usage:
 * document: fileSizeSchema('Document', 5)
 */
export const fileSizeSchema = (
    fieldName: string,
    maxSizeMB: number,
) =>
    z
        .instanceof(File, {
            message: `${fieldName} is required`,
        })
        .refine(
            (file) =>
                file.size <= maxSizeMB * 1024 * 1024,
            `${fieldName} must be smaller than ${maxSizeMB} MB`,
        )


/**
 * File with allowed MIME types.
 *
 * Usage:
 * document: fileTypeSchema(
 *   'Document',
 *   ['application/pdf']
 * )
 */
export const fileTypeSchema = (
    fieldName: string,
    allowedTypes: string[],
) =>
    z
        .instanceof(File, {
            message: `${fieldName} is required`,
        })
        .refine(
            (file) => allowedTypes.includes(file.type),
            `${fieldName} has an unsupported file type`,
        )


/**
 * =========================================================
 * COMMON PATTERNS
 * =========================================================
 */

/**
 * Alphabetic text.
 *
 * Allows spaces.
 *
 * Usage:
 * firstName: alphabeticString('First name')
 */
export const alphabeticString = (
    fieldName: string,
) =>
    z
        .string()
        .trim()
        .min(1, `${fieldName} is required`)
        .regex(
            /^[A-Za-z\s]+$/,
            `${fieldName} can contain letters only`,
        )


/**
 * Alphanumeric text.
 */
export const alphanumericString = (
    fieldName: string,
) =>
    z
        .string()
        .trim()
        .min(1, `${fieldName} is required`)
        .regex(
            /^[A-Za-z0-9]+$/,
            `${fieldName} can contain letters and numbers only`,
        )


/**
 * Slug.
 *
 * Example:
 * my-page-name
 */
export const slugSchema = z
    .string()
    .trim()
    .min(1, 'Slug is required')
    .regex(
        /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
        'Enter a valid slug',
    )


/**
 * =========================================================
 * CROSS-FIELD VALIDATION HELPERS
 * =========================================================
 */

/**
 * Password confirmation.
 *
 * Returns a [check, options] tuple so it can be spread
 * directly into `.refine()`.
 *
 * Example:
 *
 * const schema = z
 *   .object({
 *     password: passwordSchema,
 *     confirmPassword: requiredString(
 *       'Confirm password'
 *     ),
 *   })
 *   .refine(...passwordsMatch(
 *     'password',
 *     'confirmPassword'
 *   ))
 */
export const passwordsMatch = (
    passwordField = 'password',
    confirmPasswordField = 'confirmPassword',
) =>
    [
        (data: Record<string, unknown>) =>
            data[passwordField] === data[confirmPasswordField],
        {
            message: 'Passwords do not match',
            path: [confirmPasswordField],
        },
    ] as const


/**
 * =========================================================
 * REUSABLE REGEX
 * =========================================================
 */

/**
 * Common patterns that may be useful
 * throughout the application.
 */

export const validationRegex = {
    /**
     * Basic username:
     * letters, numbers, underscore
     */
    username: /^[A-Za-z0-9_]+$/,

    /**
     * Alphanumeric + spaces
     */
    alphanumericWithSpaces: /^[A-Za-z0-9\s]+$/,

    /**
     * Letters + spaces
     */
    lettersWithSpaces: /^[A-Za-z\s]+$/,

    /**
     * Indian PIN code
     */
    indianPinCode: /^[1-9][0-9]{5}$/,

    /**
     * Basic hex color
     */
    hexColor: /^#(?:[0-9a-fA-F]{3}){1,2}$/,

    /**
     * UUID
     */
    uuid:
        /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,
} as const


/**
 * =========================================================
 * USAGE EXAMPLE
 * =========================================================
 *
 * For a new feature, you don't need to reinvent validation.
 *
 * import { z } from 'zod'
 * import {
 *   requiredString,
 *   emailSchema,
 *   optionalPhoneSchema,
 *   requiredSelect,
 *   requiredCheckbox,
 *   passwordSchema,
 *   passwordsMatch,
 * } from '@/lib/validation'
 *
 * export const userSchema = z.object({
 *   name: requiredString('Name'),
 *   email: emailSchema,
 *   phone: optionalPhoneSchema,
 *   role: requiredSelect('Role'),
 *   termsAccepted: requiredCheckbox(
 *     'You must accept the terms',
 *   ),
 * })
 *
 * export const signupSchema = z
 *   .object({
 *     password: passwordSchema,
 *     confirmPassword: requiredString('Confirm password'),
 *   })
 *   .refine(...passwordsMatch('password', 'confirmPassword'))
 */