/**
 * Keyboard Keys
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Centralized constants for commonly used `KeyboardEvent.key` values.
 *
 * WHY
 *   Avoids scattering string literals such as `'Escape'`, `'Enter'`, and
 *   `'ArrowDown'` throughout keyboard interaction and accessibility logic.
 *
 * USAGE
 *
 *   import { KEYBOARD_KEYS } from '@/constants/keyboard'
 *
 *   if (event.key === KEYBOARD_KEYS.ESCAPE) {
 *       closeModal()
 *   }
 *
 *   if (event.key === KEYBOARD_KEYS.ENTER) {
 *       submitForm()
 *   }
 *
 *   if (event.key === KEYBOARD_KEYS.ARROW_DOWN) {
 *       moveToNextOption()
 *   }
 *
 * NOTES
 *   - Values match the standard `KeyboardEvent.key` strings.
 *   - These are keyboard key identifiers, not physical keyboard positions.
 *   - Use `event.key` when behavior should depend on the key's meaning.
 *   - Use `event.code` when behavior should depend on the physical key
 *     position.
 * ----------------------------------------------------------------------------
 */

export const KEYBOARD_KEYS = {
    // -------------------------------------------------------------------------
    // Common control keys
    // -------------------------------------------------------------------------

    ENTER: 'Enter',
    ESCAPE: 'Escape',
    TAB: 'Tab',
    SPACE: ' ',
    BACKSPACE: 'Backspace',
    DELETE: 'Delete',

    // -------------------------------------------------------------------------
    // Navigation
    // -------------------------------------------------------------------------

    ARROW_UP: 'ArrowUp',
    ARROW_DOWN: 'ArrowDown',
    ARROW_LEFT: 'ArrowLeft',
    ARROW_RIGHT: 'ArrowRight',

    HOME: 'Home',
    END: 'End',
    PAGE_UP: 'PageUp',
    PAGE_DOWN: 'PageDown',

    // -------------------------------------------------------------------------
    // Editing / input
    // -------------------------------------------------------------------------

    INSERT: 'Insert',
    CLEAR: 'Clear',

    // -------------------------------------------------------------------------
    // Common modifier keys
    // -------------------------------------------------------------------------

    SHIFT: 'Shift',
    CONTROL: 'Control',
    ALT: 'Alt',
    META: 'Meta',

    // -------------------------------------------------------------------------
    // Lock / system keys
    // -------------------------------------------------------------------------

    CAPS_LOCK: 'CapsLock',
    NUM_LOCK: 'NumLock',
    SCROLL_LOCK: 'ScrollLock',

    // -------------------------------------------------------------------------
    // Function keys
    // -------------------------------------------------------------------------

    F1: 'F1',
    F2: 'F2',
    F3: 'F3',
    F4: 'F4',
    F5: 'F5',
    F6: 'F6',
    F7: 'F7',
    F8: 'F8',
    F9: 'F9',
    F10: 'F10',
    F11: 'F11',
    F12: 'F12',
} as const

/**
 * Union of all supported keyboard key values.
 *
 * Example:
 *
 *   function handleKey(key: KeyboardKey) {
 *       ...
 *   }
 */
export type KeyboardKey =
    (typeof KEYBOARD_KEYS)[keyof typeof KEYBOARD_KEYS]