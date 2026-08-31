/**
 * TIMER DEBUGGER
 *
 * PURPOSE
 * -------
 * Simple utilities for measuring how long frontend operations take.
 *
 * Use timer.ts when you want to answer:
 * - How long did this operation take?
 * - Which part of this function is slow?
 * - How long did an async operation take?
 * - How long did a particular step take?
 *
 * AVAILABLE FUNCTIONS
 * -------------------
 * start(label?)
 *   Starts a timer.
 *   Returns: Timer
 *
 * measure(label, operation)
 *   Measures an async or synchronous operation automatically.
 *   Returns: Promise<T> for async operations or T for sync operations.
 *
 * elapsed(startTime)
 *   Calculates elapsed milliseconds from a previously captured start time.
 *   Returns: number
 *
 * AVAILABLE TIMER METHODS
 * -----------------------
 * timer.end()
 *   Stops the timer and returns the elapsed time.
 *   Returns: number
 *
 * timer.elapsed()
 *   Returns the current elapsed time without stopping the timer.
 *   Returns: number
 *
 * timer.isRunning()
 *   Checks whether the timer is still running.
 *   Returns: boolean
 *
 * BASIC USAGE
 * -----------
 *
 * const timer = start("Load users");
 *
 * await loadUsers();
 *
 * const duration = timer.end();
 *
 * console.log(duration);
 *
 *
 * OUTPUT
 * ------
 * A timer itself does not automatically print to the console.
 *
 * This keeps the utility reusable.
 *
 * If a label is supplied, end() logs:
 *
 * [TIMER] Load users: 342.45ms
 *
 *
 * AUTOMATIC MEASUREMENT
 * ---------------------
 *
 * const users = await measure(
 *     "Load users",
 *     () => fetchUsers(),
 * );
 *
 * The original result is returned.
 *
 *
 * SYNC OPERATIONS
 * ---------------
 *
 * const result = measure(
 *     "Calculate total",
 *     () => calculateTotal(items),
 * );
 *
 *
 * STEP-BY-STEP TIMING
 * -------------------
 *
 * const timer = start("Dashboard");
 *
 * loadUser();
 * console.log("After user:", timer.elapsed());
 *
 * loadPermissions();
 * console.log("After permissions:", timer.elapsed());
 *
 * loadDashboard();
 *
 * timer.end();
 *
 *
 * TIMER VS PERFORMANCE
 * --------------------
 *
 * timer.ts
 *   Measures a specific piece of application code.
 *
 * performance.ts
 *   Investigates browser/page performance.
 *
 *
 * TIMER VS NETWORK
 * ----------------
 *
 * timer.ts
 *   General operation timing.
 *
 * network.ts
 *   Request/response-specific debugging.
 *
 *
 * IMPORTANT
 * ---------
 * Uses performance.now() instead of Date.now().
 *
 * performance.now() is a high-resolution monotonic clock and is therefore
 * better suited for measuring durations.
 *
 * The timer does not modify the operation being measured.
 *
 * BROWSER SUPPORT
 * ---------------
 * Requires the browser Performance API.
 */

export interface Timer {
    end(): number;
    elapsed(): number;
    isRunning(): boolean;
}

export interface TimerOptions {
    readonly log?: boolean;
}

function getPerformance(): Performance {
    if (
        typeof globalThis === "undefined" ||
        !("performance" in globalThis)
    ) {
        throw new Error(
            "[debugger/timer] Performance API is not available.",
        );
    }

    return globalThis.performance;
}

function validateLabel(label: string): string {
    const trimmedLabel = label.trim();

    if (!trimmedLabel) {
        throw new TypeError(
            '[debugger/timer] "label" must be a non-empty string.',
        );
    }

    return trimmedLabel;
}

function formatDuration(duration: number): string {
    return `${ duration.toFixed(2) } ms`;
}

export function start(
    label?: string,
    options: TimerOptions = {},
): Timer {
    const timerLabel = label?.trim() || "Timer";
    const shouldLog = options.log ?? true;

    const performanceApi = getPerformance();
    const startTime = performanceApi.now();

    let running = true;
    let endTime: number | undefined;

    const getElapsed = (): number => {
        const currentTime = endTime ?? performanceApi.now();

        return Math.max(0, currentTime - startTime);
    };

    return {
        end(): number {
            if (!running) {
                throw new Error(
                    `[debugger/timer] Timer "${timerLabel}" has already been ended.`,
                );
            }

            endTime = performanceApi.now();
            running = false;

            const duration = getElapsed();

            if (shouldLog) {
                console.debug(
                    `[TIMER] ${ timerLabel }: ${ formatDuration(duration) } `,
                );
            }

            return duration;
        },

        elapsed(): number {
            return getElapsed();
        },

        isRunning(): boolean {
            return running;
        },
    };
}

export function elapsed(startTime: number): number {
    if (!Number.isFinite(startTime)) {
        throw new TypeError(
            `[debugger/timer]"startTime" must be a finite number.Received: ${
    String(
        startTime,
    )
} `,
        );
    }

    return Math.max(
        0,
        getPerformance().now() - startTime,
    );
}

export function measure<T>(
    label: string,
    operation: () => T | Promise<T>,
): T | Promise<T> {
    const timerLabel = validateLabel(label);

    if (typeof operation !== "function") {
        throw new TypeError(
            '[debugger/timer] "operation" must be a function.',
        );
    }

    const timer = start(timerLabel);

    try {
        const result = operation();

        if (
            result !== null &&
            typeof result === "object" &&
            "then" in result &&
            typeof result.then === "function"
        ) {
            return Promise.resolve(result).finally(() => {
                timer.end();
            });
        }

        timer.end();

        return result;
    } catch (error: unknown) {
        timer.end();
        throw error;
    }
}