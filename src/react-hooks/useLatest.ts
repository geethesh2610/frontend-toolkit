/**
 * useLatest
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Returns a ref that always holds the most recently rendered value,
 *   without the ref's own identity ever changing. Use it to read a fresh
 *   value from inside a callback/effect/subscription WITHOUT putting that
 *   value in a dependency array — so the callback/effect isn't torn down
 *   and recreated just because the value changed.
 *
 * WHEN TO USE
 *   - Inside a long-lived subscription (WebSocket handler, event listener,
 *     `setInterval`) that needs the CURRENT value of a prop/state on each
 *     event, where re-subscribing every time that value changes would be
 *     wasteful or behaviorally wrong (e.g. it would reconnect a socket).
 *   - As the building block for "stable identity, fresh closure" hooks —
 *     see `useStableCallback`, which is implemented on top of this one.
 *
 * WHEN NOT TO USE
 *   - As a blanket escape hatch from `useEffect`'s dependency array to
 *     silence the exhaustive-deps lint rule — that hides real bugs far more
 *     often than it fixes them. Reach for this only for the specific
 *     "long-lived subscription reading a changing value" shape above.
 *   - For values that should trigger a re-render when they change — reading
 *     this ref's `.current` never causes one, by design.
 *
 * PARAMETERS
 *   value   The value to keep a live reference to. Any type.
 *
 * RETURN VALUE
 *   A `RefObject<T>` whose `.current` is always the most recently rendered
 *   `value`. Read `.current` at CALL TIME (inside a callback/effect) —
 *   during render, just use `value` directly instead.
 *
 * BEHAVIOR
 *   The ref is written to synchronously during render (not inside an
 *   effect), so `.current` is already up to date by the time any effect or
 *   event handler from THIS render runs — this is the standard
 *   implementation for this exact hook shape.
 *
 * PERFORMANCE
 *   O(1); this hook never causes a re-render.
 *
 * USAGE
 *   function ChatRoom({ roomId, onMessage }: Props) {
 *     const onMessageRef = useLatest(onMessage)
 *
 *     useEffect(() => {
 *       const socket = connect(roomId)
 *       // Always calls the LATEST onMessage without needing it in the dep
 *       // array — the socket only reconnects when roomId actually changes.
 *       socket.on('message', (msg) => onMessageRef.current(msg))
 *       return () => socket.disconnect()
 *     }, [roomId])
 *   }
 * ----------------------------------------------------------------------------
 */

import { useRef, type RefObject } from "react";

export function useLatest<T>(value: T): RefObject<T> {
    const ref = useRef(value);
    ref.current = value;
    return ref;
}
