/**
 * useToggle
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Manages a boolean state and provides convenient functions for toggling,
 *   explicitly setting, enabling, and disabling that state.
 *
 *   This is a small utility hook intended for generic boolean state.
 *
 * WHEN TO USE
 *   - UI toggles.
 *   - Sidebar visibility.
 *   - Password visibility.
 *   - Expand/collapse state.
 *   - Filters or optional sections.
 *   - Feature switches controlled entirely by the component.
 *   - Any simple true/false state where `useState<boolean>` would otherwise
 *     be repeated with the same helper logic.
 *
 * WHEN NOT TO USE
 *   - When the state needs controlled/uncontrolled behavior.
 *     Use `useDisclosure` instead.
 *   - When opening/closing a component requires callbacks or additional
 *     semantics such as `open()`, `close()`, and `onOpenChange`.
 *   - When the state has more than two meaningful values.
 *
 * PARAMETERS
 *   initialValue
 *     Initial boolean state.
 *
 *     Default: `false`.
 *
 *     Example:
 *
 *       useToggle()
 *       // false
 *
 *       useToggle(true)
 *       // true
 *
 * RETURN VALUE
 *   {
 *     value,
 *     toggle,
 *     setValue,
 *     enable,
 *     disable,
 *   }
 *
 *   value
 *     Current boolean state.
 *
 *   toggle
 *     Flips the current boolean value.
 *
 *   setValue
 *     Explicitly sets the state to a boolean value.
 *
 *   enable
 *     Sets the value to `true`.
 *
 *   disable
 *     Sets the value to `false`.
 *
 * BEHAVIOR
 *   - `toggle()` uses a functional state update, so it always works with the
 *     latest state and does not suffer from stale state closures.
 *   - All action functions have stable references between renders.
 *   - Calling `enable()` when already enabled or `disable()` when already
 *     disabled is safe and does not cause unnecessary state changes.
 *
 * RETURN FUNCTION STABILITY
 *   `toggle`, `setValue`, `enable`, and `disable` are memoized with
 *   `useCallback` and remain referentially stable between renders.
 *
 * SSR
 *   Fully SSR-safe.
 *
 *   No browser APIs are used.
 *
 * CLEANUP
 *   None required.
 *
 * PERFORMANCE
 *   Uses React state only.
 *
 *   No effects, timers, subscriptions, or browser APIs are involved.
 *
 * USAGE
 *
 *   const {
 *     value: isOpen,
 *     toggle,
 *     close: disable,
 *   } = useToggle()
 *
 *   <button onClick={toggle}>
 *     Toggle
 *   </button>
 *
 * USAGE WITH EXPLICIT CONTROL
 *
 *   const {
 *     value: isVisible,
 *     enable,
 *     disable,
 *   } = useToggle()
 *
 *   <button onClick={enable}>
 *     Show
 *   </button>
 *
 *   <button onClick={disable}>
 *     Hide
 *   </button>
 *
 * ----------------------------------------------------------------------------
 */

import { useCallback, useState } from 'react'

export interface UseToggleReturn {
    /**
     * Current boolean state.
     */
    value: boolean

    /**
     * Flip the current boolean value.
     */
    toggle: () => void

    /**
     * Explicitly set the boolean value.
     */
    setValue: (value: boolean) => void

    /**
     * Set the value to true.
     */
    enable: () => void

    /**
     * Set the value to false.
     */
    disable: () => void
}

export function useToggle(
    initialValue = false
): UseToggleReturn {
    const [value, setValue] = useState<boolean>(
        initialValue
    )

    const toggle = useCallback(() => {
        setValue((previousValue) => !previousValue)
    }, [])

    const enable = useCallback(() => {
        setValue(true)
    }, [])

    const disable = useCallback(() => {
        setValue(false)
    }, [])

    const setBooleanValue = useCallback(
        (nextValue: boolean) => {
            setValue(nextValue)
        },
        []
    )

    return {
        value,
        toggle,
        setValue: setBooleanValue,
        enable,
        disable,
    }
}