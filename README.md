# Frontend Reusable Toolkit

A personal collection of **production-ready, copy-pasteable frontend utilities, React hooks, constants, and CSS foundations** for React + TypeScript projects.

> **This is not a framework or an npm package.**
>
> Build common frontend patterns once, document them properly, and reuse them across projects instead of rewriting or researching the same implementation every time.

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
├── css/
│   ├── media-queries.css
│   └── reset.css
│
├── constants/
│   ├── httpStatus.ts
│   └── keyboard.ts
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
    ├── date/
    ├── number/
    ├── object/
    └── string/
```

---

## CSS

### `css/reset.css`

A small, project-independent CSS reset.

The reset establishes predictable browser defaults without imposing a visual design system. It handles common baseline concerns such as:

- `box-sizing`
- Margin normalization
- Image behavior
- Button/input font inheritance
- Heading and paragraph defaults
- Link behavior
- Form element consistency
- Media responsiveness
- Font rendering / antialiasing

#### Important

The reset should remain **minimal**.

Do not add project-specific:

- Colors
- Spacing systems
- Typography scales
- Component styles
- Brand styles
- Design tokens

Those belong to the actual project.

---

### `css/media-queries.css`

Reusable framework-independent media-query breakpoints for responsive layouts.

Use it as a starting point and adapt it when the actual project design requires different responsive behavior.

#### Principle

Do not design around device names such as `mobile`, `tablet`, `desktop`.

Prefer breakpoints based on where the layout actually needs to change.

---

## Constants

Constants contain small, stable values that are reused across frontend projects. They should remain independent of business logic.

### `constants/httpStatus.ts`

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

---

### `constants/keyboard.ts`

Centralized `KeyboardEvent.key` values.

Instead of repeating string literals:

```ts
if (event.key === 'Escape') {
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

#### `event.key` vs `event.code`

Use `event.key` when behavior depends on the **meaning** of the key:

```ts
event.key === 'Escape'
```

Use `event.code` when behavior depends on the **physical keyboard position**:

```ts
event.code === 'KeyA'
```

For normal UI keyboard interactions, `event.key` is usually the appropriate choice.

---

## React Hooks

The hooks folder contains reusable behavior that commonly appears across React applications.

### `useClickOutside`

Detects pointer interactions outside one or more referenced elements.

Useful for: dropdowns, popovers, menus, dismissible overlays, context menus.

---

### `useCopyToClipboard`

Copies text to the system clipboard using the browser Clipboard API.

Useful for: copy buttons, API keys, URLs, code snippets, reference IDs.

The hook should expose useful success/error state rather than relying on alerts.

---

### `useDebounce`

Delays a rapidly changing value or operation until activity stops for the configured delay.

Common use cases: search inputs, API requests, filtering, validation, expensive calculations.

```ts
const debouncedSearch = useDebounce(search, 300)
```

---

### `useDisclosure`

Manages boolean open/closed state. Provides a consistent API:

```ts
const { isOpen, open, close, toggle, setOpen } = useDisclosure()
```

Useful for: modals, drawers, dropdowns, accordions, popovers, dialogs.

Supports both controlled and uncontrolled usage.

---

### `useElementSize`

Tracks the dimensions of a DOM element.

Useful when UI behavior depends on: width, height, responsive calculations, dynamic containers, measured layouts.

Typically implemented using `ResizeObserver`.

---

### `useEscapeKey`

Runs a handler when the Escape key is pressed.

Useful for: closing modals, closing dropdowns, dismissing overlays, cancelling transient UI.

Keep this separate from `useClickOutside` because keyboard dismissal and pointer dismissal are different behaviors.

---

### `useEventListener`

A reusable, type-safe wrapper around native DOM event listeners.

Supports: `window`, `document`, DOM elements, refs, and other appropriate `EventTarget` objects.

Useful as a low-level building block for other browser-event hooks.

---

### `useFocusTrap`

Keeps keyboard focus inside a specified container while an overlay is active.

Useful for accessible: dialogs, modals, drawers, menus that require focus containment.

This hook handles **focus management**, not the complete accessibility implementation. For production accessibility, also consider:

- Focus restoration
- Correct ARIA roles
- Accessible names
- Escape behavior
- Background interaction
- Native `<dialog>` where appropriate

---

### `useIntersectionObserver`

Observes whether an element intersects with the viewport or another root.

Useful for: lazy loading, infinite scrolling, reveal-on-scroll behavior, visibility tracking, triggering data loading, analytics visibility events.

Uses the browser's native `IntersectionObserver`.

---

### `useLocalStorage`

Synchronizes React state with `localStorage`.

Useful for client-side persistence such as: preferences, UI settings, filters, dismissed notices, lightweight user settings.

Production considerations include:

- SSR safety
- JSON serialization/deserialization
- Malformed stored data
- Storage access failures
- Synchronization where required

> Do not use `localStorage` for sensitive credentials or secrets.

---

### `useMediaQuery`

Tracks whether a CSS media query currently matches.

```ts
const isMobile = useMediaQuery('(max-width: 767px)')
```

Useful when JavaScript behavior genuinely needs to respond to responsive conditions.

Do **not** use it simply to replace CSS media queries. Prefer CSS for visual/layout changes whenever possible.

---

### `useOnlineStatus`

Tracks whether the browser reports the application as online or offline.

Useful for: offline indicators, disabling network-dependent actions, retry UI, connection status messaging.

> `navigator.onLine` indicates the browser's network connectivity state. It does **not** guarantee that your API/server is reachable.

---

### `usePageVisibility`

Tracks whether the browser page is currently visible. Uses the Page Visibility API.

Useful for: pausing polling, reducing expensive work, pausing animations, refreshing data when the user returns, avoiding unnecessary background activity.

Typical states: `visible`, `hidden`.

---

### `usePrevious`

Returns the previous value from the previous render.

Useful when you need to compare current value against previous value.

Common cases: detecting state transitions, comparing props, tracking changes, triggering logic only when a value changes.

> Remember that the first render has no previous value.

---

### `useScrollPosition`

Tracks the current scroll position.

Useful for: sticky navigation behavior, hide/show headers, scroll progress, scroll-based UI, determining scroll direction.

> Be careful with performance when handling high-frequency scroll events.

---

### `useSessionStorage`

Similar to `useLocalStorage`, but uses `sessionStorage`.

The data survives page reloads within the current browser tab/session but is not intended as long-term persistence.

Useful for: temporary filters, wizard progress, temporary UI preferences, session-specific state.

---

### `useThrottle`

Limits how frequently rapidly changing values/events are processed.

Useful for: scroll handlers, resize handlers, mouse movement, high-frequency events, performance-sensitive UI.

#### Debounce vs Throttle

| Pattern  | Behavior                               | Example        |
| -------- | -------------------------------------- | -------------- |
| Debounce | Wait until activity stops              | Search input   |
| Throttle | Allow execution at most once per interval | Scroll position |

---

### `useToggle`

A small hook for boolean state.

```ts
const [isOpen, toggle] = useToggle()
```

Useful when all you need is simple boolean state without the additional controlled/uncontrolled behavior of `useDisclosure`.

---

### `useWindowSize`

Tracks the browser viewport dimensions.

Useful for: canvas sizing, responsive calculations, viewport-dependent behavior, layout calculations that cannot be handled by CSS.

> Prefer CSS media queries for normal responsive styling.

---

## Utilities

Utilities are grouped by responsibility. The goal is to keep them:

- Pure where possible
- Framework-independent
- Easy to test
- Easy to copy into another project
- Strongly typed
- Predictable

---

### Array Utilities

#### `chunk.ts`

Splits an array into smaller arrays of a specified size.

```ts
chunk([1, 2, 3, 4, 5], 2)
// [[1, 2], [3, 4], [5]]
```

Useful for: pagination-like UI, grid grouping, batching, processing data in groups.

---

#### `groupBy.ts`

Groups array items by a derived key.

```ts
groupBy(users, user => user.department)
```

Useful for: categorizing API results, grouped tables, sections, dropdown options, reporting data.

---

#### `unique.ts`

Removes duplicate primitive values from an array.

```ts
unique([1, 1, 2, 3, 3])
// [1, 2, 3]
```

---

#### `uniqueBy.ts`

Removes duplicates based on a selected property or derived key.

```ts
uniqueBy(users, user => user.id)
```

Useful for API data and object arrays.

---

### Date Utilities

#### `formatDate.ts`

Formats a date into a readable localized date string.

Useful for: tables, cards, reports, form displays, API response formatting.

Keep display formatting separate from date calculations.

---

#### `formatDateTime.ts`

Formats a date and time together. Useful when both date and time are required in UI output.

---

#### `isValidDate.ts`

Checks whether a supplied date value represents a valid date.

Useful for validating: API values, form inputs, date parsing, imported data.

> Do not rely solely on JavaScript's permissive date parsing for user input.

---

#### `relativeTime.ts`

Converts a date/time difference into human-readable relative time.

```text
just now
5 minutes ago
2 hours ago
3 days ago
```

Useful for: notifications, activity feeds, comments, audit logs, recent updates.

---

### Number Utilities

#### `clamp.ts`

Restricts a number to a minimum and maximum range.

```ts
clamp(120, 0, 100)
// 100
```

Useful for: percentages, progress values, sliders, dimensions, bounded calculations.

---

#### `formatCurrency.ts`

Formats numbers as localized currency using `Intl.NumberFormat`.

Useful for: prices, invoices, financial tables, reports, totals.

The currency and locale should be explicit when required by the application.

---

#### `formatNumber.ts`

Formats numeric values for human-readable display.

Useful for: counts, statistics, measurements, dashboard values, large numbers.

> Prefer `Intl.NumberFormat` instead of manually inserting commas.

---

#### `formatPercentage.ts`

Formats a decimal ratio as a percentage.

```ts
formatPercentage(0.75)
// "75%"
```

The utility follows the native `Intl.NumberFormat` percentage convention (`0.75 → 75%`, not `75 → 75%`).

---

### Object Utilities

#### `isEmpty.ts`

Checks whether an object contains no own enumerable properties.

```ts
isEmpty({})              // true
isEmpty({ name: 'John' }) // false
isEmpty({ name: '' })     // false — it has a property
```

It checks whether the object has properties. It does **not** determine whether a property's value is "empty".

---

#### `omit.ts`

Creates a new object without specified keys.

```ts
omit(user, ['password', 'internalId'])
```

The original object is not mutated.

Useful for: API payload preparation, removing internal fields, creating safe view models.

---

#### `omitNil.ts`

Removes properties whose values are specifically `null` or `undefined`.

It intentionally preserves `0`, `false`, and `''`.

Useful for API payload and query-parameter cleanup.

---

#### `pick.ts`

Creates a new object containing only specified keys.

```ts
pick(user, ['id', 'name', 'email'])
```

The original object is not mutated.

> `pick` → keep these fields | `omit` → remove these fields

---

### String Utilities

#### `camelToTitle.ts`

Converts camelCase/PascalCase identifiers into readable titles.

```ts
camelToTitle('firstName') // "First Name"
camelToTitle('userID')    // "User ID"
```

Also attempts to preserve common acronyms.

---

#### `capitalize.ts`

Capitalizes only the first character.

```ts
capitalize('hello world') // "Hello world"
```

It intentionally does not lowercase the remaining characters.

---

#### `slugify.ts`

Converts text into a URL-friendly slug.

```ts
slugify('My First Blog Post!') // "my-first-blog-post"
```

Useful for: URLs, route segments, article slugs, identifiers, filenames.

> **This is not an HTML/XSS sanitizer.**

---

#### `truncate.ts`

Truncates text to a maximum final length.

```ts
truncate('Hello World', 8) // "Hello..."
```

The omission marker (`...`) is included in the maximum length (5 chars + 3 chars = 8).

This utility performs character-based truncation. Word-aware truncation should be treated as a separate requirement.

---

## How to Use This Repository

This repository is intentionally designed for **copy-paste reuse**.

### 1. Identify the project requirements

Check: React version, Next.js/Vite setup, TypeScript configuration, CSS strategy, browser support, existing utility libraries, existing hooks/utilities.

### 2. Do not blindly copy everything

Only take what the project needs.

```text
Need outside-click behavior?   → copy useClickOutside.ts
Need persisted UI preference?   → copy useLocalStorage.ts
Need API payload cleanup?       → copy omitNil.ts
```

### 3. Check the project conventions

Before copying, review: naming conventions, import aliases, lint rules, TypeScript strictness, formatting rules, browser support, existing utilities with the same purpose.

### 4. Adapt when necessary

These utilities are **starting points**, not immutable rules.

A project may already have a design system, a shared utility library, React Query / TanStack Query, a routing abstraction, an existing accessibility system, a date library, or an internationalization system. Do not duplicate functionality unnecessarily.

---

## Production Checklist

Before adding a utility to a real project, consider the following.

### TypeScript

- Is the API strongly typed?
- Are generics necessary?
- Are nullable values handled?
- Are invalid inputs handled intentionally?

### Runtime

- What happens with `null`?
- What happens with `undefined`?
- What happens with invalid input?
- Can the browser API throw?
- Is cleanup required?

### React

For hooks, check:

- Dependency arrays
- Stale closures
- Cleanup
- Rerender behavior
- Referential stability
- SSR behavior
- Strict Mode behavior

### Browser APIs

For browser-dependent hooks, consider:

- SSR
- Hydration
- Browser support
- Unavailable APIs
- Event cleanup
- Performance

### Performance

Avoid:

- Unnecessary listeners
- Unnecessary observers
- Repeated expensive calculations
- Unnecessary object creation
- Unnecessary state updates

> **Do not optimize code before there is a real performance problem.**

---

## Testing

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

---

## What Does NOT Belong Here

Avoid turning this repository into a dumping ground. Do not add:

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
>
> If the answer is no, it probably belongs in the project itself.

---

## Dependency Philosophy

Prefer platform APIs and React primitives when they are sufficient:

`Intl.NumberFormat`, `Intl.DateTimeFormat`, `IntersectionObserver`, `ResizeObserver`, `localStorage`, `sessionStorage`, `matchMedia`, Page Visibility API, Clipboard API.

Do not add a dependency just to avoid writing a small, well-tested utility.

However, if a project already standardizes on a library for a complex domain such as date manipulation, validation, accessibility, or data fetching, use the project's established solution instead of duplicating it.

---

## Maintenance

When improving a utility:

1. Preserve the existing API unless there is a strong reason to change it.
2. Update the documentation if behavior changes.
3. Add or update tests.
4. Check edge cases.
5. Check TypeScript inference.
6. Check browser/SSR behavior when applicable.
7. Avoid adding unnecessary configuration.
8. Keep the utility focused on one responsibility.

---

## Quick Reference

| Category    | Utility                   | Main Purpose                         |
| ----------- | ------------------------- | ------------------------------------ |
| Constant    | `HTTP_STATUS`             | Common HTTP status codes             |
| Constant    | `KEYBOARD_KEYS`           | Common keyboard key values           |
| React Hook  | `useClickOutside`         | Detect outside pointer interaction   |
| React Hook  | `useCopyToClipboard`      | Clipboard operations                 |
| React Hook  | `useDebounce`             | Delay rapidly changing values        |
| React Hook  | `useDisclosure`           | Controlled/uncontrolled boolean state|
| React Hook  | `useElementSize`          | Observe element dimensions           |
| React Hook  | `useEscapeKey`            | Handle Escape key                    |
| React Hook  | `useEventListener`        | Native DOM event subscription        |
| React Hook  | `useFocusTrap`            | Contain keyboard focus               |
| React Hook  | `useIntersectionObserver` | Observe element visibility           |
| React Hook  | `useLocalStorage`         | Persistent browser state             |
| React Hook  | `useMediaQuery`           | Reactively read media queries        |
| React Hook  | `useOnlineStatus`         | Browser online/offline state         |
| React Hook  | `usePageVisibility`       | Page visible/hidden state            |
| React Hook  | `usePrevious`             | Access previous render value         |
| React Hook  | `useScrollPosition`       | Track scroll position                |
| React Hook  | `useSessionStorage`       | Session-scoped browser state         |
| React Hook  | `useThrottle`             | Limit update frequency               |
| React Hook  | `useToggle`               | Simple boolean state                 |
| React Hook  | `useWindowSize`           | Track viewport dimensions            |
| Array       | `chunk`                   | Split array into groups              |
| Array       | `groupBy`                 | Group items by key                   |
| Array       | `unique`                  | Remove duplicate values              |
| Array       | `uniqueBy`                | Remove duplicates by key             |
| Date        | `formatDate`              | Format dates                         |
| Date        | `formatDateTime`          | Format date + time                   |
| Date        | `isValidDate`             | Validate dates                       |
| Date        | `relativeTime`            | Human-readable relative time         |
| Number      | `clamp`                   | Bound a number                       |
| Number      | `formatCurrency`          | Format currency                      |
| Number      | `formatNumber`            | Format numbers                       |
| Number      | `formatPercentage`        | Format percentages                   |
| Object      | `isEmpty`                 | Check for object keys                |
| Object      | `omit`                    | Remove selected keys                 |
| Object      | `omitNil`                 | Remove null/undefined values         |
| Object      | `pick`                    | Select specific keys                 |
| String      | `camelToTitle`            | Convert identifiers to titles        |
| String      | `capitalize`              | Capitalize first character           |
| String      | `slugify`                 | Create URL-friendly slugs            |
| String      | `truncate`                | Limit displayed text                 |

---

## Final Principle

This repository exists to reduce **repeated thinking**, not to eliminate thinking.

Before using a utility, understand what it does and whether it matches the project's requirements.

```text
Copy → Review → Adapt → Test → Use
```

> **Build once. Understand it. Reuse it.**