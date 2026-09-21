/*
 * Layout/styling for App.tsx — a small docs site (sidebar + content), not a
 * live demo. UI font is Inter, code font is Fira Code (both loaded in
 * index.html).
 */

import styled, { css, createGlobalStyle } from 'styled-components'

const mono = css`
    font-family: 'Fira Code', 'SFMono-Regular', Consolas, monospace;
`

export const GlobalStyle = createGlobalStyle`
    body {
        margin: 0;
        background: #fafafa;
        font-family: 'Inter', system-ui, sans-serif;
        -webkit-font-smoothing: antialiased;
    }
`

/* ---------------------------------------------------------------- */
/* Shell                                                             */
/* ---------------------------------------------------------------- */

export const Layout = styled.div`
    display: grid;
    grid-template-columns: 272px minmax(0, 1fr);
    min-height: 100vh;
    color: #0f172a;

    @media (max-width: 760px) {
        grid-template-columns: 1fr;
    }
`

export const Sidebar = styled.aside`
    position: sticky;
    top: 0;
    align-self: start;
    max-height: 100vh;
    overflow-y: auto;
    padding: 22px 16px 40px;
    background: #ffffff;
    border-right: 1px solid #ececef;

    @media (max-width: 760px) {
        position: static;
        max-height: none;
        border-right: none;
        border-bottom: 1px solid #ececef;
    }
`

export const Brand = styled.a`
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 4px;
    text-decoration: none;
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
    color: #0f172a;
    letter-spacing: -0.01em;
`

export const SidebarSubtitle = styled.p`
    margin: 0 0 18px;
    font-size: 11.5px;
    color: #a1a1aa;
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
    color: #a1a1aa;
    pointer-events: none;
`

export const SearchInput = styled.input`
    width: 100%;
    padding: 7px 10px 7px 28px;
    font-size: 12.5px;
    font-family: inherit;
    color: #0f172a;
    background: #f4f4f5;
    border: 1px solid transparent;
    border-radius: 8px;
    outline: none;
    transition: border-color 120ms ease, background 120ms ease, box-shadow 120ms ease;

    &::placeholder {
        color: #a1a1aa;
    }

    &:focus {
        background: #ffffff;
        border-color: #6366f1;
        box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.12);
    }
`

export const NoResults = styled.p`
    padding: 4px 4px;
    font-size: 12px;
    color: #a1a1aa;
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
    color: ${({ $active }) => ($active ? '#4338ca' : '#3f3f46')};
    background: ${({ $active }) => ($active ? 'rgba(99, 102, 241, 0.1)' : 'transparent')};

    &:hover {
        color: #4338ca;
        background: rgba(99, 102, 241, 0.08);
    }
`

export const CountBadge = styled.span`
    font-family: 'Inter', system-ui, sans-serif;
    font-size: 10px;
    font-weight: 600;
    color: #a1a1aa;
`

export const SidebarItemLink = styled.a<{ $active?: boolean }>`
    ${mono}
    display: block;
    margin: 1px 0 1px 8px;
    padding: 4px 8px 4px 14px;
    font-size: 11.5px;
    text-decoration: none;
    border-radius: 6px;
    border-left: 2px solid ${({ $active }) => ($active ? '#6366f1' : 'transparent')};
    color: ${({ $active }) => ($active ? '#4338ca' : '#71717a')};
    font-weight: ${({ $active }) => ($active ? 600 : 400)};
    background: ${({ $active }) => ($active ? 'rgba(99, 102, 241, 0.08)' : 'transparent')};

    &:hover {
        color: #4338ca;
        background: rgba(99, 102, 241, 0.06);
    }
`

export const Content = styled.main`
    min-width: 0;
    padding: 48px 56px 120px;
    max-width: 840px;

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
    color: #6366f1;
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
    color: #52525b;
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
    border: 1px solid #ececef;
    border-radius: 12px;
    background: #ffffff;
`

export const StatNumber = styled.div`
    font-size: 22px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.02em;
`

export const StatLabel = styled.div`
    margin-top: 2px;
    font-size: 12px;
    color: #a1a1aa;
`

export const Hint = styled.p`
    display: inline-flex;
    align-items: center;
    gap: 8px;
    padding: 10px 14px;
    margin: 0;
    background: #fafafa;
    border: 1px dashed #d4d4d8;
    border-radius: 10px;
    color: #71717a;
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
    color: #a1a1aa;
    margin-bottom: 8px;
`

export const FolderHeading = styled.h1`
    ${mono}
    margin: 0 0 12px;
    font-size: 24px;
    font-weight: 700;
    color: #0f172a;
`

export const FolderBlurb = styled.p`
    margin: 0 0 32px;
    max-width: 620px;
    font-size: 14.5px;
    color: #52525b;
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
    border: 1px solid #ececef;
    border-radius: 12px;
    background: #ffffff;
    text-decoration: none;
    color: inherit;
    transition: border-color 140ms ease, box-shadow 140ms ease, transform 140ms ease;

    &:hover {
        border-color: #c7d2fe;
        box-shadow: 0 8px 20px -10px rgba(79, 70, 229, 0.3);
        transform: translateY(-1px);
    }

    &:hover .chev {
        transform: translateX(2px);
        color: #4f46e5;
    }
`

export const ItemCardText = styled.div`
    min-width: 0;
`

export const ItemCardName = styled.div`
    ${mono}
    font-size: 13.5px;
    font-weight: 600;
    color: #0f172a;
    margin-bottom: 4px;
`

export const ItemCardUse = styled.div`
    font-size: 13px;
    color: #71717a;
    line-height: 1.55;
`

export const Chevron = styled.span`
    flex: 0 0 auto;
    color: #d4d4d8;
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
    color: #6366f1;
    text-decoration: none;
    cursor: pointer;

    &:hover {
        color: #4338ca;
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
    margin: 0 0 32px;
    max-width: 620px;
    font-size: 14.5px;
    color: #52525b;
    line-height: 1.7;
`

export const SourceHeading = styled.div`
    ${mono}
    font-size: 11px;
    font-weight: 700;
    letter-spacing: 0.06em;
    text-transform: uppercase;
    color: #a1a1aa;
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
