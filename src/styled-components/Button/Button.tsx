/**
 * Button (styled-components example)
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Reference example showing how to structure a styled-components component
 *   in this toolkit: markup/props live here, CSS lives in Button.style.tsx.
 *
 * USAGE
 *
 *   import { Button } from '@/styled-components/Button'
 *
 *   <Button variant="primary" size="md">Save</Button>
 *   <Button variant="ghost" size="sm" fullWidth>Cancel</Button>
 *
 * NOTES
 *   - Kept deliberately simple — this is a pattern to copy from, not a
 *     component meant to grow variants indefinitely.
 * ----------------------------------------------------------------------------
 */

import type { ButtonHTMLAttributes } from 'react'
import { StyledButton, type ButtonProps } from './Button.style'

export type { ButtonProps, ButtonVariant, ButtonSize } from './Button.style'

export function Button({
    variant,
    size,
    fullWidth,
    ...rest
}: ButtonProps & ButtonHTMLAttributes<HTMLButtonElement>) {
    return <StyledButton variant={variant} size={size} fullWidth={fullWidth} {...rest} />
}
