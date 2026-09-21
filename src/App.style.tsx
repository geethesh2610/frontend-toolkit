/*
 * Layout/styling for App.tsx — a small docs site (sidebar + content), not a
 * live demo. UI font is Inter, code font is Fira Code (both loaded in
 * index.html).
 *
 * THEMING
 *   Colors live as CSS custom properties (--ft-*) on `:root`, defined once
 *   for light and redefined for dark in two places: under
 *   `@media (prefers-color-scheme: dark)` (so the site follows the OS/browser
 *   setting by default) and under `:root[data-theme="dark"]` (so the explicit
 *   toggle in the sidebar can force either mode regardless of the system
 *   setting). The code-view panes (FileHeader/Pre/etc.) are deliberately
 *   NOT themed — they stay a fixed dark "terminal" register in both modes,
 *   matching how most code viewers/editors behave.
 */

import styled, { css, createGlobalStyle } from 'styled-components'

const mono = css`
    font-family: 'Fira Code', 'SFMono-Regular', Consolas, monospace;
`

export const GlobalStyle = createGlobalStyle`
    :root {
        --ft-bg: #fafafa;
        --ft-bg-elevated: #ffffff;
        --ft-bg-hover: #f4f4f5;
        --ft-border: #ececef;
        --ft-border-dashed: #d4d4d8;
        --ft-text: #0f172a;
        --ft-text-secondary: #52525b;
        --ft-text-muted: #71717a;
        --ft-text-faint: #a1a1aa;
        --ft-accent: #6366f1;
        --ft-accent-strong: #4338ca;
        --ft-accent-tint-1: rgba(99, 102, 241, 0.06);
        --ft-accent-tint-2: rgba(99, 102, 241, 0.08);
        --ft-accent-tint-3: rgba(99, 102, 241, 0.1);
        --ft-accent-tint-4: rgba(99, 102, 241, 0.12);
        --ft-accent-border-hover: #c7d2fe;
        --ft-card-shadow: rgba(79, 70, 229, 0.3);
        --ft-folder-link-text: #3f3f46;
        --ft-scrollbar-thumb: rgba(0, 0, 0, 0.16);
        --ft-danger: #dc2626;
        --ft-danger-tint: rgba(220, 38, 38, 0.08);
        color-scheme: light;
    }

    @media (prefers-color-scheme: dark) {
        :root:not([data-theme='light']) {
            --ft-bg: #0b0d12;
            --ft-bg-elevated: #14161c;
            --ft-bg-hover: #1b1e26;
            --ft-border: #262a33;
            --ft-border-dashed: #363c47;
            --ft-text: #f1f5f9;
            --ft-text-secondary: #b7bec9;
            --ft-text-muted: #8b93a1;
            --ft-text-faint: #6b7280;
            --ft-accent: #818cf8;
            --ft-accent-strong: #a5b4fc;
            --ft-accent-tint-1: rgba(129, 140, 248, 0.1);
            --ft-accent-tint-2: rgba(129, 140, 248, 0.14);
            --ft-accent-tint-3: rgba(129, 140, 248, 0.18);
            --ft-accent-tint-4: rgba(129, 140, 248, 0.22);
            --ft-accent-border-hover: #4c4f9e;
            --ft-card-shadow: rgba(0, 0, 0, 0.6);
            --ft-folder-link-text: #c7cad1;
            --ft-scrollbar-thumb: rgba(255, 255, 255, 0.18);
            --ft-danger: #f87171;
            --ft-danger-tint: rgba(248, 113, 113, 0.12);
            color-scheme: dark;
        }
    }

    :root[data-theme='dark'] {
        --ft-bg: #0b0d12;
        --ft-bg-elevated: #14161c;
        --ft-bg-hover: #1b1e26;
        --ft-border: #262a33;
        --ft-border-dashed: #363c47;
        --ft-text: #f1f5f9;
        --ft-text-secondary: #b7bec9;
        --ft-text-muted: #8b93a1;
        --ft-text-faint: #6b7280;
        --ft-accent: #818cf8;
        --ft-accent-strong: #a5b4fc;
        --ft-accent-tint-1: rgba(129, 140, 248, 0.1);
        --ft-accent-tint-2: rgba(129, 140, 248, 0.14);
        --ft-accent-tint-3: rgba(129, 140, 248, 0.18);
        --ft-accent-tint-4: rgba(129, 140, 248, 0.22);
        --ft-accent-border-hover: #4c4f9e;
        --ft-card-shadow: rgba(0, 0, 0, 0.6);
        --ft-folder-link-text: #c7cad1;
        --ft-scrollbar-thumb: rgba(255, 255, 255, 0.18);
        --ft-danger: #f87171;
        --ft-danger-tint: rgba(248, 113, 113, 0.12);
        color-scheme: dark;
    }

    * {
        box-sizing: border-box;
    }

    body {
        margin: 0;
        background: var(--ft-bg);
        color: var(--ft-text);
        font-family: 'Inter', system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
        transition: background 160ms ease, color 160ms ease;
    }

    ::selection {
        background: var(--ft-accent-tint-4);
        color: var(--ft-text);
    }

    :focus-visible {
        outline: 2px solid var(--ft-accent);
        outline-offset: 2px;
    }

    * {
        scrollbar-width: thin;
        scrollbar-color: var(--ft-scrollbar-thumb) transparent;
    }

    *::-webkit-scrollbar {
        width: 10px;
        height: 10px;
    }

    *::-webkit-scrollbar-thumb {
        background: var(--ft-scrollbar-thumb);
        border-radius: 999px;
        border: 2px solid transparent;
        background-clip: padding-box;
    }
`

/* ---------------------------------------------------------------- */
/* Shell                                                             */
/* ---------------------------------------------------------------- */

export const Layout = styled.div`
    display: grid;
    grid-template-columns: 272px minmax(0, 1fr);
    min-height: 100vh;
    color: var(--ft-text);

    @media (max-width: 760px) {
        grid-template-columns: 1fr;
    }
`

export const MobileTopBar = styled.div`
    display: none;
    align-items: center;
    justify-content: space-between;
    gap: 10px;
    padding: 12px 16px;
    background: var(--ft-bg-elevated);
    border-bottom: 1px solid var(--ft-border);
    position: sticky;
    top: 0;
    z-index: 20;

    @media (max-width: 760px) {
        display: flex;
    }
`

export const MobileMenuButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 34px;
    height: 34px;
    border-radius: 8px;
    border: 1px solid var(--ft-border);
    background: var(--ft-bg);
    color: var(--ft-text);
    cursor: pointer;
    font-size: 16px;
    line-height: 1;

    &:hover {
        border-color: var(--ft-accent-border-hover);
        color: var(--ft-accent-strong);
    }
`

export const SidebarOverlay = styled.div`
    display: none;

    @media (max-width: 760px) {
        display: block;
        position: fixed;
        inset: 0;
        background: rgba(0, 0, 0, 0.4);
        z-index: 29;
    }
`

export const Sidebar = styled.aside<{ $mobileOpen?: boolean }>`
    position: sticky;
    top: 0;
    align-self: start;
    max-height: 100vh;
    overflow-y: auto;
    padding: 22px 16px 40px;
    background: var(--ft-bg-elevated);
    border-right: 1px solid var(--ft-border);
    transition: background 160ms ease, border-color 160ms ease;

    @media (max-width: 760px) {
        position: fixed;
        inset: 0 20% 0 0;
        max-width: 320px;
        z-index: 30;
        max-height: 100vh;
        border-right: 1px solid var(--ft-border);
        border-bottom: none;
        box-shadow: 20px 0 40px -20px rgba(0, 0, 0, 0.35);
        transform: translateX(${({ $mobileOpen }) => ($mobileOpen ? '0' : '-100%')});
        transition: transform 200ms ease;
    }
`

export const Brand = styled.a`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
    text-decoration: none;
`

export const BrandRow = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
`

export const BrandMark = styled.div`
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    border-radius: 9px;
    background: linear-gradient(135deg, #6366f1, #4338ca);
    color: #ffffff;
    font-weight: 800;
    font-size: 13px;
    letter-spacing: -0.02em;
    box-shadow: 0 4px 10px -3px rgba(67, 56, 202, 0.55);
`

export const BrandName = styled.span`
    font-size: 15px;
    font-weight: 700;
    color: var(--ft-text);
    letter-spacing: -0.01em;
`

export const ThemeToggleButton = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;
    flex: 0 0 auto;
    border-radius: 8px;
    border: 1px solid var(--ft-border);
    background: var(--ft-bg);
    color: var(--ft-text-muted);
    cursor: pointer;
    font-size: 14px;
    transition: border-color 120ms ease, color 120ms ease, transform 120ms ease;

    &:hover {
        border-color: var(--ft-accent-border-hover);
        color: var(--ft-accent-strong);
        transform: translateY(-1px);
    }
`

export const SidebarSubtitle = styled.p`
    margin: 0 0 18px;
    font-size: 11.5px;
    color: var(--ft-text-faint);
    line-height: 1.5;
`

export const SearchBox = styled.div`
    position: relative;
    margin-bottom: 20px;
`

export const SearchIcon = styled.span`
    position: absolute;
    left: 10px;
    top: 50%;
    transform: translateY(-50%);
    font-size: 12px;
    color: var(--ft-text-faint);
    pointer-events: none;
`

export const SearchInput = styled.input`
    width: 100%;
    padding: 7px 10px 7px 28px;
    font-size: 12.5px;
    font-family: inherit;
    color: var(--ft-text);
    background: var(--ft-bg-hover);
    border: 1px solid transparent;
    border-radius: 8px;
    outline: none;
    transition: border-color 120ms ease, background 120ms ease, box-shadow 120ms ease;

    &::placeholder {
        color: var(--ft-text-faint);
    }

    &:focus {
        background: var(--ft-bg-elevated);
        border-color: var(--ft-accent);
        box-shadow: 0 0 0 3px var(--ft-accent-tint-4);
    }
`

export const NoResults = styled.p`
    padding: 4px 4px;
    font-size: 12px;
    color: var(--ft-text-faint);
`

export const SidebarGroup = styled.div`
    margin-bottom: 4px;
`

export const SidebarFolderLink = styled.a<{ $active?: boolean }>`
    ${mono}
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    margin-top: 14px;
    padding: 5px 8px;
    border-radius: 7px;
    font-size: 12px;
    font-weight: 700;
    text-decoration: none;
    color: ${({ $active }) => ($active ? 'var(--ft-accent-strong)' : 'var(--ft-folder-link-text)')};
    background: ${({ $active }) => ($active ? 'var(--ft-accent-tint-3)' : 'transparent')};
    transition: background 120ms ease, color 120ms ease;

    &:hover {
        color: var(--ft-accent-strong);
        background: var(--ft-accent-tint-2);
    }
`

export const CountBadge = styled.span`
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: var(--ft-text-faint);
`

export const SidebarItemLink = styled.a<{ $active?: boolean }>`
    ${mono}
    display: block;
    margin: 1px 0 1px 8px;
    padding: 4px 8px 4px 14px;
    font-size: 11.5px;
    text-decoration: none;
    border-radius: 6px;
    border-left: 2px solid ${({ $active }) => ($active ? 'var(--ft-accent)' : 'transparent')};
    color: ${({ $active }) => ($active ? 'var(--ft-accent-strong)' : 'var(--ft-text-muted)')};
    font-weight: ${({ $active }) => ($active ? 600 : 400)};
    background: ${({ $active }) => ($active ? 'var(--ft-accent-tint-2)' : 'transparent')};
    transition: background 120ms ease, color 120ms ease;

    &:hover {
        color: var(--ft-accent-strong);
        background: var(--ft-accent-tint-1);
    }
`

export const Content = styled.main`
    min-width: 0;
    padding: 48px 56px 120px;
    max-width: 840px;
    animation: ft-content-in 180ms ease;

    @keyframes ft-content-in {
        from {
            opacity: 0;
            transform: translateY(4px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }

    @media (max-width: 760px) {
        padding: 28px 20px 80px;
    }
`

/* ---------------------------------------------------------------- */
/* Home                                                               */
/* ---------------------------------------------------------------- */

export const Kicker = styled.div`
    ${mono}
    font-size: 12px;
    font-weight: 600;
    color: var(--ft-accent);
    margin-bottom: 10px;
`

export const Title = styled.h1`
    margin: 0 0 12px;
    font-size: 30px;
    font-weight: 800;
    letter-spacing: -0.02em;
`

export const Subtitle = styled.p`
    margin: 0 0 32px;
    max-width: 580px;
    color: var(--ft-text-secondary);
    font-size: 15px;
    line-height: 1.7;
`

export const StatGrid = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 36px;
`

export const StatTile = styled.div`
    min-width: 120px;
    padding: 14px 18px;
    border: 1px solid var(--ft-border);
    border-radius: 12px;
    background: var(--ft-bg-elevated);
`

export const StatNumber = styled.div`
    font-size: 22px;
    font-weight: 800;
    color: var(--ft-text);
    letter-spacing: -0.02em;
`

export const StatLabel = styled.div`
    margin-top: 2px;
    font-size: 12px;
    color: var(--ft-text-faint);
`

export const Hint = styled.p`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    margin: 0;
    background: var(--ft-bg);
    border: 1px dashed var(--ft-border-dashed);
    border-radius: 10px;
    color: var(--ft-text-muted);
    font-size: 13px;
`

/* ---------------------------------------------------------------- */
/* Folder overview                                                   */
/* ---------------------------------------------------------------- */

export const Eyebrow = styled.div`
    ${mono}
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ft-text-faint);
    margin-bottom: 8px;
`

export const FolderHeading = styled.h1`
    ${mono}
    margin: 0 0 12px;
    font-size: 24px;
    font-weight: 700;
    color: var(--ft-text);
`

export const FolderBlurb = styled.p`
    margin: 0 0 32px;
    max-width: 620px;
    font-size: 14.5px;
    color: var(--ft-text-secondary);
    line-height: 1.7;
`

export const ItemCardList = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

export const ItemCard = styled.a`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 16px;
    padding: 14px 18px;
    border: 1px solid var(--ft-border);
    border-radius: 12px;
    background: var(--ft-bg-elevated);
    text-decoration: none;
    color: inherit;
    transition: border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;

    &:hover {
        border-color: var(--ft-accent-border-hover);
        box-shadow: 0 8px 20px -10px var(--ft-card-shadow);
        transform: translateY(-1px);
    }

    &:hover .chev {
        transform: translateX(2px);
        color: var(--ft-accent-strong);
    }
`

export const ItemCardText = styled.div`
    min-width: 0;
`

export const ItemCardName = styled.div`
    ${mono}
    font-size: 13.5px;
    font-weight: 600;
    color: var(--ft-text);
    margin-bottom: 4px;
`

export const ItemCardUse = styled.div`
    font-size: 13px;
    color: var(--ft-text-muted);
    line-height: 1.55;
`

export const Chevron = styled.span`
    flex: 0 0 auto;
    color: var(--ft-border-dashed);
    font-size: 15px;
    transition: transform 140ms ease, color 140ms ease;
`

/* ---------------------------------------------------------------- */
/* Code view                                                         */
/* ---------------------------------------------------------------- */

export const Breadcrumb = styled.a`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    margin-bottom: 20px;
    font-size: 13px;
    font-weight: 500;
    color: var(--ft-accent);
    text-decoration: none;
    cursor: pointer;

    &:hover {
        color: var(--ft-accent-strong);
    }
`

export const CodeTitle = styled.h1`
    ${mono}
    margin: 0 0 12px;
    font-size: 25px;
    font-weight: 700;
    letter-spacing: -0.01em;
`

export const CodeMeta = styled.p`
    margin: 0 0 20px;
    max-width: 620px;
    font-size: 14.5px;
    color: var(--ft-text-secondary);
    line-height: 1.7;
`

export const SourceHeading = styled.div`
    ${mono}
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: var(--ft-text-faint);
    margin: 0 0 10px;
`

export const FileBlock = styled.div`
    margin-bottom: 18px;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 14px 30px -16px rgba(15, 23, 42, 0.45);
`

export const FileHeader = styled.div`
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    padding: 10px 14px;
    background: #161b22;
    border-bottom: 1px solid #262c36;
`

export const WindowDots = styled.div`
    display: flex;
    gap: 6px;
    flex: 0 0 auto;

    span {
        width: 9px;
        height: 9px;
        border-radius: 50%;
        display: inline-block;
    }

    span:nth-child(1) {
        background: #f87171;
    }

    span:nth-child(2) {
        background: #fbbf24;
    }

    span:nth-child(3) {
        background: #4ade80;
    }
`

export const FilePath = styled.span`
    ${mono}
    flex: 1;
    text-align: center;
    font-size: 12px;
    color: #9ca3af;
    word-break: break-all;
`

export const CopyButton = styled.button<{ $copied?: boolean }>`
    flex: 0 0 auto;
    padding: 4px 10px;
    font-size: 11.5px;
    font-weight: 500;
    border-radius: 6px;
    border: 1px solid ${({ $copied }) => ($copied ? '#22c55e' : '#30363d')};
    background: ${({ $copied }) => ($copied ? 'rgba(34, 197, 94, 0.12)' : 'transparent')};
    color: ${({ $copied }) => ($copied ? '#4ade80' : '#9ca3af')};
    cursor: pointer;
    transition: background 120ms ease, border-color 120ms ease, color 120ms ease;

    &:hover {
        border-color: #818cf8;
        color: #a5b4fc;
    }
`

export const Pre = styled.pre`
    ${mono}
    margin: 0;
    padding: 18px;
    overflow-x: auto;
    background: #0d1117;
    color: #e6edf3;
    font-size: 12.5px;
    line-height: 1.7;

    .token.comment {
        color: #6b7280;
        font-style: italic;
    }
    .token.keyword,
    .token.tag {
        color: #c792ea;
    }
    .token.string,
    .token.attr-value {
        color: #9ece6a;
    }
    .token.function,
    .token.class-name {
        color: #82aaff;
    }
    .token.number,
    .token.boolean,
    .token.constant {
        color: #f78c6c;
    }
    .token.property,
    .token.attr-name {
        color: #ffcb6b;
    }
    .token.punctuation,
    .token.operator {
        color: #8b949e;
    }
`

export const MissingNote = styled.p`
    padding: 14px;
    margin: 0;
    background: #0d1117;
    font-size: 13px;
    color: #f87171;
`

/* ---------------------------------------------------------------- */
/* Dependency links                                                   */
/* ---------------------------------------------------------------- */

export const DependsOnRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 6px 8px;
    margin: 0 0 24px;
`

export const DependsOnLabel = styled.span`
    font-size: 11.5px;
    font-weight: 600;
    color: var(--ft-text-faint);
`

export const DependencyChip = styled.a`
    ${mono}
    display: inline-flex;
    align-items: center;
    gap: 4px;
    padding: 3px 9px;
    font-size: 11.5px;
    border-radius: 999px;
    border: 1px solid var(--ft-border);
    background: var(--ft-bg-elevated);
    color: var(--ft-text-muted);
    text-decoration: none;
    transition: border-color 120ms ease, color 120ms ease, background 120ms ease;

    &:hover {
        border-color: var(--ft-accent-border-hover);
        color: var(--ft-accent-strong);
        background: var(--ft-accent-tint-1);
    }
`

/* ---------------------------------------------------------------- */
/* Live example / demo kit                                           */
/* Shared, theme-aware primitives so each item's example file stays  */
/* short (compose these instead of writing bespoke CSS per demo).    */
/* ---------------------------------------------------------------- */

export const DemoPanel = styled.div`
    position: relative;
    margin: 0 0 24px;
    padding: 22px 20px 20px;
    border: 1px solid var(--ft-border);
    border-radius: 12px;
    background: var(--ft-bg-elevated);
`

export const DemoPanelLabel = styled.span`
    ${mono}
    position: absolute;
    top: -9px;
    left: 14px;
    padding: 1px 8px;
    font-size: 10px;
    font-weight: 700;
    letter-spacing: 0.05em;
    text-transform: uppercase;
    color: var(--ft-accent-strong);
    background: var(--ft-accent-tint-3);
    border-radius: 999px;
`

export const DemoRow = styled.div<{ $wrap?: boolean; $gap?: number; $align?: string }>`
    display: flex;
    align-items: ${({ $align }) => $align ?? 'center'};
    gap: ${({ $gap }) => $gap ?? 10}px;
    flex-wrap: ${({ $wrap }) => ($wrap === false ? 'nowrap' : 'wrap')};
`

export const DemoColumn = styled.div<{ $gap?: number }>`
    display: flex;
    flex-direction: column;
    gap: ${({ $gap }) => $gap ?? 10}px;
`

export const DemoButton = styled.button<{ $variant?: 'primary' | 'secondary' | 'danger' }>`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    padding: 6px 13px;
    font-size: 12.5px;
    font-weight: 600;
    font-family: inherit;
    border-radius: 7px;
    cursor: pointer;
    transition: filter 120ms ease, border-color 120ms ease, background 120ms ease, transform 120ms ease;
    border: 1px solid transparent;

    ${({ $variant }) =>
        $variant === 'secondary'
            ? css`
                  background: var(--ft-bg);
                  border-color: var(--ft-border);
                  color: var(--ft-text);
              `
            : $variant === 'danger'
              ? css`
                    background: var(--ft-danger-tint);
                    border-color: transparent;
                    color: var(--ft-danger);
                `
              : css`
                    background: var(--ft-accent);
                    color: #ffffff;
                `}

    &:hover {
        filter: brightness(1.06);
        transform: translateY(-1px);
    }

    &:active {
        transform: translateY(0);
    }

    &:disabled {
        opacity: 0.5;
        cursor: not-allowed;
        transform: none;
    }
`

export const DemoInput = styled.input`
    padding: 6px 10px;
    font-size: 12.5px;
    font-family: inherit;
    color: var(--ft-text);
    background: var(--ft-bg);
    border: 1px solid var(--ft-border);
    border-radius: 7px;
    outline: none;
    transition: border-color 120ms ease, box-shadow 120ms ease;

    &::placeholder {
        color: var(--ft-text-faint);
    }

    &:focus {
        border-color: var(--ft-accent);
        box-shadow: 0 0 0 3px var(--ft-accent-tint-4);
    }
`

export const DemoBox = styled.div`
    ${mono}
    padding: 10px 12px;
    font-size: 12.5px;
    color: var(--ft-text);
    background: var(--ft-bg);
    border: 1px solid var(--ft-border);
    border-radius: 8px;
    line-height: 1.6;
    word-break: break-word;
`

export const DemoText = styled.p<{ $muted?: boolean }>`
    margin: 0;
    font-size: 12.5px;
    line-height: 1.6;
    color: ${({ $muted }) => ($muted ? 'var(--ft-text-faint)' : 'var(--ft-text-secondary)')};
`

export const DemoStat = styled.span`
    ${mono}
    display: inline-flex;
    align-items: center;
    padding: 2px 8px;
    font-size: 12px;
    font-weight: 600;
    border-radius: 6px;
    background: var(--ft-accent-tint-2);
    color: var(--ft-accent-strong);
`

export const DemoDot = styled.span<{ $active?: boolean }>`
    display: inline-block;
    width: 9px;
    height: 9px;
    border-radius: 50%;
    background: ${({ $active }) => ($active ? '#22c55e' : 'var(--ft-border-dashed)')};
    transition: background 160ms ease;
`

export const DemoScrollBox = styled.div`
    ${mono}
    height: 140px;
    overflow-y: auto;
    padding: 8px 10px;
    font-size: 12px;
    line-height: 1.8;
    color: var(--ft-text-secondary);
    background: var(--ft-bg);
    border: 1px solid var(--ft-border);
    border-radius: 8px;
`
