/**
 * camelToTitle
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Converts camelCase or PascalCase strings into a human-readable title.
 *
 *   Examples:
 *
 *     'firstName'        → 'First Name'
 *     'firstNameValue'   → 'First Name Value'
 *     'FirstName'        → 'First Name'
 *     'userID'           → 'User ID'
 *     'APIResponse'      → 'API Response'
 *     'user123Name'      → 'User 123 Name'
 *
 * PARAMETERS
 *   value
 *     The string to convert.
 *
 * RETURN VALUE
 *   A title-cased string with word boundaries separated by spaces.
 *
 * BEHAVIOR
 *   - Handles camelCase.
 *   - Handles PascalCase.
 *   - Preserves consecutive uppercase acronyms.
 *   - Handles transitions between letters and numbers.
 *   - Trims leading/trailing whitespace.
 *   - Collapses existing whitespace.
 *   - Converts the first character of each word to uppercase.
 *
 * EXAMPLES
 *
 *   camelToTitle('firstName')
 *   // 'First Name'
 *
 *   camelToTitle('projectName')
 *   // 'Project Name'
 *
 *   camelToTitle('userID')
 *   // 'User ID'
 *
 *   camelToTitle('APIResponse')
 *   // 'API Response'
 *
 *   camelToTitle('createdAt')
 *   // 'Created At'
 *
 *   camelToTitle('HTTPResponseCode')
 *   // 'HTTP Response Code'
 *
 *   camelToTitle('version2Name')
 *   // 'Version 2 Name'
 *
 * EMPTY VALUES
 *   Empty or whitespace-only strings return an empty string.
 *
 * IMMUTABILITY
 *   Strings are immutable. The input is never modified.
 *
 * ERROR BEHAVIOR
 *   Throws a TypeError when the supplied value is not a string.
 *
 * PERFORMANCE
 *   Time complexity: O(n)
 *   Space complexity: O(n)
 *
 * ----------------------------------------------------------------------------
 */

export function camelToTitle(value: string): string {
    if (typeof value !== 'string') {
        throw new TypeError(
            `camelToTitle: value must be a string. Received: ${typeof value}`
        )
    }

    const normalized = value.trim()

    if (!normalized) {
        return ''
    }

    const result = normalized
        // Handle acronym → normal word:
        // "APIResponse" → "API Response"
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1 $2')

        // Handle lowercase/number → uppercase:
        // "userName" → "user Name"
        // "version2Name" → "version2 Name"
        .replace(/([a-z0-9])([A-Z])/g, '$1 $2')

        // Handle letter → number and number → letter boundaries.
        // "user123name" → "user 123 name"
        .replace(/([a-zA-Z])(\d+)/g, '$1 $2')
        .replace(/(\d+)([a-zA-Z])/g, '$1 $2')

        // Normalize existing whitespace.
        .replace(/\s+/g, ' ')
        .trim()

    return result
        .split(' ')
        .map((word) => {
            if (!word) {
                return ''
            }

            // Preserve all-uppercase acronyms such as API, ID, HTTP.
            if (/^[A-Z0-9]+$/.test(word)) {
                return word
            }

            return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
        })
        .join(' ')
}