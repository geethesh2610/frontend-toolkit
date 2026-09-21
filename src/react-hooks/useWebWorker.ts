/**
 * useWebWorker
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Runs CPU-heavy work on a Web Worker instead of the main thread, so it
 *   doesn't block rendering/input while it runs. Manages the worker's
 *   lifecycle (lazy creation, termination on unmount) and turns its
 *   message-passing protocol into a plain `async` function call.
 *
 * WHEN TO USE
 *   - Genuinely CPU-bound work that would otherwise jank the UI for more
 *     than a frame or two: parsing/transforming a large JSON payload,
 *     sorting/filtering tens of thousands of rows, image/canvas pixel
 *     manipulation, client-side encryption/hashing.
 *
 * WHEN NOT TO USE
 *   - Work that's already fast (sub-few-ms) — a worker's postMessage
 *     round-trip and structured-clone serialization cost of the
 *     input/output data has its own overhead; for small/fast work this
 *     hook is net-negative. Measure before reaching for it.
 *   - Network requests — those don't block the main thread regardless of
 *     where they're initiated from; a worker adds nothing there.
 *   - Work that needs DOM access — workers have no `window`/`document`.
 *
 * THE WORKER'S PROTOCOL (required, this hook's other half)
 *   Your worker file must speak this exact `{ id, ... }` protocol so
 *   responses can be matched back to the `run()` call that sent them:
 *
 *     // myWorker.ts
 *     self.onmessage = (event: MessageEvent<{ id: number; input: MyInput }>) => {
 *       const { id, input } = event.data
 *       try {
 *         const result = doExpensiveWork(input)
 *         self.postMessage({ id, result })
 *       } catch (error) {
 *         self.postMessage({ id, error: error instanceof Error ? error.message : String(error) })
 *       }
 *     }
 *
 * PARAMETERS
 *   createWorker   Factory returning a new `Worker` instance, e.g.
 *                  `() => new Worker(new URL('./myWorker.ts', import.meta.url), { type: 'module' })`
 *                  — a factory (not the worker itself) so the worker is only
 *                  ever constructed lazily, on the first `run()` call.
 *
 * RETURN VALUE
 *   run         `(input) => Promise<output>` — posts `input` to the worker
 *               and resolves/rejects with its response. Multiple concurrent
 *               `run()` calls are fine; each gets its own response matched
 *               by message id.
 *   terminate   Immediately kills the worker and rejects nothing (any
 *               in-flight `run()` calls will simply never resolve) — call
 *               this if you need to abandon in-flight work early, e.g. the
 *               user navigated away from the view that needed the result.
 *
 * BEHAVIOR
 *   The worker is created on the first `run()` call, not on mount — a
 *   component that renders but never calls `run()` never pays the cost of
 *   spinning up a worker.
 *
 * CLEANUP
 *   The worker is terminated automatically on unmount.
 *
 * USAGE
 *   const { run } = useWebWorker<number[], number>(
 *     () => new Worker(new URL('./sortWorker.ts', import.meta.url), { type: 'module' }),
 *   )
 *
 *   const handleSort = async () => {
 *     const sorted = await run(hugeArray)
 *     setResults(sorted)
 *   }
 * ----------------------------------------------------------------------------
 */

import { useCallback, useEffect, useRef } from "react";

interface WorkerResponse<TOutput> {
    id: number;
    result?: TOutput;
    error?: string;
}

export interface UseWebWorkerReturn<TInput, TOutput> {
    run: (input: TInput) => Promise<TOutput>;
    terminate: () => void;
}

export function useWebWorker<TInput = unknown, TOutput = unknown>(
    createWorker: () => Worker,
): UseWebWorkerReturn<TInput, TOutput> {
    const workerRef = useRef<Worker | null>(null);
    const nextIdRef = useRef(0);
    const pendingRef = useRef(new Map<number, { resolve: (value: TOutput) => void; reject: (reason: unknown) => void }>());

    const terminate = useCallback(() => {
        workerRef.current?.terminate();
        workerRef.current = null;
        pendingRef.current.clear();
    }, []);

    useEffect(() => terminate, [terminate]);

    const run = useCallback(
        (input: TInput): Promise<TOutput> => {
            if (!workerRef.current) {
                const worker = createWorker();
                worker.onmessage = (event: MessageEvent<WorkerResponse<TOutput>>) => {
                    const { id, result, error } = event.data;
                    const pending = pendingRef.current.get(id);
                    if (!pending) return;
                    pendingRef.current.delete(id);
                    if (error !== undefined) pending.reject(new Error(error));
                    else pending.resolve(result as TOutput);
                };
                workerRef.current = worker;
            }

            const id = nextIdRef.current++;

            return new Promise<TOutput>((resolve, reject) => {
                pendingRef.current.set(id, { resolve, reject });
                workerRef.current!.postMessage({ id, input });
            });
        },
        [createWorker],
    );

    return { run, terminate };
}
