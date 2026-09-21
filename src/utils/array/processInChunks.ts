/**
 * processInChunks
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Runs `fn` over every item in `items`, but yields control back to the
 *   browser between chunks — so processing a huge array doesn't block the
 *   main thread as one long task (janking scroll/input/animations for
 *   hundreds of milliseconds or more). `chunk.ts` in this same folder just
 *   SPLITS an array; this actually spreads the WORK over multiple event-loop
 *   turns.
 *
 * WHEN TO USE
 *   - Processing a large client-side dataset synchronously would otherwise
 *     take more than ~50ms (roughly the "long task" threshold) — e.g.
 *     transforming a big CSV import, re-indexing a large in-memory list,
 *     running a synchronous validator over thousands of rows.
 *
 * WHEN NOT TO USE
 *   - The array is small enough that processing it all at once already
 *     takes well under a frame (~16ms) — this adds scheduling overhead for
 *     no benefit.
 *   - The work is actually async/IO-bound (network calls) — that already
 *     yields to the event loop on its own; reach for `Promise.all`/a
 *     concurrency limiter instead, not this.
 *   - You need the absolute fastest total wall-clock completion time and
 *     don't care about blocking the main thread meanwhile (e.g. a one-off
 *     script, not a user-facing page) — yielding between chunks makes the
 *     UI responsive at the cost of the total operation taking longer.
 *
 * PARAMETERS
 *   items        The array to process.
 *   fn           `(item, index) => void`, called once per item, in order.
 *   options.chunkSize   Items processed synchronously before yielding once.
 *                        Default `200` — tune based on how expensive `fn`
 *                        is per item; cheaper `fn` can afford a bigger
 *                        chunk.
 *   options.signal      An `AbortSignal` — if already aborted, or aborted
 *                        mid-run, processing stops at the next yield point
 *                        without processing the remaining items.
 *
 * RETURN VALUE
 *   A `Promise<void>` that resolves once every item has been processed (or
 *   the signal aborted).
 *
 * BEHAVIOR
 *   Yields via `requestIdleCallback` when available (so the browser can
 *   schedule the next chunk during actual idle time), falling back to
 *   `setTimeout(resolve, 0)` in environments without it.
 *
 * USAGE
 *   const controller = new AbortController()
 *
 *   await processInChunks(
 *     hugeRowList,
 *     (row) => validateAndIndex(row),
 *     { chunkSize: 500, signal: controller.signal },
 *   )
 *
 *   // Elsewhere, e.g. if the user navigates away mid-import:
 *   controller.abort()
 * ----------------------------------------------------------------------------
 */

export interface ProcessInChunksOptions {
    chunkSize?: number
    signal?: AbortSignal
}

function yieldToMain(): Promise<void> {
    return new Promise((resolve) => {
        if (typeof requestIdleCallback === 'function') {
            requestIdleCallback(() => resolve(), { timeout: 50 })
        } else {
            setTimeout(resolve, 0)
        }
    })
}

export async function processInChunks<T>(
    items: readonly T[],
    fn: (item: T, index: number) => void,
    options: ProcessInChunksOptions = {}
): Promise<void> {
    const { chunkSize = 200, signal } = options

    for (let start = 0; start < items.length; start += chunkSize) {
        if (signal?.aborted) return

        const end = Math.min(start + chunkSize, items.length)
        for (let index = start; index < end; index++) {
            fn(items[index], index)
        }

        if (end < items.length) {
            await yieldToMain()
        }
    }
}
