/**
 * slugify
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Converts a string into a URL-friendly slug.
 *
 *   A slug:
 *     - uses lowercase characters
 *     - separates words with hyphens
 *     - removes punctuation and unsafe characters
 *     - removes duplicate separators
 *     - removes leading/trailing separators
 *
 * EXAMPLES
 *
 *   slugify('Hello World')
 *   // 'hello-world'
 *
 *   slugify('React & TypeScript')
 *   // 'react-typescript'
 *
 *   slugify('My First Blog Post!')
 *   // 'my-first-blog-post'
 *
 *   slugify('  Hello   World  ')
 *   // 'hello-world'
 *
 * PARAMETERS
 *   value
 *     String to convert into a slug.
 *
 *   options
 *     Optional configuration.
 *
 *     separator
 *       Character used between words.
 *       Default: '-'
 *
 *       Example:
 *         slugify('Hello World', { separator: '_' })
 *         // 'hello_world'
 *
 *     lowercase
 *       Whether the resulting slug should be lowercase.
 *       Default: true.
 *
 * RETURN VALUE
 *   A URL-friendly slug string.
 *
 * UNICODE
 *   Unicode characters are normalized using NFKD normalization where
 *   supported. Diacritical marks are removed.
 *
 *   Example:
 *
 *     slugify('Crème Brûlée')
 *     // 'creme-brulee'
 *
 *   Non-Latin characters are preserved when they are valid Unicode letters.
 *
 *     slugify('こんにちは 世界')
 *     // 'こんにちは-世界'
 *
 * SECURITY
 *   This utility is intended for creating identifiers and URLs.
 *
 *   It does NOT sanitize HTML, JavaScript, SQL, or user-generated content
 *   for security purposes.
 *
 * ERROR BEHAVIOR
 *   Throws a TypeError when the supplied value is not a string.
 *
 *   Returns an empty string when the input contains no usable characters.
 *
 * IMMUTABILITY
 *   Strings are immutable. The input is never modified.
 *
 * PERFORMANCE
 *   Time complexity: O(n)
 *   Space complexity: O(n)
 *
 * ----------------------------------------------------------------------------
 */

export interface SlugifyOptions {
    /**
     * Character used to separate words.
     *
     * Default: '-'
     */
    separator?: string

    /**
     * Convert the result to lowercase.
     *
     * Default: true.
     */
    lowercase?: boolean
}

export function slugify(
    value: string,
    options: SlugifyOptions = {}
): string {
    if (typeof value !== 'string') {
        throw new TypeError(
            `slugify: value must be a string. Received: ${typeof value}`
        )
    }

    const {
        separator = '-',
        lowercase = true,
    } = options

    if (separator.length === 0) {
        throw new TypeError(
            'slugify: separator must not be empty.'
        )
    }

    const normalized = value
        .normalize('NFKD')
        .replace(/[\u0300-\u036f]/g, '')

    const result = normalized
        // Add a separator between camelCase boundaries.
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')

        // Replace anything that is not a Unicode letter, number,
        // whitespace, or the chosen separator with a space.
        .replace(/[^\p{L}\p{N}\s]+/gu, ' ')

        // Normalize whitespace.
        .trim()
        .replace(/\s+/g, separator)

        // Collapse repeated separators.
        .replace(
            new RegExp(`(?:${escapeRegExp(separator)})+`, 'g'),
            separator
        )

        // Remove separators from the beginning/end.
        .replace(
            new RegExp(
                `^${escapeRegExp(separator)}|${escapeRegExp(separator)}$`,
                'g'
            ),
            ''
        )

    return lowercase
        ? result.toLocaleLowerCase()
        : result
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}