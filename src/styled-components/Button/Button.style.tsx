/**
 * Button styles (styled-components example)
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Styled-component definitions for the Button example. Split out from
 *   Button.tsx so the component file only deals with markup/props while this
 *   file owns the CSS — the convention to follow for any other component
 *   added under src/styled-components/.
 *
 *   Also demonstrates a full mobile-first responsive scale using every
 *   breakpoint from constants/breakpoints.ts (tablet, laptop, desktop, wide).
 * ----------------------------------------------------------------------------
 */

import styled, { css } from 'styled-components'
import { media } from '../constants/breakpoints'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps {
    variant?: ButtonVariant
    size?: ButtonSize
    fullWidth?: boolean
}

const VARIANT_STYLES: Record<ButtonVariant, ReturnType<typeof css>> = {
    primary: css`
        background: #2563eb;
        color: #ffffff;
        border: 1px solid transparent;

        &:hover {
            background: #1d4ed8;
        }
    `,
    secondary: css`
        background: #f1f5f9;
        color: #0f172a;
        border: 1px solid #cbd5e1;

        &:hover {
            background: #e2e8f0;
        }
    `,
    ghost: css`
        background: transparent;
        color: #2563eb;
        border: 1px solid transparent;

        &:hover {
            background: rgba(37, 99, 235, 0.08);
        }
    `,
}

const SIZE_STYLES: Record<ButtonSize, ReturnType<typeof css>> = {
    sm: css`
        padding: 6px 12px;
        font-size: 12px;
    `,
    md: css`
        padding: 7px 14px;
        font-size: 13px;
    `,
    lg: css`
        padding: 8px 16px;
        font-size: 14px;
    `,
}

export const StyledButton = styled.button<ButtonProps>`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 6px;
    width: ${({ fullWidth }) => (fullWidth ? '100%' : 'auto')};
    border-radius: 6px;
    font-weight: 500;
    line-height: 1.2;
    cursor: pointer;
    transition:
        background-color 0.15s ease,
        transform 0.1s ease;

    ${({ variant = 'primary' }) => VARIANT_STYLES[variant]}
    ${({ size = 'md' }) => SIZE_STYLES[size]}

    /* >= 768px: comfortable padding, standard text size */
    ${media.tablet`
        gap: 8px;
        font-size: 14px;
        padding: 8px 16px;
    `}

    /* >= 1024px: a touch more breathing room, hover lift */
    ${media.laptop`
        padding: 9px 18px;
        border-radius: 8px;

        &:hover {
            transform: translateY(-1px);
        }
    `}

    /* >= 1280px: slightly larger type for readability at desktop distance */
    ${media.desktop`
        font-size: 15px;
        gap: 10px;
    `}

    /* >= 1536px: roomiest variant for wide/high-res displays */
    ${media.wide`
        padding: 10px 22px;
        font-size: 16px;
    `}

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;

        &:hover {
            transform: none;
        }
    }
`
