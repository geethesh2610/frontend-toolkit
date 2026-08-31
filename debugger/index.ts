/**
 * DEBUGGER TOOLKIT ENTRY POINT
 *
 * PURPOSE
 * -------
 * Central entry point for the personal frontend debugging toolkit.
 *
 * This file does not contain debugging logic.
 * It simply exposes the utilities from the debugger folder through one import.
 *
 * AVAILABLE UTILITIES
 * -------------------
 *
 * inspect
 *   Inspect and understand JavaScript values.
 *
 * logger
 *   Structured application logging.
 *
 * start / measure / elapsed
 *   Measure how long specific operations take.
 *
 * browser
 *   Inspect browser, device, viewport, and environment information.
 *
 * storage
 *   Inspect and manage localStorage/sessionStorage.
 *
 * errors
 *   Normalize, inspect, and log unknown errors.
 *
 * performance
 *   Inspect browser/page performance.
 *
 *
 * USAGE
 * -----
 *
 * Instead of:
 *
 * import { inspect } from "./debugger/inspect";
 * import { logger } from "./debugger/logger";
 * import { browser } from "./debugger/browser";
 *
 * you can use:
 *
 * import {
 *     inspect,
 *     logger,
 *     browser,
 * } from "./debugger";
 *
 *
 * EXAMPLES
 * --------
 *
 * logger.debug("Loading users");
 *
 * console.log(inspect(user));
 *
 * console.log(browser.info());
 *
 * console.log(storage.keys());
 *
 * errors.log(error, "UserProfile");
 *
 * const timer = start("Load dashboard");
 * await loadDashboard();
 * timer.end();
 *
 *
 * IMPORTANT
 * ---------
 * Keep this file limited to exports.
 *
 * Do not add application logic, state, configuration, or browser behavior
 * here. Individual debugger files should remain independently usable.
 */

export {
    inspect,
    inspectJson,
    inspectValue,
    isPlainObject,
} from "./inspect";

export type {
    InspectOptions,
    InspectValue,
} from "./inspect";

export {
    DebugLogger,
    logger,
} from "./logger";

export type {
    LogLevel,
    LoggerOptions,
} from "./logger";

export {
    start,
    measure,
    elapsed,
} from "./timer";

export type {
    Timer,
    TimerOptions,
} from "./timer";

export {
    browser,
} from "./browser";

export type {
    BrowserInfo,
    ConnectionInfo,
    DeviceType,
    ScreenInfo,
    ViewportInfo,
} from "./browser";

export {
    storage,
} from "./storage";

export type {
    StorageEntry,
    StorageType,
} from "./storage";

export {
    errors,
} from "./errors";

export type {
    ErrorInfo,
} from "./errors";

export {
    performanceSummary,
    navigation,
    resources,
    marks,
    measures,
    mark,
    measure as performanceMeasure,
    clearMarks,
    clearMeasures,
    observeLongTasks,
} from "./performance";

export type {
    MemoryInfo,
    NavigationTiming,
    PerformanceSummary,
} from "./performance";