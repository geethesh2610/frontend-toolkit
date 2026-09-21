/*
 * Minimal worker speaking the { id, ... } protocol useWebWorker expects.
 * `self` is cast rather than typed via the `webworker` lib to avoid
 * conflicting with this project's DOM lib types in the same tsconfig.
 */
export {};

interface DemoWorkerMessage {
    id: number;
    input: number[];
}

const ctx = self as unknown as {
    onmessage: ((event: MessageEvent<DemoWorkerMessage>) => void) | null;
    postMessage: (message: { id: number; result?: number[]; error?: string }) => void;
};

ctx.onmessage = (event) => {
    const { id, input } = event.data;
    try {
        const result = [...input].sort((a, b) => a - b);
        ctx.postMessage({ id, result });
    } catch (error) {
        ctx.postMessage({ id, error: error instanceof Error ? error.message : String(error) });
    }
};
