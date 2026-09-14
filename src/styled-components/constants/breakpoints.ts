/**
 * Responsive Breakpoints
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Centralized breakpoint values for use with styled-components, so every
 *   styled component in this folder builds its media queries from the same
 *   source instead of hardcoding pixel values.
 *
 * USAGE
 *
 *   import { media } from '@/styled-components/constants/breakpoints'
 *
 *   const Box = styled.div`
 *       padding: 8px;
 *
 *       ${media.tablet} {
 *           padding: 16px;
 *       }
 *
 *       ${media.desktop} {
 *           padding: 24px;
 *       }
 *   `
 *
 * NOTES
 *   - `BREAKPOINTS` holds the raw min-width values (in px) for reference or
 *     for use outside of styled-components (e.g. matchMedia).
 *   - `media` is the mobile-first helper — each key wraps a `min-width`
 *     media query using the CSS template literal tag, ready to be
 *     interpolated straight into a styled-component's template string.
 * ----------------------------------------------------------------------------
 */

import { css, type Interpolation } from 'styled-components'

export const BREAKPOINTS = {
    mobile: 0,
    tablet: 768,
    laptop: 1024,
    desktop: 1280,
    wide: 1536,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

const buildMediaQuery =
    (minWidth: number) =>
    <Props extends object>(styles: TemplateStringsArray, ...args: Interpolation<Props>[]) => css<Props>`
        @media (min-width: ${minWidth}px) {
            ${css<Props>(styles, ...args)}
        }
    `

export const media = {
    tablet: buildMediaQuery(BREAKPOINTS.tablet),
    laptop: buildMediaQuery(BREAKPOINTS.laptop),
    desktop: buildMediaQuery(BREAKPOINTS.desktop),
    wide: buildMediaQuery(BREAKPOINTS.wide),
} as const
