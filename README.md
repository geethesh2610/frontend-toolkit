# Frontend Reusable Toolkit

A personal collection of **production-ready, copy-pasteable frontend utilities, React hooks, reusable components, constants, reference data, API helpers, debugging tools, and CSS foundations** for React + TypeScript projects.

> **This is not a framework or an npm package.**

Build common frontend patterns once, document them properly, and reuse them across projects instead of rewriting or researching the same implementation every time.

The code is intentionally independent of UI libraries, state-management libraries, and CSS frameworks wherever possible.

---

## Philosophy

This repository follows a few principles:

- **Production over demo code**
- **TypeScript-first**
- **No unnecessary dependencies**
- **Small, focused utilities**
- **Reusable across different codebases**
- **SSR-aware where browser APIs are involved**
- **Immutable utilities where appropriate**
- **Good error handling**
- **Clear documentation above reusable code**
- **Do not over-engineer project-specific requirements**

This is a **toolbox, not a framework**.

Copy only what the project actually needs.

---

## Structure

```text
frontend-toolkit/
│
├── api/
│   ├── axios.ts
│   └── fetch.ts
│
├── components/
│   ├── Datatable/
│   │   ├── DataTable.Body.tsx
│   │   ├── DataTable.ColumnVisibility.tsx
│   │   ├── DataTable.filters.ts
│   │   ├── DataTable.Filters.tsx
│   │   ├── DataTable.Header.tsx
│   │   ├── DataTable.Pagination.tsx
│   │   ├── DataTable.Row.tsx
│   │   ├── DataTable.Search.tsx
│   │   ├── DataTable.state.ts
│   │   ├── DataTable.States.tsx
│   │   ├── DataTable.Toolbar.tsx
│   │   ├── DataTable.tsx
│   │   ├── DataTable.types.ts
│   │   ├── DataTable.utils.ts
│   │   ├── DataTable.virtualization.ts
│   │   ├── index.ts
│   │   └── README.md
│   │
│   └── Modal/
│       └── Modal.ts
│
├── constants/
│   ├── httpStatus.ts
│   └── keyboard.ts
│
├── css/
│   ├── media-queries.css
│   └── reset.css
│
├── data/
│   └── countries.json
│
├── debugger/
│   ├── browser.ts
│   ├── errors.ts
│   ├── index.ts
│   ├── inspect.ts
│   ├── logger.ts
│   ├── performance.ts
│   ├── storage.ts
│   ├── timer.ts
│   └── types.ts
│
├── react-hooks/
│   ├── useClickOutside.ts
│   ├── useCopyToClipboard.ts
│   ├── useDebounce.ts
│   ├── useDisclosure.ts
│   ├── useElementSize.ts
│   ├── useEscapeKey.ts
│   ├── useEventListener.ts
│   ├── useFocusTrap.ts
│   ├── useIntersectionObserver.ts
│   ├── useLocalStorage.ts
│   ├── useMediaQuery.ts
│   ├── useOnlineStatus.ts
│   ├── usePageVisibility.ts
│   ├── usePrevious.ts
│   ├── useScrollPosition.ts
│   ├── useSessionStorage.ts
│   ├── useThrottle.ts
│   ├── useToggle.ts
│   └── useWindowSize.ts
│
└── utils/
    ├── array/
    │   ├── chunk.ts
    │   ├── groupBy.ts
    │   ├── unique.ts
    │   └── uniqueBy.ts
    │
    ├── date/
    │   ├── formatDate.ts
    │   ├── formatDateTime.ts
    │   ├── isValidDate.ts
    │   └── relativeTime.ts
    │
    ├── download/
    │   ├── blob.ts
    │   ├── csv.ts
    │   └── download.ts
    │
    ├── error/
    │   ├── getErrorMessage.ts
    │   ├── isError.ts
    │   └── normalizeError.ts
    │
    ├── file/
    │   ├── file.constants.ts
    │   ├── file.conversion.ts
    │   ├── file.info.ts
    │   ├── file.name.ts
    │   ├── file.reader.ts
    │   ├── file.types.ts
    │   └── file.validation.ts
    │
    ├── number/
    │   ├── clamp.ts
    │   ├── formatCurrency.ts
    │   ├── formatNumber.ts
    │   └── formatPercentage.ts
    │
    ├── object/
    │   ├── isEmpty.ts
    │   ├── omit.ts
    │   ├── omitNil.ts
    │   └── pick.ts
    │
    └── string/
        ├── camelToTitle.ts
        ├── capitalize.ts
        ├── slugify.ts
        └── truncate.ts
```

---

# API

The `api/` directory contains reusable HTTP-client foundations.

## `api/axios.ts`

Reusable Axios setup for applications that use Axios.

Use this as the foundation for:

- Base URL configuration
- Request/response interceptors
- Authentication handling
- Centralized API errors
- Request defaults
- Common headers

Keep application-specific endpoints and business logic outside the toolkit.

## `api/fetch.ts`

Reusable Fetch-based HTTP helpers for applications that prefer the native Fetch API.

The goal is to provide a predictable foundation without forcing Axios onto projects that do not need it.

---

# Components

The `components/` directory contains reusable UI components that solve common frontend problems.

## DataTable

The DataTable is a modular TanStack Table-based table component.

It is intentionally split into focused files instead of putting the entire table implementation into one component.

### Included capabilities

- Sorting
- Filtering
- Search
- Pagination
- Column visibility
- Column ordering/state support
- Row selection/state support
- Grouping/state support
- Expansion/state support
- Virtualization
- Toolbar composition
- Reusable table state
- Typed column/data configuration

The implementation is designed to be extended rather than replaced when a project needs additional table behavior.

See `components/Datatable/README.md` for the component-specific documentation.

## Modal

`components/Modal/Modal.ts` contains the reusable modal implementation.

The modal should remain generic and allow the consuming component to control dimensions and content rather than embedding project-specific design decisions.

---

# Constants

Constants contain small, stable values that are reused across frontend projects. They should remain independent of business logic.

## `constants/httpStatus.ts`

Centralized HTTP status code constants.

Instead of scattering magic numbers throughout API handling:

```ts
if (response.status === 401) {
  // ...
}
```

use:

```ts
if (response.status === HTTP_STATUS.UNAUTHORIZED) {
  // ...
}
```

Useful for:

- API response handling
- Authentication failures
- Authorization checks
- Validation errors
- Not-found handling
- Server errors
- Retry logic

The constants cover commonly used informational, success, redirect, client-error, and server-error status codes.

## `constants/keyboard.ts`

Centralized `KeyboardEvent.key` values.

Instead of repeating string literals:

```ts
if (event.key === "Escape") {
  // ...
}
```

use:

```ts
if (event.key === KEYBOARD_KEYS.ESCAPE) {
  // ...
}
```

Useful for:

- Modals
- Dropdowns
- Menus
- Tabs
- Comboboxes
- Keyboard navigation
- Focus management
- `useEscapeKey`
- `useFocusTrap`

### `event.key` vs `event.code`

Use `event.key` when behavior depends on the **meaning** of the key:

```ts
event.key === "Escape"
```

Use `event.code` when behavior depends on the **physical keyboard position**:

```ts
event.code === "KeyA"
```

For normal UI keyboard interactions, `event.key` is usually the appropriate choice.

---

# CSS

## `css/reset.css`

A small, project-independent CSS reset.

The reset establishes predictable browser defaults without imposing a visual design system.

It handles common baseline concerns such as:

- `box-sizing`
- Margin normalization
- Image behavior
- Button/input font inheritance
- Heading and paragraph defaults
- Link behavior
- Form element consistency
- Media responsiveness
- Font rendering / antialiasing

### Important

The reset should remain **minimal**.

Do not add project-specific:

- Colors
- Spacing systems
- Typography scales
- Component styles
- Brand styles
- Design tokens

Those belong to the actual project.

## `css/media-queries.css`

Reusable framework-independent media-query breakpoints for responsive layouts.

Use it as a starting point and adapt it when the actual project design requires different responsive behavior.

### Principle

Do not design around device names such as `mobile`, `tablet`, `desktop`.

Prefer breakpoints based on where the layout actually needs to change.

---

# Data

The `data/` directory contains **static, reusable reference data** rather than application-specific state or business data.

## `data/countries.json`

A complete country reference dataset covering the **195-country scope** used by this toolkit.

The dataset is intended for reusable frontend scenarios such as:

- Country selectors
- Address forms
- Phone-number country selectors
- Country-based form fields
- Currency selection
- Language selection
- Timezone selection
- Country metadata display

The dataset contains country-level information such as:

- Common and official country names
- ISO alpha-2 code
- ISO alpha-3 code
- ISO numeric code
- Flag
- Capital
- Region/subregion
- Languages
- Currencies and symbols
- Calling codes
- Top-level domains
- Timezones
- Coordinates
- Area
- Landlocked status
- Bordering countries

### Important

Reference data can become outdated.

Country names, currencies, political classifications, calling codes, timezones, and other metadata can change over time. Treat `countries.json` as reusable reference data that should be reviewed and updated when standards or real-world data change.

Do not put project-specific country configuration into this file.

---

# Debugger

The `debugger/` directory contains reusable development/debugging helpers.

## `browser.ts`

Browser-focused debugging and inspection helpers.

Useful for inspecting browser state and behavior without repeatedly writing ad-hoc console statements.

## `errors.ts`

Helpers for inspecting and debugging errors consistently.

## `inspect.ts`

Utilities for inspecting values and objects during development.

## `logger.ts`

Centralized logging helpers for consistent development logging.

## `performance.ts`

Performance measurement helpers for identifying expensive operations.

## `storage.ts`

Helpers for inspecting browser storage during development.

## `timer.ts`

Reusable timing helpers for measuring execution duration.

## `types.ts`

Shared TypeScript types used by the debugger utilities.

## `index.ts`

Public exports for the debugger module.

### Principle

Debugger utilities should help development without becoming application business logic.

Production logging and observability requirements should still be handled according to the consuming application's architecture.

---

# React Hooks

The `react-hooks/` directory contains reusable React behavior that commonly appears across applications.

## `useClickOutside`

Detects pointer interactions outside one or more referenced elements.

Useful for:

- Dropdowns
- Popovers
- Menus
- Dismissible overlays
- Context menus

## `useCopyToClipboard`

Copies text to the system clipboard using the browser Clipboard API.

Useful for:

- Copy buttons
- API keys
- URLs
- Code snippets
- Reference IDs

The hook should expose useful success/error state rather than relying on alerts.

## `useDebounce`

Delays a rapidly changing value or operation until activity stops for the configured delay.

Common use cases:

- Search inputs
- API requests
- Filtering
- Validation
- Expensive calculations

```ts
const debouncedSearch = useDebounce(search, 300);
```

## `useDisclosure`

Manages boolean open/closed state with a consistent API:

```ts
const {
  isOpen,
  open,
  close,
  toggle,
  setOpen,
} = useDisclosure();
```

Useful for:

- Modals
- Drawers
- Dropdowns
- Accordions
- Popovers
- Dialogs

Supports controlled and uncontrolled usage where implemented.

## `useElementSize`

Tracks the dimensions of a DOM element.

Useful when UI behavior depends on:

- Width
- Height
- Responsive calculations
- Dynamic containers
- Measured layouts

Typically implemented using `ResizeObserver`.

## `useEscapeKey`

Runs a handler when the Escape key is pressed.

Useful for:

- Closing modals
- Closing dropdowns
- Dismissing overlays
- Cancelling transient UI

Keep this separate from `useClickOutside` because keyboard dismissal and pointer dismissal are different behaviors.

## `useEventListener`

A reusable, type-safe wrapper around native DOM event listeners.

Supports appropriate `EventTarget` objects such as:

- `window`
- `document`
- DOM elements
- Refs

Useful as a low-level building block for other browser-event hooks.

## `useFocusTrap`

Keeps keyboard focus inside a specified container while an overlay is active.

Useful for accessible:

- Dialogs
- Modals
- Drawers
- Focus-contained menus

This hook handles **focus management**, not complete accessibility. Production accessibility also requires appropriate:

- ARIA roles
- Accessible names
- Escape behavior
- Focus restoration
- Background interaction management

## `useIntersectionObserver`

Observes whether an element intersects with the viewport or another root.

Useful for:

- Lazy loading
- Infinite scrolling
- Reveal-on-scroll behavior
- Visibility tracking
- Data loading
- Analytics visibility events

Uses the browser's native `IntersectionObserver`.

## `useLocalStorage`

Synchronizes React state with `localStorage`.

Useful for:

- Preferences
- UI settings
- Filters
- Dismissed notices
- Lightweight user settings

Production considerations include:

- SSR safety
- JSON serialization/deserialization
- Malformed stored data
- Storage access failures
- Cross-tab synchronization where required

> Do not use `localStorage` for sensitive credentials or secrets.

## `useMediaQuery`

Tracks whether a CSS media query currently matches.

```ts
const isMobile = useMediaQuery("(max-width: 767px)");
```

Useful when JavaScript behavior genuinely needs to respond to responsive conditions.

Do **not** use it simply to replace CSS media queries. Prefer CSS for visual/layout changes whenever possible.

## `useOnlineStatus`

Tracks whether the browser reports the application as online or offline.

Useful for:

- Offline indicators
- Disabling network-dependent actions
- Retry UI
- Connection status messaging

> `navigator.onLine` indicates the browser's network connectivity state. It does **not** guarantee that your API/server is reachable.

## `usePageVisibility`

Tracks whether the browser page is currently visible using the Page Visibility API.

Useful for:

- Pausing polling
- Reducing expensive work
- Pausing animations
- Refreshing data when the user returns
- Avoiding unnecessary background activity

Typical states:

```text
visible
hidden
```

## `usePrevious`

Returns the previous value from the previous render.

Useful for:

- Detecting state transitions
- Comparing props
- Tracking changes
- Triggering logic only when a value changes

The first render has no previous value.

## `useScrollPosition`

Tracks the current scroll position.

Useful for:

- Sticky navigation behavior
- Hide/show headers
- Scroll progress
- Scroll-based UI
- Determining scroll direction

Be careful with performance when handling high-frequency scroll events.

## `useSessionStorage`

Synchronizes React state with `sessionStorage`.

Useful for:

- Temporary filters
- Wizard progress
- Session-specific preferences
- Temporary UI state

## `useThrottle`

Limits how frequently rapidly changing values/events are processed.

Useful for:

- Scroll handlers
- Resize handlers
- Mouse movement
- High-frequency events
- Performance-sensitive UI

### Debounce vs Throttle

| Pattern | Behavior | Example |
|---|---|---|
| Debounce | Wait until activity stops | Search input |
| Throttle | Allow execution at most once per interval | Scroll position |

## `useToggle`

A small hook for boolean state.

```ts
const [isOpen, toggle] = useToggle();
```

Useful when simple boolean state is enough.

## `useWindowSize`

Tracks browser viewport dimensions.

Useful for:

- Canvas sizing
- Responsive calculations
- Viewport-dependent behavior
- Layout calculations that cannot be handled by CSS

Prefer CSS media queries for normal responsive styling.

---

# Utilities

Utilities are grouped by responsibility.

The goal is to keep them:

- Pure where possible
- Framework-independent
- Easy to test
- Easy to copy into another project
- Strongly typed
- Predictable

---

## Array Utilities

### `chunk.ts`

Splits an array into smaller arrays of a specified size.

```ts
chunk([1, 2, 3, 4, 5], 2);
// [[1, 2], [3, 4], [5]]
```

Useful for batching and grouping data.

### `groupBy.ts`

Groups array items by a derived key.

```ts
groupBy(users, user => user.department);
```

Useful for:

- Categorizing API results
- Grouped tables
- Sections
- Dropdown options
- Reporting data

### `unique.ts`

Removes duplicate primitive values from an array.

```ts
unique([1, 1, 2, 3, 3]);
// [1, 2, 3]
```

### `uniqueBy.ts`

Removes duplicates based on a selected property or derived key.

```ts
uniqueBy(users, user => user.id);
```

Useful for API data and object arrays.

---

# Date Utilities

## `formatDate.ts`

Formats a date into a readable localized date string.

Useful for:

- Tables
- Cards
- Reports
- Form displays
- API response formatting

Keep display formatting separate from date calculations.

## `formatDateTime.ts`

Formats a date and time together.

Useful when both date and time are required in UI output.

## `isValidDate.ts`

Checks whether a supplied date value represents a valid date.

Useful for validating:

- API values
- Form inputs
- Date parsing
- Imported data

Do not rely solely on JavaScript's permissive date parsing for user input.

## `relativeTime.ts`

Converts a date/time difference into human-readable relative time:

```text
just now
5 minutes ago
2 hours ago
3 days ago
```

Useful for:

- Notifications
- Activity feeds
- Comments
- Audit logs
- Recent updates

---

# Download Utilities

The `utils/download/` directory contains browser download helpers for common frontend export/download workflows.

The utilities are framework-independent and can be consumed by React components, API layers, tables, report exporters, and other application code.

## `download.ts`

Core download helpers.

Includes:

- `downloadBlob()`
- `downloadFile()`
- `downloadText()`
- `downloadJson()`
- `downloadFromUrl()`

Examples:

```ts
downloadBlob(pdfBlob, "report.pdf");

downloadFile(file);

downloadText("Hello", "hello.txt");

downloadJson(users, "users.json");

downloadFromUrl("/reports/report.pdf", "report.pdf");
```

`downloadBlob()` uses an object URL and revokes it after triggering the download.

## `blob.ts`

Helpers for object URLs:

```ts
createObjectUrl(blob);
revokeObjectUrl(url);
```

Useful when generated files need to be displayed or downloaded.

## `csv.ts`

Provides CSV generation and downloading.

```ts
const csv = jsonToCsv(users);

downloadCsv(users, "users.csv");
```

Supports configurable:

- Delimiter
- Line breaks
- UTF-8 BOM behavior

CSV values are escaped according to common CSV quoting rules.

### Important

These helpers are intended for normal frontend exports. Very large datasets may require streaming or server-side export rather than constructing the complete file in browser memory.

---

# File Utilities

The `utils/file/` directory contains reusable browser-side file handling helpers.

## `file.info.ts`

File metadata helpers:

```ts
getFileName()
getFileExtension()
getFileNameWithoutExtension()
getFileMimeType()
getFileSize()
formatFileSize()
isFile()
isBlob()
```

Example:

```ts
getFileExtension(file);
// "pdf"

formatFileSize(file.size);
// "2.4 MB"
```

## `file.validation.ts`

Configurable file validation.

Validation rules are passed at the call site rather than hard-coded:

```ts
const result = validateFile(file, {
  maxSize: 5 * 1024 * 1024,
  minSize: 1024,
  mimeTypes: [
    "application/pdf",
    "image/*",
  ],
  extensions: [
    "pdf",
    "jpg",
    "png",
  ],
  maxFileNameLength: 100,
});
```

Supported validation rules include:

- Minimum file size
- Maximum file size
- MIME types
- MIME wildcards such as `image/*`
- File extensions
- Maximum filename length
- Empty-file handling
- Maximum number of files
- Minimum number of files

For multiple files:

```ts
const result = validateFiles(files, {
  maxFiles: 10,
  maxSize: 10 * 1024 * 1024,
  mimeTypes: ["application/pdf"],
  extensions: ["pdf"],
});
```

The validation result contains a stable error code and message, making it suitable for form components.

### Security note

Client-side MIME type and extension validation is **not a security boundary**. Uploaded files must still be validated on the server.

## `file.reader.ts`

Helpers for reading files as:

- Text
- ArrayBuffer
- Data URL
- Base64

Example:

```ts
const csv = await readFileAsText(file);
const base64 = await fileToBase64(file);
```

## `file.conversion.ts`

Conversions between:

- Blob
- File
- Base64
- Data URL

Examples:

```ts
const file = blobToFile(blob, "report.pdf");

const blob = base64ToBlob(base64, "application/pdf");

const file = dataUrlToFile(dataUrl, "image.png");
```

## `file.name.ts`

Filename helpers:

```ts
sanitizeFileName()
ensureFileExtension()
removeFileExtension()
```

Useful for:

- Export filenames
- Uploaded filenames
- Generated documents
- Browser downloads

`sanitizeFileName()` removes characters that are problematic in common filesystem environments.

## `file.constants.ts`

Common file-related constants, including commonly used MIME types and file-size units.

---

# Error Utilities

The `utils/error/` directory provides small helpers for safely handling unknown errors.

## `isError.ts`

Checks whether a value is a native `Error`.

## `getErrorMessage.ts`

Extracts a safe human-readable message from an unknown error value.

## `normalizeError.ts`

Converts different error shapes into a predictable representation suitable for application error handling.

Useful when API clients, browser APIs, and application code can produce different error structures.

---

# Number Utilities

## `clamp.ts`

Restricts a number to a minimum and maximum.

```ts
clamp(120, 0, 100);
// 100
```

Useful for:

- Percentages
- Progress values
- Sliders
- Dimensions
- Bounded calculations

## `formatCurrency.ts`

Formats numbers as localized currency using `Intl.NumberFormat`.

Useful for:

- Prices
- Invoices
- Financial tables
- Reports
- Totals

The currency and locale should be explicit when required by the application.

## `formatNumber.ts`

Formats numeric values for human-readable display.

Useful for:

- Counts
- Statistics
- Measurements
- Dashboard values
- Large numbers

Prefer `Intl.NumberFormat` instead of manually inserting separators.

## `formatPercentage.ts`

Formats a decimal ratio as a percentage.

```ts
formatPercentage(0.75);
// "75%"
```

The utility follows the native `Intl.NumberFormat` percentage convention: `0.75 → 75%`.

---

# Object Utilities

## `isEmpty.ts`

Checks whether an object contains no own enumerable properties.

```ts
isEmpty({});
// true

isEmpty({ name: "John" });
// false
```

It checks whether the object has properties. It does **not** determine whether a property's value is "empty".

## `omit.ts`

Creates a new object without specified keys.

```ts
omit(user, ["password", "internalId"]);
```

The original object is not mutated.

Useful for:

- API payload preparation
- Removing internal fields
- Creating safe view models

## `omitNil.ts`

Removes properties whose values are specifically `null` or `undefined`.

It intentionally preserves:

- `0`
- `false`
- `""`

Useful for API payload and query-parameter cleanup.

## `pick.ts`

Creates a new object containing only specified keys.

```ts
pick(user, ["id", "name", "email"]);
```

The original object is not mutated.

> `pick` → keep these fields  
> `omit` → remove these fields

---

# String Utilities

## `camelToTitle.ts`

Converts camelCase/PascalCase identifiers into readable titles.

```ts
camelToTitle("firstName");
// "First Name"

camelToTitle("userID");
// "User ID"
```

## `capitalize.ts`

Capitalizes only the first character.

```ts
capitalize("hello world");
// "Hello world"
```

It intentionally does not lowercase the remaining characters.

## `slugify.ts`

Converts text into a URL-friendly slug.

```ts
slugify("My First Blog Post!");
// "my-first-blog-post"
```

Useful for:

- URLs
- Route segments
- Article slugs
- Identifiers
- Filenames

> **This is not an HTML/XSS sanitizer.**

## `truncate.ts`

Truncates text to a maximum final length.

```ts
truncate("Hello World", 8);
// "Hello..."
```

The omission marker (`...`) is included in the maximum length.

This utility performs character-based truncation. Word-aware truncation is a separate requirement.

---

# How to Use This Repository

This repository is intentionally designed for **copy-paste reuse**.

## 1. Identify the project requirements

Check:

- React version
- Next.js/Vite setup
- TypeScript configuration
- CSS strategy
- Browser support
- Existing utility libraries
- Existing hooks/utilities

## 2. Do not blindly copy everything

Only take what the project needs.

```text
Need outside-click behavior?  → copy useClickOutside.ts

Need persisted UI preference? → copy useLocalStorage.ts

Need API payload cleanup?     → copy omitNil.ts

Need file validation?         → copy utils/file/file.validation.ts

Need CSV export?              → copy utils/download/csv.ts
```

## 3. Check the project conventions

Before copying, review:

- Naming conventions
- Import aliases
- Lint rules
- TypeScript strictness
- Formatting rules
- Browser support
- Existing utilities with the same purpose

## 4. Adapt when necessary

These utilities are **starting points**, not immutable rules.

A project may already have:

- A design system
- A shared utility library
- TanStack Query
- A routing abstraction
- An accessibility system
- A date library
- An internationalization system

Do not duplicate functionality unnecessarily.

---

# Production Checklist

Before adding a utility to a real project, consider the following.

## TypeScript

- Is the API strongly typed?
- Are generics necessary?
- Are nullable values handled?
- Are invalid inputs handled intentionally?

## Runtime

- What happens with `null`?
- What happens with `undefined`?
- What happens with invalid input?
- Can the browser API throw?
- Is cleanup required?

## React

For hooks, check:

- Dependency arrays
- Stale closures
- Cleanup
- Rerender behavior
- Referential stability
- SSR behavior
- Strict Mode behavior

## Browser APIs

For browser-dependent hooks/utilities, consider:

- SSR
- Hydration
- Browser support
- Unavailable APIs
- Event cleanup
- Performance

## Performance

Avoid:

- Unnecessary listeners
- Unnecessary observers
- Repeated expensive calculations
- Unnecessary object creation
- Unnecessary state updates

> **Do not optimize code before there is a real performance problem.**

---

# Testing

Utilities should generally be easy to unit test because most of them are pure functions.

A simple model is:

```text
input → utility → expected output
```

React hooks should be tested for:

- Initial state
- State transitions
- Cleanup
- Rerenders
- Dependency changes
- Browser events
- Error cases
- SSR-sensitive behavior where applicable

File/download utilities should additionally be tested for:

- MIME validation
- Extension validation
- Size limits
- Multiple-file limits
- Empty files
- Filename sanitization
- JSON serialization failures
- CSV escaping
- Object URL cleanup

---

# What Does NOT Belong Here

Avoid turning this repository into a dumping ground.

Do not add:

- Project-specific components
- Business logic
- API endpoints
- Company-specific constants
- Project-specific types
- Page-specific helpers
- Design-system components
- Random snippets that were used once
- Dependencies just to solve trivial problems

Before adding something, ask:

> **"Would I reasonably use this in another frontend project?"**

If the answer is no, it probably belongs in the project itself.

---

# Dependency Philosophy

Prefer platform APIs and React primitives when they are sufficient:

- `Intl.NumberFormat`
- `Intl.DateTimeFormat`
- `IntersectionObserver`
- `ResizeObserver`
- `localStorage`
- `sessionStorage`
- `matchMedia`
- Page Visibility API
- Clipboard API
- Blob/Object URL APIs
- File APIs

Do not add a dependency just to avoid writing a small, well-tested utility.

However, if a project already standardizes on a library for a complex domain such as date manipulation, validation, accessibility, data fetching, PDF generation, Excel generation, or state management, use the project's established solution instead of duplicating functionality.

---

# Maintenance

When improving a utility:

1. Preserve the existing API unless there is a strong reason to change it.
2. Update the documentation if behavior changes.
3. Add or update tests.
4. Check edge cases.
5. Check TypeScript inference.
6. Check browser/SSR behavior when applicable.
7. Avoid adding unnecessary configuration.
8. Keep the utility focused on one responsibility.
9. Update this README when new reusable modules are added.

---

# Quick Reference

| Category | Utility / Module | Main Purpose |
|---|---|---|
| API | `axios` | Axios HTTP foundation |
| API | `fetch` | Fetch HTTP foundation |
| Component | `DataTable` | Reusable TanStack Table |
| Component | `Modal` | Reusable modal |
| Constant | `HTTP_STATUS` | HTTP status codes |
| Constant | `KEYBOARD_KEYS` | Keyboard key values |
| Data | `countries.json` | Country reference data |
| React Hook | `useClickOutside` | Outside pointer interaction |
| React Hook | `useCopyToClipboard` | Clipboard operations |
| React Hook | `useDebounce` | Delay rapidly changing values |
| React Hook | `useDisclosure` | Boolean open/close state |
| React Hook | `useElementSize` | Element dimensions |
| React Hook | `useEscapeKey` | Escape-key handling |
| React Hook | `useEventListener` | Native event subscription |
| React Hook | `useFocusTrap` | Focus containment |
| React Hook | `useIntersectionObserver` | Element visibility |
| React Hook | `useLocalStorage` | Persistent browser state |
| React Hook | `useMediaQuery` | Media query state |
| React Hook | `useOnlineStatus` | Online/offline state |
| React Hook | `usePageVisibility` | Page visibility |
| React Hook | `usePrevious` | Previous render value |
| React Hook | `useScrollPosition` | Scroll position |
| React Hook | `useSessionStorage` | Session browser state |
| React Hook | `useThrottle` | Limit update frequency |
| React Hook | `useToggle` | Simple boolean state |
| React Hook | `useWindowSize` | Viewport dimensions |
| Array | `chunk` | Split arrays into groups |
| Array | `groupBy` | Group items by key |
| Array | `unique` | Remove duplicate values |
| Array | `uniqueBy` | Remove duplicates by key |
| Date | `formatDate` | Format dates |
| Date | `formatDateTime` | Format date + time |
| Date | `isValidDate` | Validate dates |
| Date | `relativeTime` | Human-readable relative time |
| Download | `downloadBlob` | Download Blob data |
| Download | `downloadFile` | Download File objects |
| Download | `downloadJson` | Download JSON |
| Download | `downloadText` | Download text |
| Download | `downloadFromUrl` | Download from URL |
| Download | `downloadCsv` | Generate/download CSV |
| Download | `createObjectUrl` | Create Blob object URL |
| Download | `revokeObjectUrl` | Release object URL |
| Error | `getErrorMessage` | Extract safe error message |
| Error | `isError` | Identify native errors |
| Error | `normalizeError` | Normalize error shapes |
| File | `getFileName` | Get filename |
| File | `getFileExtension` | Get extension |
| File | `formatFileSize` | Format file size |
| File | `validateFile` | Configurable file validation |
| File | `validateFiles` | Multiple-file validation |
| File | `readFileAsText` | Read file as text |
| File | `readFileAsArrayBuffer` | Read file as ArrayBuffer |
| File | `readFileAsDataURL` | Read file as Data URL |
| File | `fileToBase64` | Convert file to Base64 |
| File | `blobToFile` | Convert Blob to File |
| File | `base64ToBlob` | Convert Base64 to Blob |
| File | `dataUrlToFile` | Convert Data URL to File |
| File | `sanitizeFileName` | Make filename safer |
| File | `ensureFileExtension` | Ensure extension |
| Number | `clamp` | Bound a number |
| Number | `formatCurrency` | Format currency |
| Number | `formatNumber` | Format numbers |
| Number | `formatPercentage` | Format percentages |
| Object | `isEmpty` | Check object keys |
| Object | `omit` | Remove selected keys |
| Object | `omitNil` | Remove null/undefined |
| Object | `pick` | Select specific keys |
| String | `camelToTitle` | Convert identifiers to titles |
| String | `capitalize` | Capitalize first character |
| String | `slugify` | Create URL-friendly slugs |
| String | `truncate` | Limit displayed text |

---

# Final Principle

This repository exists to reduce **repeated thinking**, not to eliminate thinking.

Before using a utility, understand what it does and whether it matches the project's requirements.

```text
Copy → Review → Adapt → Test → Use
```

> **Build once. Understand it. Reuse it.**
