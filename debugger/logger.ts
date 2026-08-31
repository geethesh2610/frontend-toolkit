/**
 * LOGGER DEBUGGER
 *
 * PURPOSE
 * -------
 * Structured console logging for frontend debugging.
 *
 * Use logger.ts when you want to know:
 * - What happened?
 * - What part of the application did it happen in?
 * - Was it normal, unexpected, or an error?
 *
 * AVAILABLE METHODS
 * -----------------
 * logger.debug(message, ...data)
 *   Detailed development information.
 *   Returns: void
 *
 * logger.info(message, ...data)
 *   Meaningful application events.
 *   Returns: void
 *
 * logger.warn(message, ...data)
 *   Unexpected but recoverable situations.
 *   Returns: void
 *
 * logger.error(message, ...data)
 *   Failed operations or errors.
 *   Returns: void
 *
 * logger.group(label, callback)
 *   Groups related logs in the browser console.
 *   Returns: void
 *
 * logger.child(context)
 *   Creates a logger with a fixed context.
 *   Returns: DebugLogger
 *
 * logger.setEnabled(enabled)
 *   Enables/disables logging.
 *   Returns: void
 *
 * logger.isEnabled()
 *   Checks whether logging is enabled.
 *   Returns: boolean
 *
 * USAGE
 * -----
 * import { logger } from "./logger";
 *
 * logger.debug("Fetching users", { page: 1 });
 * logger.info("User logged in", { userId: 42 });
 * logger.warn("Using fallback configuration");
 * logger.error("Failed to load users", error);
 *
 * CONTEXT
 * -------
 * const authLogger = logger.child("Auth");
 *
 * authLogger.debug("Checking token");
 * authLogger.info("User authenticated");
 *
 * Output:
 * [31 Aug 2026, 11:40:20 AM] [DEBUG] [Auth] Checking token
 *
 * GROUPING
 * --------
 * logger.group("Checkout", () => {
 *   logger.debug("Loading cart", cart);
 *   logger.debug("Calculating total", total);
 * });
 *
 * OPTIONS
 * -------
 * new DebugLogger({
 *   enabled: true,
 *   context: "API",
 * });
 *
 * enabled:
 *   Whether logs are printed. Default: true.
 *
 * context:
 *   Optional label shown with every log.
 *
 * DATE/TIME
 * ---------
 * Uses the browser's local timezone.
 *
 * Example:
 * [31 Aug 2026, 11:40:20 AM] [INFO] User logged in
 *
 * LOGGER VS INSPECT
 * -----------------
 * logger -> "What happened?"
 * inspect -> "What is this value?"
 *
 * Objects passed to the logger remain interactive objects in DevTools.
 *
 * PERFORMANCE
 * -----------
 * Disabled logs return immediately without writing to the console.
 *
 * Note: function arguments are evaluated before the logger receives them.
 *
 * BROWSER SUPPORT
 * ---------------
 * Uses standard browser Console APIs and Intl.DateTimeFormat.
 */

export type LogLevel = "debug" | "info" | "warn" | "error";

export interface LoggerOptions {
    readonly enabled?: boolean;
    readonly context?: string;
}

const DEFAULT_ENABLED = true;

function createTimestamp(): string {
    return new Intl.DateTimeFormat("en-IN", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
        second: "2-digit",
        hour12: true,
    }).format(new Date());
}

function formatPrefix(
    level: LogLevel,
    context?: string,
): string {
    const timestamp = createTimestamp();
    const contextText = context ? ` [${ context }]` : "";

    return `[${ timestamp }][${ level.toUpperCase() }]${ contextText } `;
}

export class DebugLogger {
    private enabled: boolean;
    private readonly context?: string;

    constructor(options: LoggerOptions = {}) {
        this.enabled = options.enabled ?? DEFAULT_ENABLED;

        const context = options.context?.trim();

        if (context === "") {
            throw new TypeError(
                '[debugger/logger] "context" must be a non-empty string.',
            );
        }

        this.context = context;
    }

    debug(
        message: string,
        ...data: unknown[]
    ): void {
        if (!this.enabled) {
            return;
        }

        console.debug(
            formatPrefix("debug", this.context),
            message,
            ...data,
        );
    }

    info(
        message: string,
        ...data: unknown[]
    ): void {
        if (!this.enabled) {
            return;
        }

        console.info(
            formatPrefix("info", this.context),
            message,
            ...data,
        );
    }

    warn(
        message: string,
        ...data: unknown[]
    ): void {
        if (!this.enabled) {
            return;
        }

        console.warn(
            formatPrefix("warn", this.context),
            message,
            ...data,
        );
    }

    error(
        message: string,
        ...data: unknown[]
    ): void {
        if (!this.enabled) {
            return;
        }

        console.error(
            formatPrefix("error", this.context),
            message,
            ...data,
        );
    }

    group(
        label: string,
        callback: () => void,
    ): void {
        if (!label.trim()) {
            throw new TypeError(
                '[debugger/logger] "label" must be a non-empty string.',
            );
        }

        if (!this.enabled) {
            callback();
            return;
        }

        console.group(
            formatPrefix("debug", this.context),
            label,
        );

        try {
            callback();
        } finally {
            console.groupEnd();
        }
    }

    child(context: string): DebugLogger {
        const trimmedContext = context.trim();

        if (!trimmedContext) {
            throw new TypeError(
                '[debugger/logger] "context" must be a non-empty string.',
            );
        }

        const combinedContext = this.context
            ? `${ this.context }:${ trimmedContext } `
            : trimmedContext;

        return new DebugLogger({
            enabled: this.enabled,
            context: combinedContext,
        });
    }

    setEnabled(enabled: boolean): void {
        this.enabled = enabled;
    }

    isEnabled(): boolean {
        return this.enabled;
    }
}

export const logger = new DebugLogger();