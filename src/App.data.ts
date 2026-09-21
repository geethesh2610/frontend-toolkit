/*
 * The toolkit catalog rendered by App.tsx — what's in each folder, when to
 * reach for it, and which file(s) to show/copy from the code view. `files`
 * are repo-root-relative paths matching toolkitSource.ts's glob, in the
 * order they should be shown.
 */

export interface ToolkitItem {
    name: string;
    use: string;
    files: string[];
}

export interface ToolkitSection {
    folder: string;
    blurb?: string;
    items: ToolkitItem[];
}

export const TOOLKIT: ToolkitSection[] = [
    {
        folder: "react-hooks/",
        blurb: "Standalone React hooks — state and browser-API primitives you'll reuse across almost any project.",
        items: [
            { name: "useDebounce", use: "Wait for a fast-changing value (search input) to settle before reacting to it — e.g. firing an API call.", files: ["/src/react-hooks/useDebounce.ts"] },
            { name: "useThrottle", use: "Cap how often a fast-changing value (scroll/mouse position) updates, without waiting for it to settle.", files: ["/src/react-hooks/useThrottle.ts"] },
            { name: "useToggle", use: "Generic on/off boolean state with toggle/enable/disable — dropdowns, switches, expand/collapse.", files: ["/src/react-hooks/useToggle.ts"] },
            { name: "useDisclosure", use: "Open/close state for a modal, drawer, or accordion — works controlled or uncontrolled.", files: ["/src/react-hooks/useDisclosure.ts"] },
            { name: "usePrevious", use: "Compare a prop/state value against what it was last render (diffing, detecting a transition).", files: ["/src/react-hooks/usePrevious.ts"] },
            { name: "useLocalStorage", use: "Persist a piece of state across reloads/tabs — synced with localStorage automatically.", files: ["/src/react-hooks/useLocalStorage.ts"] },
            { name: "useSessionStorage", use: "Same as useLocalStorage but scoped to the tab (no cross-tab sync).", files: ["/src/react-hooks/useSessionStorage.ts"] },
            { name: "useMediaQuery", use: "Branch component logic on a CSS media query in JS (breakpoint, prefers-color-scheme) — not for layout, use CSS for that.", files: ["/src/react-hooks/useMediaQuery.ts"] },
            { name: "useWindowSize", use: "React to the viewport size changing (responsive JS logic, canvas sizing).", files: ["/src/react-hooks/useWindowSize.ts"] },
            { name: "useElementSize", use: "React to one specific element's own size changing, via ResizeObserver.", files: ["/src/react-hooks/useElementSize.ts"] },
            { name: "useScrollPosition", use: "Track scroll position of the window or a scrollable element (sticky headers, scroll-linked effects).", files: ["/src/react-hooks/useScrollPosition.ts"] },
            { name: "useIntersectionObserver", use: "Know when an element enters/leaves the viewport — lazy loading, infinite scroll, reveal animations.", files: ["/src/react-hooks/useIntersectionObserver.ts"] },
            { name: "useOnlineStatus", use: "Show an offline banner or gate actions on network availability.", files: ["/src/react-hooks/useOnlineStatus.ts"] },
            { name: "usePageVisibility", use: "Pause polling/timers/video when the browser tab isn't visible.", files: ["/src/react-hooks/usePageVisibility.ts"] },
            { name: "useClickOutside", use: "Close a dropdown/popover/menu when the user clicks outside of it.", files: ["/src/react-hooks/useClickOutside.ts"] },
            { name: "useEscapeKey", use: "Close a dropdown/modal when the user presses Escape — pairs with useClickOutside.", files: ["/src/react-hooks/useEscapeKey.ts"] },
            { name: "useFocusTrap", use: "Keep Tab/Shift+Tab focus cycling inside a modal/dialog while it's open.", files: ["/src/react-hooks/useFocusTrap.ts"] },
            { name: "useEventListener", use: "Attach any DOM event with automatic cleanup, without writing addEventListener/removeEventListener by hand.", files: ["/src/react-hooks/useEventListener.ts"] },
            { name: "useCopyToClipboard", use: "\"Copy\" buttons — handles the clipboard write plus a temporary \"copied!\" state.", files: ["/src/react-hooks/useCopyToClipboard.ts"] },
            { name: "useControllableState", use: "Build a component that supports both `value`/`onChange` (controlled) and `defaultValue` (uncontrolled) with one hook.", files: ["/src/react-hooks/useControllableState.ts"] },
            { name: "useLatest", use: "Read the CURRENT value of a prop/state inside a long-lived subscription (socket, interval) without re-subscribing every time it changes.", files: ["/src/react-hooks/useLatest.ts"] },
            { name: "useStableCallback", use: "Give a handler a stable identity across renders (so a memoized child doesn't re-render) while it still calls your latest closure.", files: ["/src/react-hooks/useStableCallback.ts"] },
            { name: "useWebWorker", use: "Run CPU-heavy work (big parse/sort/transform) off the main thread instead of janking the UI.", files: ["/src/react-hooks/useWebWorker.ts"] },
        ],
    },
    {
        folder: "components/",
        blurb: "Generic and unstyled — bring your own CSS/Tailwind via className/style.",
        items: [
            { name: "Modal", use: "Need a real modal: overlay, outside-click/Escape to close, scroll lock, focus trap — all wired up already.", files: ["/src/components/Modal/Modal.tsx"] },
            { name: "Accordion", use: "Expand/collapse sections, one open at a time or several — FAQ pages, filter panels.", files: ["/src/components/Accordion/Accordion.tsx"] },
            { name: "Tabs", use: "Switch between panels of content from a simple tabs array.", files: ["/src/components/Tabs/Tabs.tsx"] },
            { name: "Stack", use: "Quick vertical/horizontal flex layout with gap/align/justify props instead of writing flex CSS.", files: ["/src/components/Stack/Stack.tsx"] },
            { name: "Flex", use: "Same job as Stack but with raw CSS flex prop names — reach for this when you want 1:1 CSS terms.", files: ["/src/components/Flex/Flex.tsx"] },
            { name: "Grid", use: "CSS grid layout without writing grid-template-columns by hand.", files: ["/src/components/Grid/Grid.tsx"] },
            { name: "Center", use: "One-off \"center this thing both ways\" wrapper.", files: ["/src/components/Center/Center.tsx"] },
            { name: "Show", use: "Conditional rendering as `<Show when={cond}>` instead of `{cond && ...}` — reads better with a fallback.", files: ["/src/components/Show/Show.tsx"] },
            { name: "ScrollArea", use: "An overflow container where you want custom-styled (not browser-default) scrollbars.", files: ["/src/components/ScrollArea/ScrollArea.tsx", "/src/components/ScrollArea/ScrollArea.css"] },
            {
                name: "DataTable",
                use: "A real data table: sorting, filtering, pagination, column pin/resize, row selection, CSV export, virtualization.",
                files: [
                    "/src/components/DataTable/DataTable.tsx",
                    "/src/components/DataTable/DataTable.types.ts",
                    "/src/components/DataTable/DataTablePagination.tsx",
                    "/src/components/DataTable/DataTableToolbar.tsx",
                    "/src/components/DataTable/features.ts",
                    "/src/components/DataTable/columnHelpers.ts",
                    "/src/components/DataTable/index.ts",
                ],
            },
            {
                name: "Select",
                use: "A dropdown beyond what `<select>` can do: search, multi-select pills, grouping, async options, creatable, virtualized lists.",
                files: [
                    "/src/components/Select/Select.tsx",
                    "/src/components/Select/CustomSelect.tsx",
                    "/src/components/Select/NativeSelect.tsx",
                    "/src/components/Select/SelectOptionList.tsx",
                    "/src/components/Select/useSelect.ts",
                    "/src/components/Select/Select.types.ts",
                    "/src/components/Select/sanitizeId.ts",
                    "/src/components/Select/index.ts",
                ],
            },
            {
                name: "VirtualList / VirtualGrid",
                use: "A long list or uniform card/photo grid (hundreds+ items) where mounting every row/cell at once would be slow — renders only what's near the viewport.",
                files: [
                    "/src/components/VirtualList/VirtualList.tsx",
                    "/src/components/VirtualList/VirtualGrid.tsx",
                    "/src/components/VirtualList/index.ts",
                ],
            },
        ],
    },
    {
        folder: "state/",
        blurb: "Not import-as-is — copy the whole folder for the approach you want, then rename the domain. Each provider/store file's header has a SETUP block: which files to copy, where to put them, and the provider snippet for main.tsx/App.tsx.",
        items: [
            {
                name: "context/",
                use: "Small-to-medium app, no extra dependency wanted — Context + useReducer, split so action-only consumers don't re-render. Setup steps are in TodoContext.tsx's header.",
                files: [
                    "/src/state/context/TodoContext.tsx",
                    "/src/state/context/todoState.ts",
                    "/src/state/context/useTodo.ts",
                    "/src/state/context/createSafeContext.ts",
                    "/src/state/todo.types.ts",
                ],
            },
            {
                name: "zustand/",
                use: "Want a store without wrapping the app in a provider — a module-level hook. Setup steps are in useTodoStore.ts's header.",
                files: ["/src/state/zustand/useTodoStore.ts", "/src/state/todo.types.ts"],
            },
            {
                name: "redux/",
                use: "Already-Redux codebase, or want devtools/middleware/time-travel debugging out of the box. Setup steps are in store.ts's header.",
                files: [
                    "/src/state/redux/store.ts",
                    "/src/state/redux/todosSlice.ts",
                    "/src/state/redux/todosSelectors.ts",
                    "/src/state/redux/hooks.ts",
                    "/src/state/todo.types.ts",
                ],
            },
            {
                name: "mobx/",
                use: "Prefer mutating observable state directly over reducers/actions. Setup steps are in StoreContext.tsx's header.",
                files: [
                    "/src/state/mobx/TodoStore.ts",
                    "/src/state/mobx/todoStoreContext.ts",
                    "/src/state/mobx/StoreContext.tsx",
                    "/src/state/mobx/useTodoStore.ts",
                    "/src/state/todo.types.ts",
                ],
            },
        ],
    },
    {
        folder: "styled-components/",
        blurb: "Not a component library — one reference pattern to copy when adding a new styled component.",
        items: [
            {
                name: "Button/",
                use: "Look here for how to split markup (Button.tsx) from styles (Button.style.tsx), and how to type variant/size props with transient ($-prefixed) props.",
                files: ["/src/styled-components/Button/Button.tsx", "/src/styled-components/Button/Button.style.tsx", "/src/styled-components/Button/index.ts"],
            },
            {
                name: "constants/breakpoints.ts",
                use: "Writing a responsive styled-component — the `media.tablet`/`.laptop`/`.desktop`/`.wide` helper keeps breakpoints consistent instead of hardcoding px values.",
                files: ["/src/styled-components/constants/breakpoints.ts"],
            },
        ],
    },
    {
        folder: "utils/array/",
        blurb: "Small, dependency-free array helpers — chunking, grouping, and deduping.",
        items: [
            { name: "chunk", use: "Split a flat array into fixed-size pages/groups.", files: ["/src/utils/array/chunk.ts"] },
            { name: "groupBy", use: "Bucket items into `{ [key]: item[] }` by a derived key.", files: ["/src/utils/array/groupBy.ts"] },
            { name: "unique", use: "Dedupe an array of primitives.", files: ["/src/utils/array/unique.ts"] },
            { name: "uniqueBy", use: "Dedupe an array of objects by some derived key (e.g. `.id`).", files: ["/src/utils/array/uniqueBy.ts"] },
            { name: "processInChunks", use: "Process a huge array without blocking the main thread — yields back to the browser between chunks instead of running as one long task.", files: ["/src/utils/array/processInChunks.ts"] },
        ],
    },
    {
        folder: "utils/date/",
        blurb: "Locale-aware date formatting and validation built on Intl — no date library needed.",
        items: [
            { name: "formatDate", use: "Display a date like \"21 Aug 2026\" — throws on invalid input so bad data isn't silently swallowed.", files: ["/src/utils/date/formatDate.ts"] },
            { name: "formatDateTime", use: "Same as formatDate, plus the time.", files: ["/src/utils/date/formatDateTime.ts"] },
            { name: "isValidDate", use: "Check a date is valid before passing it to the throwing formatters above.", files: ["/src/utils/date/isValidDate.ts"] },
            { name: "relativeTime", use: "\"5 minutes ago\" / \"in 2 days\" style relative timestamps.", files: ["/src/utils/date/relativeTime.ts"] },
        ],
    },
    {
        folder: "utils/number/",
        blurb: "Locale-aware number/currency/percentage formatting, plus a clamp helper.",
        items: [
            { name: "clamp", use: "Force a number into a min/max range (slider values, pagination bounds).", files: ["/src/utils/number/clamp.ts"] },
            { name: "formatCurrency", use: "Display a price like ₹1,25,000.00 — display only, not for financial math.", files: ["/src/utils/number/formatCurrency.ts"] },
            { name: "formatNumber", use: "Localized number display with grouping/decimals/compact notation.", files: ["/src/utils/number/formatNumber.ts"] },
            { name: "formatPercentage", use: "Turn a decimal fraction (0.75) into \"75%\" for display.", files: ["/src/utils/number/formatPercentage.ts"] },
        ],
    },
    {
        folder: "utils/object/",
        blurb: "Small object helpers — pick/omit keys, strip nil values, check emptiness.",
        items: [
            { name: "pick", use: "Build a new object with only the keys you list.", files: ["/src/utils/object/pick.ts"] },
            { name: "omit", use: "Build a new object without the keys you list.", files: ["/src/utils/object/omit.ts"] },
            { name: "omitNil", use: "Strip only null/undefined before sending an object as an API payload/query string.", files: ["/src/utils/object/omitNil.ts"] },
            { name: "isEmpty", use: "Check an object has no own keys (`{}`).", files: ["/src/utils/object/isEmpty.ts"] },
            { name: "shallowEqual", use: "Write a custom React.memo comparator, or bail out of recomputation when an object prop is \"the same\" in content but a new reference.", files: ["/src/utils/object/shallowEqual.ts"] },
        ],
    },
    {
        folder: "utils/string/",
        blurb: "String helpers for display — capitalization, title-casing, slugs, truncation.",
        items: [
            { name: "capitalize", use: "Uppercase just the first character of a string.", files: ["/src/utils/string/capitalize.ts"] },
            { name: "camelToTitle", use: "Turn a camelCase field name into a display label (\"firstName\" → \"First Name\").", files: ["/src/utils/string/camelToTitle.ts"] },
            { name: "slugify", use: "Turn user text into a URL-safe slug.", files: ["/src/utils/string/slugify.ts"] },
            { name: "truncate", use: "Cap a string's length for display, with an ellipsis.", files: ["/src/utils/string/truncate.ts"] },
        ],
    },
    {
        folder: "utils/error/",
        blurb: "Turn whatever a catch block hands you into one consistent, safe-to-render shape.",
        items: [
            { name: "isError", use: "Narrow `unknown` to `Error` inside a `catch` block.", files: ["/src/utils/error/isError.ts"] },
            { name: "getErrorMessage", use: "Safely pull a display message out of anything a `catch` might hand you.", files: ["/src/utils/error/getErrorMessage.ts"] },
            { name: "normalizeError", use: "Turn any thrown value into one consistent `{ message, status?, code? }` shape for UI/logging.", files: ["/src/utils/error/normalizeError.ts"] },
        ],
    },
    {
        folder: "utils/validation/zod.ts",
        blurb: "Prebuilt Zod schema factories so form validation isn't reinvented per project.",
        items: [
            { name: "requiredString / emailSchema / passwordSchema / numberBetween / fileSchema / passwordsMatch / …", use: "Building a form with Zod — grab a prebuilt schema piece instead of writing the regex/refine logic again.", files: ["/src/utils/validation/zod.ts"] },
        ],
    },
    {
        folder: "utils/file/",
        blurb: "File/Blob inspection, reading, converting, and validating — split by concern.",
        items: [
            { name: "file.info.ts", use: "Read a File/Blob's name, extension, MIME type, or a human size like \"1.5 MB\".", files: ["/src/utils/file/file.info.ts"] },
            { name: "file.name.ts", use: "Produce a safe filename for a download (strips illegal characters, guards reserved Windows names).", files: ["/src/utils/file/file.name.ts"] },
            { name: "file.reader.ts", use: "Read a File's contents as text/base64/data-URL, promise-based.", files: ["/src/utils/file/file.reader.ts"] },
            { name: "file.conversion.ts", use: "Convert between Blob/File/base64/data-URL when an API expects a different shape than you have.", files: ["/src/utils/file/file.conversion.ts"] },
            { name: "file.validation.ts", use: "Validate an upload's size/type/extension before sending it, without throwing.", files: ["/src/utils/file/file.validation.ts"] },
        ],
    },
    {
        folder: "utils/download/",
        blurb: "Trigger browser downloads for blobs, text, JSON, and CSV.",
        items: [
            { name: "download.ts", use: "Trigger a browser \"save file\" for a Blob/text/JSON you built client-side.", files: ["/src/utils/download/download.ts"] },
            { name: "csv.ts", use: "Turn an array of objects into a CSV and download it (Excel-friendly).", files: ["/src/utils/download/csv.ts"] },
            { name: "blob.ts", use: "Low-level createObjectUrl/revokeObjectUrl — most of the time reach for download.ts instead.", files: ["/src/utils/download/blob.ts"] },
        ],
    },
    {
        folder: "utils/excel/",
        blurb: "Validate an upload is actually an Excel file before processing it.",
        items: [
            { name: "isValidExcelFormat", use: "Check an uploaded File is actually .xlsx/.xls before processing it. No parser included — pair with SheetJS to read cells.", files: ["/src/utils/excel/excel.utils.ts", "/src/utils/excel/excel.constants.ts"] },
        ],
    },
    {
        folder: "utils/performance/",
        blurb: "Plain-function performance helpers that work outside React too, not just inside components.",
        items: [
            { name: "rafThrottle", use: "Throttle a callback attached via addEventListener (scroll/mousemove/drag) to at most once per animation frame.", files: ["/src/utils/performance/rafThrottle.ts"] },
        ],
    },
    {
        folder: "utils/react/",
        blurb: "React-specific utility functions that aren't hooks.",
        items: [
            { name: "lazyWithRetry", use: "Drop-in replacement for React.lazy that reloads the page once on a stale-chunk failure after a new deploy, instead of just erroring.", files: ["/src/utils/react/lazyWithRetry.ts"] },
        ],
    },
    {
        folder: "api/",
        blurb: "Two independent HTTP wrappers — pick one per project, not both.",
        items: [
            { name: "fetch.ts (apiFetch)", use: "Want native fetch, but with JSON auto-encoding, a timeout, and it actually throwing on a non-2xx response.", files: ["/src/api/fetch.ts"] },
            { name: "axios.ts (api instance)", use: "Want a shared Axios instance with base URL/credentials set up and interceptor stubs ready for auth/error handling.", files: ["/src/api/axios.ts"] },
            { name: "dedupeRequest", use: "Wrap an async function so overlapping calls with the same key share one in-flight promise instead of firing duplicate requests.", files: ["/src/api/dedupeRequest.ts"] },
        ],
    },
    {
        folder: "debugger/",
        blurb: "All re-exported from one barrel: import { logger, inspect, browser, storage, errors, start, measure } from './debugger'.",
        items: [
            { name: "logger", use: "Console logging with a named context (`logger.child('Auth')`) instead of bare console.log.", files: ["/src/debugger/logger.ts"] },
            { name: "inspect", use: "Pretty-print a complex/circular value — richer than console.log.", files: ["/src/debugger/inspect.ts"] },
            { name: "timer (start/measure)", use: "Time how long a sync or async operation takes.", files: ["/src/debugger/timer.ts"] },
            { name: "browser", use: "Grab browser/OS/viewport/network info for a bug report.", files: ["/src/debugger/browser.ts"] },
            { name: "storage", use: "Poke at localStorage/sessionStorage from code or the devtools console.", files: ["/src/debugger/storage.ts"] },
            { name: "errors", use: "Same error-normalizing job as utils/error, scoped for debug-console output.", files: ["/src/debugger/errors.ts"] },
            { name: "performance", use: "Navigation/resource timing, custom marks, long-task detection.", files: ["/src/debugger/performance.ts"] },
            { name: "webVitals", use: "Report Core Web Vitals (LCP, CLS, INP, FCP, TTFB) for real-user monitoring, via the official web-vitals library.", files: ["/src/debugger/webVitals.ts"] },
        ],
    },
    {
        folder: "constants/",
        blurb: "Named constants instead of magic numbers/strings.",
        items: [
            { name: "httpStatus.ts", use: "Reach for HTTP_STATUS.NOT_FOUND instead of the magic number 404.", files: ["/src/constants/httpStatus.ts"] },
            { name: "keyboard.ts", use: "Reach for KEYBOARD_KEYS.ESCAPE instead of the string literal \"Escape\".", files: ["/src/constants/keyboard.ts"] },
            { name: "zIndex.ts", use: "One shared stacking-order scale (dropdown/modal/toast/...) instead of a z-index arms race of 9999, 99999, ...", files: ["/src/constants/zIndex.ts"] },
            { name: "regex.ts", use: "Ready-to-use patterns (email, URL, UUID, slug, strong password, ...) for anywhere you need a plain RegExp, without pulling in Zod.", files: ["/src/constants/regex.ts"] },
        ],
    },
    {
        folder: "data/",
        blurb: "Static reference datasets.",
        items: [
            { name: "countries.json", use: "Need a country dropdown — static names/codes dataset, no API call.", files: ["/src/data/countries.json"] },
        ],
    },
    {
        folder: "css/",
        blurb: "Plain CSS for projects that aren't on Tailwind.",
        items: [
            { name: "reset.css / fonts.css / media-queries.css", use: "Plain CSS (not Tailwind) — import directly when a project isn't on Tailwind.", files: ["/src/css/reset.css", "/src/css/fonts.css", "/src/css/media-queries.css"] },
        ],
    },
];

export const slugifyFolder = (folder: string) => folder.replace(/[/.]/g, "-").replace(/-$/, "");

export interface FlatItem {
    key: string;
    folder: string;
    item: ToolkitItem;
}

export const FLAT_ITEMS: FlatItem[] = TOOLKIT.flatMap((section) =>
    section.items.map((item, index) => ({
        key: `${slugifyFolder(section.folder)}--${index}`,
        folder: section.folder,
        item,
    })),
);

const FLAT_ITEMS_BY_KEY = new Map(FLAT_ITEMS.map((entry) => [entry.key, entry]));

export const getItemByKey = (key: string): FlatItem | undefined => FLAT_ITEMS_BY_KEY.get(key);
