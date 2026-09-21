# frontend-toolkit

A personal library of copy-paste-ready React/TypeScript pieces. Nothing here is meant to run as an app — each file is self-contained (or depends only on other files in this repo) so you can lift it straight into a new project. This doc is a catalog of what exists and when to reach for it, so future-you doesn't have to open every file to remember what's here.

Stack: **React 19**, **TypeScript**, **Vite 8**, **Tailwind CSS 4**, **Zod 4**, **Axios**, **TanStack React Table v9**, **TanStack Virtual**, **Zustand**, **Redux Toolkit**, **MobX**.

## How to use this repo

There's no package to install — copy the file(s) you need into your target project and adjust imports.

- **Hooks / components / utils / API clients / debugger / constants / data / CSS** — each file (or component folder) is standalone; copy it as-is. Check its "Notes" column or file header for its only-real dependency (usually another file in the same folder, e.g. `DataTable` needs `features.ts` + `columnHelpers.ts`).
- **State management templates** (`src/state/`) — copy the whole folder for the approach you want, then rename the `Todo`/`todos` domain to your own.
- `npm run dev` runs `src/App.tsx`, a static index page (folder → what's in it) for a quick reminder of what's here — it doesn't render the components live. This doc is the source of truth for usage notes.

## Contents

React hooks · UI components · State management templates · Utilities (array/date/number/object/string/error/validation/file/download/excel) · API clients · Debug toolkit · Constants · Data · CSS

---

## React hooks — `src/react-hooks/`

Every hook below has full JSDoc in its file (purpose, when/when-not to use, SSR behavior, cleanup) — this table is just the index.

| Hook | Use it for |
|---|---|
| `useDebounce(value, delay)` | Delay reacting to a fast-changing value (search input → API call) until it settles. |
| `useThrottle(value, delay, { leading, trailing })` | Cap how often a fast-changing value updates (scroll/mouse position) without waiting for it to settle. |
| `useToggle(initialValue?)` | Generic `{ value, toggle, enable, disable, setValue }` boolean state. |
| `useDisclosure({ defaultOpen, open, onOpenChange })` | Open/close state for modals, drawers, accordions — supports both controlled and uncontrolled usage. |
| `usePrevious(value)` | Get the value from the previous render, e.g. to diff prop/state changes. |
| `useLocalStorage(key, initialValue, options?)` | `{ value, setValue, removeValue }` synced with `localStorage`, JSON-serialized, cross-tab sync by default. |
| `useSessionStorage(key, initialValue, options?)` | Same as above but scoped to `sessionStorage` (no cross-tab sync). |
| `useMediaQuery(query, options?)` | Reactive boolean for a CSS media query (breakpoints, `prefers-color-scheme`, `prefers-reduced-motion`) — only when JS actually needs to know, not for layout. |
| `useWindowSize(options?)` | `{ width, height }` of the viewport, batched via `requestAnimationFrame`. |
| `useElementSize(options?)` | `{ ref, width, height }` for one element's own box size via `ResizeObserver` (canvas sizing, custom container queries). |
| `useScrollPosition(options?)` | `{ x, y }` scroll position of window or a scrollable element/ref, rAF-batched. |
| `useIntersectionObserver(ref, options?)` | `{ isIntersecting, entry }` — lazy loading, infinite scroll, reveal animations, visibility tracking. |
| `useOnlineStatus()` | Boolean from `navigator.onLine` + `online`/`offline` events. Not a substitute for request error handling. |
| `usePageVisibility()` | Boolean from the Page Visibility API — pause polling/timers/video when the tab isn't visible. |
| `useClickOutside(refs, handler, options?)` | Fire a handler on pointerdown outside one or more refs — dismiss dropdowns/popovers/menus. Capture-phase, unaffected by inner `stopPropagation`. |
| `useEscapeKey(handler, options?)` | Fire a handler on Escape anywhere in the document — companion to `useClickOutside`. |
| `useFocusTrap(ref, options?)` | Trap Tab/Shift+Tab focus cycling inside a container — use for modals/dialogs/drawers. Handles initial focus and focus restoration; does NOT add ARIA semantics for you. |
| `useEventListener(eventName, handler, target?, options?)` | Type-safe `addEventListener`/cleanup wrapper for `window`/`document`/an element or ref — the low-level primitive most of the above hooks are built on. |
| `useCopyToClipboard(options?)` | `{ copy, copiedText, isCopied, error }` — clipboard writes with a legacy `execCommand` fallback and auto-resetting "copied" state. |
| `useControllableState({ value, defaultValue, onChange })` | Generic controlled/uncontrolled `[value, setValue]`, `setValue` accepting a plain value or an updater function — the same shape TanStack Table's `state`/`onXChange` options expect. Powers `DataTable`. |

---

## UI components — `src/components/`

Generic and unstyled/minimally-styled — bring your own CSS/Tailwind classes via `className`/`style`.

| Component | What it does |
|---|---|
| `Modal` (`Modal/Modal.tsx`) | Full modal: portal rendering, overlay, outside-click + Escape dismissal, body scroll lock, focus trap + restoration. Built on `useClickOutside`, `useEscapeKey`, `useFocusTrap`. Props: `open`, `onClose`, `width/maxWidth/height/maxHeight`, `closeOnOverlayClick`, `closeOnEscape`. |
| `Accordion` / `AccordionItem` / `AccordionTrigger` / `AccordionContent` (`Accordion/Accordion.tsx`) | Compound-component accordion. `type="single"` or `"multiple"`, controlled or uncontrolled via `value`/`onValueChange`, animated height via grid-rows, custom trigger icon support. |
| `Tabs` (`Tabs/Tabs.tsx`) | Simple tab list + panel. Takes a `tabs: TabItem[]` array (`id`, `label`, `content`, `disabled?`); controlled (`activeTab`/`onChange`) or uncontrolled (`defaultActiveTab`). Ships with Tailwind classes baked in (only component that does). |
| `Stack` (`Stack/Stack.tsx`) | Flexbox layout helper: `direction`, `gap`, `align`, `justify`, `wrap`, `padding`, `width`, polymorphic `as`. |
| `Flex` (`Flex/Flex.tsx`) | Thinner flexbox helper exposing raw CSS flex props (`direction`, `align`, `justify`, `wrap`, `gap`, `grow`, `shrink`, `basis`) directly — use over `Stack` when you want 1:1 CSS prop names. |
| `Grid` (`Grid/Grid.tsx`) | CSS grid layout helper: `columns`/`rows` (number → `repeat(n, minmax(0,1fr))`, or raw CSS string), `gap`/`columnGap`/`rowGap`, `align`, `justify`, polymorphic `as`. |
| `Center` (`Center/Center.tsx`) | One-off flex `align-items/justify-content: center` wrapper. |
| `Show` (`Show/Show.tsx`) | `<Show when={cond} fallback={...}>children</Show>` — conditional rendering as a component instead of `&&`/ternary. |
| `ScrollArea` (`ScrollArea/ScrollArea.tsx` + `.css`) | `overflow` wrapper with custom-styled scrollbars (vertical/horizontal/both); override scrollbar colors via CSS vars (`--scrollbar-track`, `--scrollbar-thumb`, `--scrollbar-thumb-hover`). |
| `DataTable` (`DataTable/DataTable.tsx`) | Full-featured headless table wrapping TanStack Table v9: sorting, per-column filters + debounced global search, pagination (client-side or server-side via `manualPagination`), column pinning (`start`/`end`) + resizing, column visibility menu, row selection (auto-injected checkbox column), CSV export, and row virtualization (`@tanstack/react-virtual`, opt-in via `enableRowVirtualization` + `containerHeight`). Style via `classNames={{ th, td, tr, ... }}` and `[data-sorted]`/`[data-pinned]`/`[data-selected]`/`[data-resizing]` selectors — no baked-in visual styling. See `DataTable/` subsection below. |
| `Select` (`Select/Select.tsx`) | Headless, fully-configurable select — single or multi-value, `variant="custom"` (default) or `variant="native"` (a real `<select>`), searchable (local filter or async via `onSearch`), grouped options, multi-select as removable pills or a "N selected" summary, optional checkboxes, creatable (`enableCreatable` + `onCreateOption`), and virtualized option lists (`enableVirtualization`, same `@tanstack/react-virtual` dependency as `DataTable`). Dropdown positioning is hand-rolled (absolute below trigger, flips up once on open if cramped) rather than `@floating-ui/react` — a deliberate simplicity tradeoff, so it can clip inside `overflow: hidden` ancestors. Style via `classNames={{ trigger, dropdown, option, pill, ... }}` and `[data-active]`/`[data-selected]`/`[data-disabled]` selectors. See `Select/` subsection below. |

### `DataTable/` — usage note

TanStack Table v9 types columns against a fixed, statically-registered feature set (see the memory-worthy API redesign in `features.ts`'s doc comment) — so build columns with the helper this folder exports rather than plain object literals, or they won't type-check against `<DataTable>`:

```tsx
import DataTable, { createDataTableColumnHelper } from './components/DataTable'

type Person = { id: string; name: string; age: number }
const helper = createDataTableColumnHelper<Person>()
const columns = helper.columns([
  helper.accessor('name', { header: 'Name' }),
  helper.accessor('age', { header: 'Age', meta: { filterVariant: 'number' } }),
])

<DataTable columns={columns} data={people} enableColumnFilters enableCsvExport />
```

See `DataTable.tsx`'s file header for more usage examples (server-side data, pinning + resizing together, virtualized large datasets, row selection).

### `Select/` — usage note

Everything is opt-in via props — a plain single-select needs almost nothing:

```tsx
import Select from './components/Select/Select'
import type { SelectOption } from './components/Select/Select.types'

const options: SelectOption<string>[] = [
  { value: 'apple', label: 'Apple', group: 'Fruit' },
  { value: 'carrot', label: 'Carrot', group: 'Vegetable' },
]

<Select options={options} value={value} onChange={setValue} placeholder="Pick one…" />

// multi-select, searchable, pills
<Select multiple searchable options={options} value={values} onChange={setValues} />

// async/remote search — component stops filtering locally once onSearch is passed
<Select searchable isLoading={loading} options={results} value={value} onChange={setValue}
  onSearch={(query) => fetchResults(query).then(setResults)} />
```

`useSelect.ts` is where the interaction logic (open state, value, search/filter, keyboard nav, typeahead) lives; `CustomSelect.tsx`/`NativeSelect.tsx` are rendering only, switched on by `Select.tsx` via the `variant` prop.

---

## State management templates — `src/state/`

Unlike the rest of this repo, these aren't meant to be imported as-is — they're **starter kits to copy into a new project wholesale**, then rename the domain (`Todo`/`todos`) and adjust to fit. All four implement the exact same tiny domain (a todo list: add/toggle/remove/clear-completed, plus a derived remaining-count) so you can diff them side by side and pick the one that fits the project, instead of comparing four unrelated examples. Each folder ships both the state code and a working React component that consumes it (form + list + remaining count), so copying a folder gets you something that actually renders, not just a store with nothing wired up.

| Folder | Approach | Key files |
|---|---|---|
| `context/` | React Context + `useReducer`, state and dispatch split into two contexts (so action-only consumers don't re-render on state changes) | `createSafeContext.ts` (generic, genuinely reusable on its own — throws instead of returning `undefined` when used outside its provider), `todoState.ts` (reducer + contexts), `TodoContext.tsx` (`TodoProvider`), `useTodo.ts` (consumer hooks) |
| `zustand/` | Module-level store hook, no provider needed | `useTodoStore.ts` (store + `devtools` middleware, no-op if the Redux DevTools extension isn't installed) |
| `redux/` | Redux Toolkit — `createSlice` (Immer-powered "mutable" reducers), memoized selectors | `todosSlice.ts`, `todosSelectors.ts` (`createSelector`), `store.ts` (`configureStore`), `hooks.ts` (typed `useAppDispatch`/`useAppSelector`) |
| `mobx/` | Class store (`makeAutoObservable`) provided via Context so instances aren't a bare module singleton | `TodoStore.ts`, `todoStoreContext.ts` + `StoreContext.tsx` (provider), `useTodoStore.ts` (consumer hook) — components reading the store must be wrapped in `observer()` from `mobx-react-lite` |

Every folder's `TodoList.tsx` is the copy-paste starting point for a real feature component; every store/context file's header comment says exactly what to rename when adapting it.

---

## Utilities — `src/utils/`

All pure functions unless noted. Every file has full JSDoc with examples, error behavior, and complexity — worth opening the source when in doubt.

### `array/`
| Function | Signature | Notes |
|---|---|---|
| `chunk` | `chunk(array, size): T[][]` | Splits into fixed-size groups. Throws `RangeError` if `size` isn't a positive integer. |
| `groupBy` | `groupBy(array, getKey): Record<string, T[]>` | Groups items by a derived key. |
| `unique` | `unique(array): T[]` | Dedupe by `Set` (SameValueZero). Objects dedupe by reference, not contents. |
| `uniqueBy` | `uniqueBy(array, getKey): T[]` | Dedupe by a derived key, keeps first occurrence. |

### `date/`
| Function | Signature | Notes |
|---|---|---|
| `formatDate` | `formatDate(value, options?, locale='en-IN', timeZone?)` | `Intl.DateTimeFormat` wrapper, e.g. `"21 Aug 2026"`. Throws `RangeError` on invalid input (intentional — doesn't silently hide bad data). |
| `formatDateTime` | `formatDateTime(value, options?, locale='en-IN', timeZone?)` | Same as above plus time, e.g. `"21 Aug 2026, 03:30 PM"`. |
| `isValidDate` | `isValidDate(value): boolean` | Non-throwing check for `Date`/string/timestamp validity — use before the throwing formatters. |
| `relativeTime` | `relativeTime(value, options?)` | `Intl.RelativeTimeFormat` wrapper — `"5 minutes ago"`, `"in 2 days"`. Accepts `now` for deterministic/testable output. |

### `number/`
| Function | Signature | Notes |
|---|---|---|
| `clamp` | `clamp(value, min, max): number` | Restrict to inclusive range. Throws on non-finite input or `min > max`. |
| `formatCurrency` | `formatCurrency(value, currency, locale='en-IN', options?)` | `Intl.NumberFormat` currency wrapper, e.g. `₹1,25,000.00`. Display-only, not for financial math. |
| `formatNumber` | `formatNumber(value, locale='en-IN', options?)` | General-purpose localized number formatting (grouping, decimals, compact notation). |
| `formatPercentage` | `formatPercentage(value, locale='en-IN', options?)` | Input is a decimal fraction (`0.75` → `"75%"`). |

### `object/`
| Function | Signature | Notes |
|---|---|---|
| `pick` | `pick(object, keys): Pick<T, K>` | New object with only the listed keys. Shallow copy. |
| `omit` | `omit(object, keys): Omit<T, K>` | New object without the listed keys. Shallow copy. |
| `omitNil` | `omitNil(object): T` | Strips only `null`/`undefined` values — keeps `0`, `false`, `''`. Good for cleaning API payloads/query params. |
| `isEmpty` | `isEmpty(value): boolean` | `true` for `{}`, `null`, `undefined`. Checks key presence, not "falsy values". |

### `string/`
| Function | Signature | Notes |
|---|---|---|
| `capitalize` | `capitalize(value): string` | Uppercases only the first character; rest is untouched. |
| `camelToTitle` | `camelToTitle(value): string` | `'firstName'` → `'First Name'`, preserves acronyms (`'userID'` → `'User ID'`). |
| `slugify` | `slugify(value, options?)` | URL-safe slug, Unicode-normalized (diacritics stripped), configurable `separator`. Not an HTML/SQL sanitizer. |
| `truncate` | `truncate(value, maxLength, options?)` | Truncates with an ellipsis, result never exceeds `maxLength`. |

### `error/`
| Function | Signature | Notes |
|---|---|---|
| `isError` | `isError(value): value is Error` | Type-guard narrowing `unknown` → `Error` in `catch` blocks. |
| `getErrorMessage` | `getErrorMessage(error, fallback?): string` | Safely pulls a message out of any thrown value (`Error`, string, `{ message }`, or unknown) — never throws. |
| `normalizeError` | `normalizeError(error, fallbackMessage?): NormalizedError` | Turns any thrown value into `{ message, status?, code?, details?, cause }` — one shape for API/UI/logging to consume. `details`/`cause` may hold sensitive data; don't render them directly. |

### `validation/zod.ts`
Prebuilt Zod schema factories so form validation doesn't get reinvented per project — `requiredString`, `optionalString`, `minLengthString`/`maxLengthString`/`stringLength`, `emailSchema`/`optionalEmailSchema`, `phoneSchema`/`optionalPhoneSchema`, `urlSchema`/`optionalUrlSchema`, `passwordSchema`/`strongPasswordSchema`, `numberSchema`/`positiveNumberSchema`/`nonNegativeNumberSchema`/`integerSchema`/`positiveIntegerSchema`/`numberBetween`, `numberInput`/`positiveNumberInput` (coerces `<input type="number">` string values), `dateSchema`/`dateStringSchema`/`optionalDateStringSchema`, `idSchema`/`uuidSchema`/`optionalUuidSchema`, `requiredSelect`/`optionalSelect`, `requiredBoolean`/`requiredCheckbox` (must be `true`, e.g. terms acceptance), `fileSchema`/`fileSizeSchema`/`fileTypeSchema`, `alphabeticString`/`alphanumericString`/`slugSchema`, `passwordsMatch(passwordField, confirmField)` (spread into `.refine()` for confirm-password checks), and a `validationRegex` bag (`username`, `hexColor`, `indianPinCode`, `uuid`, etc). See in-file usage example at the bottom of `zod.ts`.

### `file/` — file handling, split by concern
| File | Exports | Notes |
|---|---|---|
| `file.constants.ts` | `FILE_SIZE_UNITS`, `COMMON_MIME_TYPES` | Static lookup tables. |
| `file.types.ts` | `FileValidationOptions`, `FileValidationResult`, `DownloadOptions`, `CsvOptions`, etc. | Shared types for the file/download/excel utils. |
| `file.info.ts` | `getFileName`, `getFileExtension`, `getFileNameWithoutExtension`, `getFileMimeType`, `getFileSize`, `isFile`, `isBlob`, `formatFileSize(bytes, decimals?)` | Inspecting a `File`/`Blob`/path string. `formatFileSize` → `"1.5 MB"` etc. |
| `file.name.ts` | `sanitizeFileName`, `ensureFileExtension`, `removeFileExtension` | Safe filenames for downloads (strips illegal chars, guards Windows reserved names like `CON`/`NUL`). |
| `file.reader.ts` | `readFileAsText`, `readFileAsArrayBuffer`, `readFileAsDataURL`, `fileToBase64` | Promise-based `FileReader`/Blob reads. |
| `file.conversion.ts` | `blobToFile`, `fileToBlob`, `base64ToBlob`, `base64ToFile`, `dataUrlToBlob`, `dataUrlToFile` | Convert between `Blob`/`File`/base64/data-URL. |
| `file.validation.ts` | `validateFile`, `validateFiles`, `isValidFile`, `isValidFileType`, `isValidExtension`, `isValidFileSize` | Structured validation (size, MIME type, extension, filename length, empty-file check) returning `{ valid, code?, message? }` rather than throwing. |

### `download/`
| File | Exports | Notes |
|---|---|---|
| `blob.ts` | `createObjectUrl`, `revokeObjectUrl` | Thin `URL.createObjectURL`/`revokeObjectURL` wrappers. |
| `download.ts` | `downloadBlob`, `downloadFile`, `downloadText`, `downloadJson`, `downloadFromUrl` | Triggers a browser file save via a hidden `<a download>` (or opens in a new tab). Filenames are sanitized automatically. |
| `csv.ts` | `jsonToCsv(rows, options?)`, `downloadCsv(rows, filename?, options?)` | Converts an array of objects to CSV (auto-escapes quotes/commas/newlines, derives header from union of row keys) and triggers a download with UTF-8 BOM by default (Excel-friendly). |

### `excel/`
| File | Exports | Notes |
|---|---|---|
| `excel.constants.ts` | `EXCEL_MIME_TYPES`, `EXCEL_EXTENSIONS` | `.xlsx`/`.xls` MIME types and extensions. |
| `excel.utils.ts` | `isValidExcelFormat(file): boolean` | Checks a `File`'s extension + MIME type against the constants above. No parsing library involved — pair with a real parser (e.g. SheetJS) if you need to read cell data. |

---

## API clients — `src/api/`

Two independent HTTP wrappers — pick one per project, they're not meant to be used together.

| File | Export | Notes |
|---|---|---|
| `fetch.ts` | `apiFetch<T>(path, options?)`, `ApiFetchError` | Native-`fetch` wrapper: JSON body auto-encoding, `AbortController` timeout (default 30s, configurable, supports an external `signal`), throws `ApiFetchError` (with `status`/`statusText`/`data`) on non-2xx — unlike raw `fetch`, which doesn't reject on HTTP errors. No auth assumptions; add headers/cookies yourself. |
| `axios.ts` | `api` (configured `AxiosInstance`) | Single shared Axios instance with base URL (from `VITE_API_BASE_URL` / `NEXT_PUBLIC_API_BASE_URL`), 30s timeout, `withCredentials: true`, and empty request/response interceptor stubs ready for auth/error-handling logic. |

---

## Debug toolkit — `src/debugger/`

Dev-time utilities, all re-exported from one barrel: `import { logger, inspect, browser, storage, errors, start, measure } from './debugger'`.

| Module | Key exports | What it's for |
|---|---|---|
| `logger.ts` | `logger` (`.debug/.info/.warn/.error/.group/.child(context)/.setEnabled/.isEnabled`) | Structured console logging with named context (`logger.child('Auth')`). |
| `inspect.ts` | `inspect(value, options?)`, `inspectValue`, `isPlainObject` | Pretty-prints/structurally inspects any JS value (handles circular refs, Map/Set/Date/DOM nodes) — richer than `console.log`. |
| `timer.ts` | `start(label?)`, `measure(label, operation)`, `elapsed(startTime)` | Timing: `start()` returns a `Timer` with `.end()/.elapsed()/.isRunning()`; `measure()` auto-times a sync or async function. |
| `browser.ts` | `browser` (`.info/.viewport/.screen/.connection/.isOnline`) | Snapshot of browser/OS/viewport/network info for bug reports and responsive debugging. |
| `storage.ts` | `storage` (`.get/.getJson/.set/.setJson/.remove/.clear`) | Inspect/manipulate `localStorage`/`sessionStorage` from code or devtools console. |
| `errors.ts` | `errors` (`.normalize/.isError/.message/.stack`) | Same normalization job as `utils/error/*` but scoped for debug-console use. |
| `performance.ts` | `performanceSummary`, `navigation`, `resources`, `marks`, `measures`, `mark`, `clearMarks`, `clearMeasures`, `observeLongTasks` | Wraps the `Performance`/`PerformanceObserver` APIs — navigation timing, resource timing, custom marks/measures, long-task detection. |

Import individual modules directly (`./debugger/logger`) if you only need one piece and want to avoid pulling in the rest.

---

## Constants — `src/constants/`

| File | Export | Notes |
|---|---|---|
| `httpStatus.ts` | `HTTP_STATUS`, `HttpStatus` (type) | Named HTTP status codes (`HTTP_STATUS.NOT_FOUND` etc.) instead of magic numbers. `as const`. |
| `keyboard.ts` | `KEYBOARD_KEYS`, `KeyboardKey` (type) | Named `KeyboardEvent.key` values (`KEYBOARD_KEYS.ESCAPE`, `.ARROW_DOWN`, etc). |

## Data — `src/data/`

`countries.json` — static country reference dataset (names/codes) for dropdowns/selects.

## CSS — `src/css/`

`reset.css`, `fonts.css`, `media-queries.css` — plain CSS, not run through Tailwind; import directly where needed.
