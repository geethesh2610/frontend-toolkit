import { DemoDot, DemoRow, DemoText } from "../App.style";
import { useOnlineStatus } from "../react-hooks/useOnlineStatus";

export default function UseOnlineStatusExample() {
    const isOnline = useOnlineStatus();

    return (
        <DemoRow>
            <DemoDot $active={isOnline} />
            <DemoText>{isOnline ? "Online" : "Offline"}</DemoText>
            <DemoText $muted>Toggle your network connection (or DevTools' "Offline" throttle) to see it flip.</DemoText>
        </DemoRow>
    );
}
