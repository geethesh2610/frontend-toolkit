/**
 * DEBUGGER SHARED TYPES
 *
 * PURPOSE
 * -------
 * Contains types shared across multiple debugger utilities.
 *
 * Keep this file intentionally small.
 *
 * Only move a type here when it is genuinely shared by multiple debugger
 * files. Types that belong to only one utility should remain in that file.
 *
 * AVAILABLE TYPES
 * ---------------
 *
 * LogLevel
 *   Supported logger levels.
 *
 *   "debug" | "info" | "warn" | "error"
 *
 * StorageType
 *   Supported browser storage types.
 *
 *   "local" | "session"
 *
 * DebugData
 *   A value that can be supplied as additional debugger information.
 *
 * DebugContext
 *   Optional contextual information attached to debugger operations.
 *
 * USAGE
 * -----
 *
 * import type {
 *   LogLevel,
 *   StorageType,
 *   DebugData,
 *   DebugContext,
 * } from "./types";
 *
 * IMPORTANT
 * ---------
 * This file contains TypeScript types only.
 *
 * It should not contain runtime logic, functions, browser APIs, or debugging
 * behavior.
 *
 * This keeps it safe to import with:
 *
 *     import type { LogLevel } from "./types";
 *
 * and prevents unnecessary runtime dependencies between debugger files.
 */

export type LogLevel =
    | "debug"
    | "info"
    | "warn"
    | "error";

export type StorageType =
    | "local"
    | "session";

export type DebugData = unknown;

export interface DebugContext {
    readonly source?: string;
    readonly feature?: string;
    readonly operation?: string;
}