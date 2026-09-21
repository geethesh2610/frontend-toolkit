/**
 * Z-Index Scale
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   A single, centralized stacking-order scale for anything that needs to
 *   layer above normal page content.
 *
 * WHY
 *   Without one source of truth, `z-index` turns into an arms race —
 *   `z-index: 9999`, then `99999` to beat it, then `999999`... A shared
 *   scale with real gaps between tiers means every new overlay-ish
 *   component has an obvious, correct value to reach for instead of
 *   guessing a number big enough to "win."
 *
 * USAGE
 *
 *   import { Z_INDEX } from '@/constants/zIndex'
 *
 *   const Overlay = styled.div`
 *       z-index: ${Z_INDEX.OVERLAY};
 *   `
 *
 *   // inline style
 *   <div style={{ zIndex: Z_INDEX.TOOLTIP }}>
 *
 * NOTES
 *   - Ordered low → high; later tiers are meant to visually sit ABOVE
 *     earlier ones (a TOAST should be visible over a MODAL, a TOOLTIP over
 *     a POPOVER, etc).
 *   - The gap of 100 between tiers is deliberate headroom — if a component
 *     genuinely needs to sit between two tiers (rare), it can use e.g.
 *     `Z_INDEX.MODAL + 10` without colliding with the next tier.
 *   - `z-index` only has effect on a positioned element (`position` other
 *     than `static`) — this scale doesn't fix that for you.
 *   - This scale assumes ONE global stacking context (the common case for
 *     most apps). If a component creates its own stacking context (e.g. via
 *     `transform`/`filter`/`will-change` on an ancestor), these values are
 *     only compared against siblings within that same context — a high
 *     `Z_INDEX` value can't escape a lower ancestor's stacking context.
 * ----------------------------------------------------------------------------
 */

export const Z_INDEX = {
    // -------------------------------------------------------------------------
    // Base content — most things never need to set z-index at all; this
    // exists so a component can explicitly opt IN to the bottom of the
    // scale rather than relying on the implicit default of `auto`.
    // -------------------------------------------------------------------------

    BASE: 0,

    // -------------------------------------------------------------------------
    // In-flow layering — content still part of the page's normal layout
    // -------------------------------------------------------------------------

    DROPDOWN: 100,
    STICKY: 200,
    FIXED: 300,

    // -------------------------------------------------------------------------
    // Above the page — overlays that cover other content
    // -------------------------------------------------------------------------

    OVERLAY: 400,
    DRAWER: 500,
    MODAL: 600,
    POPOVER: 700,

    // -------------------------------------------------------------------------
    // Above everything else — must always win
    // -------------------------------------------------------------------------

    TOOLTIP: 800,
    TOAST: 900,
} as const

/**
 * Union of all supported z-index values.
 *
 * Example:
 *
 *   function Overlay({ zIndex = Z_INDEX.OVERLAY }: { zIndex?: ZIndex }) {
 *       ...
 *   }
 */
export type ZIndex = (typeof Z_INDEX)[keyof typeof Z_INDEX]
