/**
 * useCopyToClipboard
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Copies a string to the system clipboard and exposes copy status/error
 *   state so the UI can show feedback (e.g. "Copied!" next to a button).
 *
 * WHEN TO USE
 *   - "Copy" buttons next to code snippets, share links, API keys, etc.
 *   - Any UI that needs a transient "copied" indicator that clears itself.
 *
 * WHEN NOT TO USE
 *   - Reading FROM the clipboard (that's a separate concern with its own,
 *     much stricter permission model — `navigator.clipboard.readText`).
 *   - Copying non-text data (images, HTML, rich content) — this hook is
 *     text-only, which covers the overwhelming majority of real use cases
 *     without pulling in ClipboardItem's more complex, less-supported API.
 *
 * PARAMETERS
 *   options.resetDelay   Milliseconds before `isCopied` automatically flips
 *                         back to `false` after a successful copy. Default
 *                         `2000`. Pass `0` to disable auto-reset (the
 *                         "copied" state then only clears on the next
 *                         `copy()` call or unmount).
 *
 * RETURN VALUE
 *   copy         `(text: string) => Promise<boolean>` — attempts the copy,
 *                resolves `true` on success, `false` on failure. Never
 *                throws; failures are surfaced through `error` instead.
 *   copiedText   The most recently successfully copied string, or `null`
 *                if nothing has been copied yet (or the reset delay
 *                elapsed). Useful when you copy different values from a
 *                list and need to know exactly which one succeeded.
 *   isCopied     `true` for `resetDelay` ms after a successful copy.
 *   error        The `Error` from the most recent failed copy attempt, or
 *                `null`. Cleared automatically at the start of the next
 *                `copy()` call.
 *
 * BEHAVIOR
 *   - Tries the modern `navigator.clipboard.writeText` API first.
 *   - Falls back to a hidden-textarea + `document.execCommand('copy')`
 *     strategy if the Clipboard API is unavailable (older browsers,
 *     non-secure/HTTP contexts, some embedded webviews).
 *   - Calling `copy()` again before `resetDelay` elapses cancels the
 *     pending reset and starts a fresh timer.
 *
 * ERROR BEHAVIOR
 *   Copy failures are real and expected in production (clipboard
 *   permission denied, document not focused, execCommand unsupported) —
 *   they are captured into the `error` state rather than thrown or logged,
 *   so the caller decides how to surface them (toast, inline message, etc).
 *
 * SSR / BROWSER CONSIDERATIONS
 *   `copy()` is only ever invoked from a user event handler on the client,
 *   but it still guards against `navigator`/`document` being unavailable
 *   and resolves `false` with an error in that case rather than throwing.
 *   No `"use client"` requirement beyond whatever the consuming component
 *   already needs for its event handlers.
 *
 * CLEANUP
 *   The pending reset `setTimeout` is cleared on unmount and before each
 *   new copy, so no state updates fire after the component is gone.
 *
 * USAGE
 *   const { copy, isCopied, error } = useCopyToClipboard()
 *
 *   <button onClick={() => copy(shareUrl)}>
 *     {isCopied ? 'Copied!' : 'Copy link'}
 *   </button>
 *   {error && <span role="alert">Couldn't copy: {error.message}</span>}
 * ----------------------------------------------------------------------------
 */

import { useCallback, useEffect, useRef, useState } from "react";

export interface UseCopyToClipboardOptions {
    /** Ms before `isCopied` resets to `false`. Default `2000`. `0` disables auto-reset. */
    resetDelay?: number;
}

export interface UseCopyToClipboardReturn {
    copy: (text: string) => Promise<boolean>;
    copiedText: string | null;
    isCopied: boolean;
    error: Error | null;
}

/** Hidden-textarea fallback for environments without the async Clipboard API. */
function legacyCopy(text: string): boolean {
    const textarea = document.createElement("textarea");
    textarea.value = text;

    // Keep it out of the viewport and out of the accessibility tree; avoid
    // any layout/scroll jump while still letting `select()` work.
    textarea.setAttribute("readonly", "");
    textarea.style.position = "fixed";
    textarea.style.top = "0";
    textarea.style.left = "0";
    textarea.style.width = "1px";
    textarea.style.height = "1px";
    textarea.style.padding = "0";
    textarea.style.border = "none";
    textarea.style.opacity = "0";

    document.body.appendChild(textarea);
    const previouslyFocused = document.activeElement as HTMLElement | null;

    textarea.select();
    textarea.setSelectionRange(0, textarea.value.length);

    let succeeded = false;
    try {
        succeeded = document.execCommand("copy");
    } finally {
        document.body.removeChild(textarea);
        previouslyFocused?.focus?.();
    }

    return succeeded;
}

export function useCopyToClipboard(
    options: UseCopyToClipboardOptions = {},
): UseCopyToClipboardReturn {
    const { resetDelay = 2000 } = options;

    const [copiedText, setCopiedText] = useState<string | null>(null);
    const [error, setError] = useState<Error | null>(null);

    const resetTimeoutRef = useRef<ReturnType<typeof setTimeout> | undefined>(
        undefined,
    );
    const isMountedRef = useRef(true);

    useEffect(() => {
        isMountedRef.current = true;
        return () => {
            isMountedRef.current = false;
            clearTimeout(resetTimeoutRef.current);
        };
    }, []);

    const copy = useCallback(
        async (text: string): Promise<boolean> => {
            clearTimeout(resetTimeoutRef.current);

            if (typeof navigator === "undefined" || typeof document === "undefined") {
                const err = new Error(
                    "Clipboard is not available in this environment.",
                );
                if (isMountedRef.current) {
                    setError(err);
                    setCopiedText(null);
                }
                return false;
            }

            try {
                if (navigator.clipboard?.writeText) {
                    await navigator.clipboard.writeText(text);
                } else if (!legacyCopy(text)) {
                    throw new Error("Copy command was not successful.");
                }

                if (isMountedRef.current) {
                    setCopiedText(text);
                    setError(null);

                    if (resetDelay > 0) {
                        resetTimeoutRef.current = setTimeout(() => {
                            if (isMountedRef.current) setCopiedText(null);
                        }, resetDelay);
                    }
                }

                return true;
            } catch (caught) {
                const err =
                    caught instanceof Error
                        ? caught
                        : new Error("Failed to copy to clipboard.");
                if (isMountedRef.current) {
                    setError(err);
                    setCopiedText(null);
                }
                return false;
            }
        },
        [resetDelay],
    );

    return {
        copy,
        copiedText,
        isCopied: copiedText !== null,
        error,
    };
}
