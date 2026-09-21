/*
 * Not a demo — a small docs site for this toolkit. Sidebar lists every
 * folder and item; picking a folder shows what it's for, picking an item
 * opens its actual source with a copy button. Full signatures/edge cases
 * still live in README.md.
 */

import { useEffect, useMemo, useState } from "react";

import { FLAT_ITEMS, getItemByKey, slugifyFolder, TOOLKIT } from "./App.data";
import {
    Brand,
    BrandMark,
    BrandName,
    BrandRow,
    Chevron,
    Content,
    CountBadge,
    Eyebrow,
    FolderBlurb,
    FolderHeading,
    GlobalStyle,
    Hint,
    ItemCard,
    ItemCardList,
    ItemCardName,
    ItemCardText,
    ItemCardUse,
    Kicker,
    Layout,
    MobileMenuButton,
    MobileTopBar,
    NoResults,
    SearchBox,
    SearchIcon,
    SearchInput,
    Sidebar,
    SidebarFolderLink,
    SidebarGroup,
    SidebarItemLink,
    SidebarOverlay,
    SidebarSubtitle,
    StatGrid,
    StatLabel,
    StatNumber,
    StatTile,
    Subtitle,
    ThemeToggleButton,
    Title,
} from "./App.style";
import { CodeView, RawFileView } from "./CodeView";
import { useDisclosure } from "./react-hooks/useDisclosure";
import { useLocalStorage } from "./react-hooks/useLocalStorage";
import { useMediaQuery } from "./react-hooks/useMediaQuery";

function useHash() {
    const [hash, setHash] = useState(() => window.location.hash.replace(/^#/, ""));

    useEffect(() => {
        const onHashChange = () => setHash(window.location.hash.replace(/^#/, ""));
        window.addEventListener("hashchange", onHashChange);
        return () => window.removeEventListener("hashchange", onHashChange);
    }, []);

    return hash;
}

type ThemePreference = "light" | "dark";

/** Dogfoods this toolkit's own hooks: persisted, system-aware theme preference. */
function useTheme() {
    const prefersDark = useMediaQuery("(prefers-color-scheme: dark)");
    const { value: theme, setValue: setTheme } = useLocalStorage<ThemePreference>("ft-theme", () =>
        prefersDark ? "dark" : "light",
    );

    useEffect(() => {
        document.documentElement.setAttribute("data-theme", theme);
    }, [theme]);

    const toggleTheme = () => setTheme((current) => (current === "dark" ? "light" : "dark"));

    return { theme, toggleTheme };
}

export const App = () => {
    const hash = useHash();
    const [query, setQuery] = useState("");
    const { theme, toggleTheme } = useTheme();

    const isMobile = useMediaQuery("(max-width: 760px)");
    const { isOpen: isMobileNavOpen, close: closeMobileNav, toggle: toggleMobileNav } = useDisclosure();

    // The drawer only needs to exist as "open" state on mobile — closing it
    // whenever the viewport crosses back to desktop keeps it from being
    // stuck open (as a fixed overlay) if the window is resized while open.
    useEffect(() => {
        if (!isMobile) closeMobileNav();
    }, [isMobile, closeMobileNav]);

    useEffect(() => {
        closeMobileNav();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [hash]);

    const fileKey = hash.startsWith("file/") ? hash.slice("file".length) : undefined;
    const codeKey = hash.startsWith("code/") ? hash.slice("code/".length) : undefined;
    const codeEntry = codeKey ? getItemByKey(codeKey) : undefined;

    const activeFolderSlug = codeEntry ? slugifyFolder(codeEntry.folder) : hash;
    const activeItemKey = codeEntry?.key;

    const folderSection = !codeEntry && !fileKey ? TOOLKIT.find((section) => slugifyFolder(section.folder) === hash) : undefined;

    const filteredGroups = useMemo(() => {
        const q = query.trim().toLowerCase();
        return TOOLKIT.map((section) => ({
            section,
            entries: FLAT_ITEMS.filter(
                (flat) =>
                    flat.folder === section.folder &&
                    (!q || flat.item.name.toLowerCase().includes(q) || flat.item.use.toLowerCase().includes(q) || section.folder.toLowerCase().includes(q)),
            ),
        })).filter((group) => group.entries.length > 0);
    }, [query]);

    return (
        <Layout>
            <GlobalStyle />

            <MobileTopBar>
                <MobileMenuButton type="button" aria-label="Toggle navigation" onClick={toggleMobileNav}>
                    ☰
                </MobileMenuButton>
                <BrandName>frontend-toolkit</BrandName>
                <ThemeToggleButton type="button" aria-label="Toggle theme" onClick={toggleTheme}>
                    {theme === "dark" ? "☀" : "☾"}
                </ThemeToggleButton>
            </MobileTopBar>

            {isMobileNavOpen && <SidebarOverlay onClick={closeMobileNav} />}

            <Sidebar $mobileOpen={isMobileNavOpen}>
                <BrandRow>
                    <Brand href="#">
                        <BrandMark>FT</BrandMark>
                        <BrandName>frontend-toolkit</BrandName>
                    </Brand>
                    <ThemeToggleButton type="button" aria-label="Toggle theme" onClick={toggleTheme}>
                        {theme === "dark" ? "☀" : "☾"}
                    </ThemeToggleButton>
                </BrandRow>
                <SidebarSubtitle>Copy-paste reference</SidebarSubtitle>

                <SearchBox>
                    <SearchIcon>⌕</SearchIcon>
                    <SearchInput placeholder="Filter hooks, components…" value={query} onChange={(event) => setQuery(event.target.value)} />
                </SearchBox>

                {filteredGroups.length === 0 && <NoResults>No matches for "{query}".</NoResults>}

                {filteredGroups.map(({ section, entries }) => (
                    <SidebarGroup key={section.folder}>
                        <SidebarFolderLink href={`#${slugifyFolder(section.folder)}`} $active={activeFolderSlug === slugifyFolder(section.folder)}>
                            <span>src/{section.folder}</span>
                            <CountBadge>{entries.length}</CountBadge>
                        </SidebarFolderLink>
                        {entries.map((entry) => (
                            <SidebarItemLink key={entry.key} href={`#code/${entry.key}`} $active={activeItemKey === entry.key}>
                                {entry.item.name}
                            </SidebarItemLink>
                        ))}
                    </SidebarGroup>
                ))}
            </Sidebar>

            <Content>
                {codeEntry ? (
                    <CodeView entry={codeEntry} />
                ) : fileKey ? (
                    <RawFileView path={fileKey} />
                ) : folderSection ? (
                    <div>
                        <Eyebrow>Folder</Eyebrow>
                        <FolderHeading>src/{folderSection.folder}</FolderHeading>
                        {folderSection.blurb && <FolderBlurb>{folderSection.blurb}</FolderBlurb>}
                        <ItemCardList>
                            {folderSection.items.map((item, index) => (
                                <ItemCard key={item.name} href={`#code/${slugifyFolder(folderSection.folder)}--${index}`}>
                                    <ItemCardText>
                                        <ItemCardName>{item.name}</ItemCardName>
                                        <ItemCardUse>{item.use}</ItemCardUse>
                                    </ItemCardText>
                                    <Chevron className="chev">→</Chevron>
                                </ItemCard>
                            ))}
                        </ItemCardList>
                    </div>
                ) : (
                    <div>
                        <Kicker>frontend-toolkit</Kicker>
                        <Title>Copy-paste reference</Title>
                        <Subtitle>
                            A personal library of copy-paste-ready React/TypeScript pieces. Pick a folder on the left to see what it's for,
                            then an item to open its real source and copy it straight into your project.
                        </Subtitle>

                        <StatGrid>
                            <StatTile>
                                <StatNumber>{TOOLKIT.length}</StatNumber>
                                <StatLabel>folders</StatLabel>
                            </StatTile>
                            <StatTile>
                                <StatNumber>{FLAT_ITEMS.length}</StatNumber>
                                <StatLabel>items</StatLabel>
                            </StatTile>
                        </StatGrid>

                        <Hint>👈 Start with a folder in the sidebar, or search for something specific.</Hint>
                    </div>
                )}
            </Content>
        </Layout>
    );
};
