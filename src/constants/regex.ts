/**
 * Common Regex Patterns
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Centralized, ready-to-use patterns for common format checks (email, URL,
 *   UUID, slugs, ...) — usable anywhere a plain `RegExp` is needed:
 *   `<input pattern>`, manual `.test()` checks, `String.replace`, etc.
 *
 * RELATIONSHIP TO utils/validation/zod.ts
 *   `zod.ts`'s `validationRegex` bag has some overlap with this file
 *   (`username`, `hexColor`, `uuid`, ...) — that one exists specifically to
 *   back Zod schema factories. This file is for everything ELSE: projects
 *   not using Zod, or anywhere you just need the raw pattern without a
 *   schema wrapped around it.
 *
 * IMPORTANT — THESE ARE FORMAT CHECKS, NOT SECURITY OR RFC-COMPLIANCE TOOLS
 *   - `EMAIL` is the common pragmatic pattern (rejects obviously malformed
 *     input), not a full RFC 5322 implementation — RFC 5322 email addresses
 *     are absurdly permissive (`"very.unusual.@.unusual.com"@example.com`
 *     is technically valid) and no practical form should try to fully
 *     validate against it. The only real way to confirm an email address
 *     works is to send it something.
 *   - None of these patterns sanitize input for HTML/SQL/shell injection —
 *     matching a format is not the same as making a value safe to use
 *     unescaped in a different context.
 *
 * USAGE
 *
 *   import { REGEX } from '@/constants/regex'
 *
 *   REGEX.EMAIL.test(value)
 *   <input pattern={REGEX.SLUG.source} />
 * ----------------------------------------------------------------------------
 */

export const REGEX = {
    // -------------------------------------------------------------------------
    // Contact / identity
    // -------------------------------------------------------------------------

    /** Pragmatic email check — see the file header's RFC 5322 caveat. */
    EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

    /** E.164 international phone format, e.g. `+14155552671`. */
    PHONE_E164: /^\+[1-9]\d{1,14}$/,

    // -------------------------------------------------------------------------
    // Web
    // -------------------------------------------------------------------------

    /** `http(s)://...` URLs. */
    URL: /^https?:\/\/[^\s$.?#].[^\s]*$/i,

    /** Lowercase, hyphen-separated — `'my-post-title'`. No leading/trailing/double hyphens. */
    SLUG: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,

    /** IPv4 dotted-quad, e.g. `192.168.1.1`. */
    IPV4: /^(?:(?:25[0-5]|2[0-4]\d|1?\d?\d)\.){3}(?:25[0-5]|2[0-4]\d|1?\d?\d)$/,

    // -------------------------------------------------------------------------
    // Identifiers
    // -------------------------------------------------------------------------

    /** UUID v1–v5. */
    UUID: /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

    /** Letters, numbers, underscore — no length bound (enforce min/max separately). */
    USERNAME: /^[A-Za-z0-9_]+$/,

    // -------------------------------------------------------------------------
    // Formatting / display
    // -------------------------------------------------------------------------

    /** `#rgb` or `#rrggbb`. */
    HEX_COLOR: /^#(?:[0-9a-fA-F]{3}){1,2}$/,

    /** Letters and digits only, no spaces/punctuation. */
    ALPHANUMERIC: /^[A-Za-z0-9]+$/,

    /** Letters and spaces only. */
    ALPHA_SPACES: /^[A-Za-z\s]+$/,

    /** Letters, digits, and spaces. */
    ALPHANUMERIC_SPACES: /^[A-Za-z0-9\s]+$/,

    // -------------------------------------------------------------------------
    // Security-adjacent
    // -------------------------------------------------------------------------

    /**
     * Min 8 characters, at least one lowercase, one uppercase, one digit,
     * one symbol. A reasonable DEFAULT strength bar — swap it for your
     * own if a project has different password policy requirements.
     */
    STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/,
} as const

/**
 * Union of all pattern names in `REGEX`.
 *
 * Example:
 *
 *   function validate(value: string, pattern: RegexName): boolean {
 *       return REGEX[pattern].test(value)
 *   }
 */
export type RegexName = keyof typeof REGEX
