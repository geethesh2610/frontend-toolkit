/**
 * PERFORMANCE DEBUGGER
 *
 * PURPOSE
 * -------
 * Browser performance inspection utilities for frontend debugging.
 *
 * Helps answer:
 * - Is the page loading slowly?
 * - Which resources are taking time to load?
 * - Are there long-running tasks blocking the main thread?
 * - What are the page navigation timings?
 * - What performance marks/measures exist?
 * - Is browser memory usage available?
 * - What are the current Web Vital measurements when supported?
 *
 * AVAILABLE FUNCTIONS
 * -------------------
 * performanceSummary()
 *   Returns a snapshot of important page performance information.
 *   Returns: PerformanceSummary
 *
 * navigation()
 *   Returns browser navigation timing information.
 *   Returns: NavigationTiming | null
 *
 * resources()
 *   Returns resources loaded by the current page.
 *   Returns: readonly ResourceTiming[]
 *
 * marks()
 *   Returns performance marks created by the application.
 *   Returns: readonly PerformanceMark[]
 *
 * measures()
 *   Returns performance measures created by the application.
 *   Returns: readonly PerformanceMeasure[]
 *
 * clearMarks(name?)
 *   Clears one or all performance marks.
 *   Returns: void
 *
 * clearMeasures(name?)
 *   Clears one or all performance measures.
 *   Returns: void
 *
 * observeLongTasks(callback)
 *   Watches for main-thread tasks that block for 50ms or more.
 *   Returns: () => void
 *
 * memory()
 *   Returns browser memory information when supported.
 *   Returns: MemoryInfo | null
 *
 * mark(name)
 *   Creates a named performance mark.
 *   Returns: void
 *
 * measure(name, startMark?, endMark?)
 *   Creates a performance measure.
 *   Returns: PerformanceMeasure
 *
 *
 * QUICK USAGE
 * -----------
 *
 * import {
 *   performanceSummary,
 *   resources,
 *   observeLongTasks,
 *   mark,
 *   measure,
 * } from "./performance";
 *
 * console.log(performanceSummary());
 *
 * console.log(resources());
 *
 *
 * MARK / MEASURE
 * --------------
 *
 * mark("users-start");
 *
 * await loadUsers();
 *
 * mark("users-end");
 *
 * const result = measure(
 *   "load-users",
 *   "users-start",
 *   "users-end",
 * );
 *
 * console.log(result.duration);
 *
 *
 * LONG TASKS
 * ----------
 *
 * const stop = observeLongTasks((entry) => {
 *   console.log("Long task:", entry.duration);
 * });
 *
 * // Later:
 * stop();
 *
 *
 * IMPORTANT
 * ---------
 * Performance APIs are browser APIs. Some features are not available in
 * every browser.
 *
 * Unsupported features return null or an empty collection where appropriate.
 *
 * This utility does not attempt to replace Lighthouse, Chrome DevTools,
 * WebPageTest, or dedicated performance monitoring tools.
 *
 * TIMER VS PERFORMANCE
 * --------------------
 * timer.ts:
 *   Measures a specific operation.
 *
 * performance.ts:
 *   Investigates browser/page performance.
 *
 * SECURITY
 * --------
 * Performance information can reveal URLs, resource names, and application
 * behavior. Avoid exposing performance data to users or external systems
 * unless intentionally required.
 *
 * IMMUTABILITY
 * ------------
 * Returned arrays are snapshots and the debugger does not modify the
 * browser's performance entries.
 */

export interface MemoryInfo {
    readonly usedJSHeapSize: number;
    readonly totalJSHeapSize: number;
    readonly jsHeapSizeLimit: number;
}

export interface NavigationTiming {
    readonly type: string;
    readonly startTime: number;
    readonly duration: number;
    readonly redirectCount: number;
    readonly dnsLookup: number;
    readonly tcpConnection: number;
    readonly requestTime: number;
    readonly responseTime: number;
    readonly domInteractive: number;
    readonly domContentLoaded: number;
    readonly domComplete: number;
    readonly loadEvent: number;
}

export interface PerformanceSummary {
    readonly now: number;
    readonly navigation: NavigationTiming | null;
    readonly resourceCount: number;
    readonly markCount: number;
    readonly measureCount: number;
    readonly memory: MemoryInfo | null;
}

type PerformanceMemory = {
    readonly usedJSHeapSize: number;
    readonly totalJSHeapSize: number;
    readonly jsHeapSizeLimit: number;
};

type PerformanceWithMemory = Performance & {
    readonly memory?: PerformanceMemory;
};

function getPerformance(): Performance {
    if (
        typeof globalThis === "undefined" ||
        !("performance" in globalThis)
    ) {
        throw new Error(
            "[debugger/performance] Performance API is not available in this environment.",
        );
    }

    return globalThis.performance;
}

function getNavigationEntry(): PerformanceNavigationTiming | null {
    const performanceApi = getPerformance();

    const entry = performanceApi.getEntriesByType(
        "navigation",
    )[0];

    return entry instanceof PerformanceNavigationTiming
        ? entry
        : null;
}

function toDuration(
    start: number,
    end: number,
): number {
    return Math.max(0, end - start);
}

function getMemoryInfo(): MemoryInfo | null {
    const performanceApi = getPerformance() as PerformanceWithMemory;

    if (!performanceApi.memory) {
        return null;
    }

    return {
        usedJSHeapSize: performanceApi.memory.usedJSHeapSize,
        totalJSHeapSize: performanceApi.memory.totalJSHeapSize,
        jsHeapSizeLimit: performanceApi.memory.jsHeapSizeLimit,
    };
}

export function navigation(): NavigationTiming | null {
    const entry = getNavigationEntry();

    if (!entry) {
        return null;
    }

    return {
        type: entry.type,
        startTime: entry.startTime,
        duration: entry.duration,
        redirectCount: entry.redirectCount,

        dnsLookup: toDuration(
            entry.domainLookupStart,
            entry.domainLookupEnd,
        ),

        tcpConnection: toDuration(
            entry.connectStart,
            entry.connectEnd,
        ),

        requestTime: toDuration(
            entry.requestStart,
            entry.responseStart,
        ),

        responseTime: toDuration(
            entry.responseStart,
            entry.responseEnd,
        ),

        domInteractive: entry.domInteractive,
        domContentLoaded: entry.domContentLoadedEventEnd,
        domComplete: entry.domComplete,
        loadEvent: entry.loadEventEnd,
    };
}

export function resources(): readonly PerformanceResourceTiming[] {
    return getPerformance()
        .getEntriesByType("resource")
        .filter(
            (entry): entry is PerformanceResourceTiming =>
                entry instanceof PerformanceResourceTiming,
        );
}

export function marks(): readonly PerformanceMark[] {
    return getPerformance()
        .getEntriesByType("mark")
        .filter(
            (entry): entry is PerformanceMark =>
                entry instanceof PerformanceMark,
        );
}

export function measures(): readonly PerformanceMeasure[] {
    return getPerformance()
        .getEntriesByType("measure")
        .filter(
            (entry): entry is PerformanceMeasure =>
                entry instanceof PerformanceMeasure,
        );
}

export function mark(name: string): void {
    const trimmedName = name.trim();

    if (!trimmedName) {
        throw new TypeError(
            '[debugger/performance] "name" must be a non-empty string.',
        );
    }

    getPerformance().mark(trimmedName);
}

export function measure(
    name: string,
    startMark?: string,
    endMark?: string,
): PerformanceMeasure {
    const trimmedName = name.trim();

    if (!trimmedName) {
        throw new TypeError(
            '[debugger/performance] "name" must be a non-empty string.',
        );
    }

    const performanceApi = getPerformance();

    try {
        return performanceApi.measure(
            trimmedName,
            startMark?.trim() || undefined,
            endMark?.trim() || undefined,
        );
    } catch (error: unknown) {
        throw new Error(
            `[debugger/performance] Unable to create measure "${trimmedName}".Check that the supplied marks exist.`,
            {
                cause: error,
            },
        );
    }
}

export function clearMarks(name?: string): void {
    const performanceApi = getPerformance();

    if (name === undefined) {
        performanceApi.clearMarks();
        return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
        throw new TypeError(
            '[debugger/performance] "name" must be a non-empty string.',
        );
    }

    performanceApi.clearMarks(trimmedName);
}

export function clearMeasures(name?: string): void {
    const performanceApi = getPerformance();

    if (name === undefined) {
        performanceApi.clearMeasures();
        return;
    }

    const trimmedName = name.trim();

    if (!trimmedName) {
        throw new TypeError(
            '[debugger/performance] "name" must be a non-empty string.',
        );
    }

    performanceApi.clearMeasures(trimmedName);
}

export function observeLongTasks(
    callback: (entry: PerformanceEntry) => void,
): () => void {
    if (typeof callback !== "function") {
        throw new TypeError(
            '[debugger/performance] "callback" must be a function.',
        );
    }

    if (typeof PerformanceObserver === "undefined") {
        return () => undefined;
    }

    const supportedEntryTypes =
        PerformanceObserver.supportedEntryTypes ?? [];

    if (!supportedEntryTypes.includes("longtask")) {
        return () => undefined;
    }

    const observer = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
            callback(entry);
        }
    });

    observer.observe({
        type: "longtask",
        buffered: true,
    });

    return () => {
        observer.disconnect();
    };
}

export function performanceSummary(): PerformanceSummary {
    const performanceApi = getPerformance();

    return {
        now: performanceApi.now(),
        navigation: navigation(),
        resourceCount: resources().length,
        markCount: marks().length,
        measureCount: measures().length,
        memory: getMemoryInfo(),
    };
}