/*
 * Registry of "live example" components, keyed by the catalog item's exact
 * `name` (as written in App.data.ts). CodeView looks up `EXAMPLES[item.name]`
 * and, if present, renders it above the source — an actual working instance
 * of the hook/component, not just its code.
 */

import type { ComponentType } from "react";

import AccordionExample from "./Accordion.example";
import CenterExample from "./Center.example";
import DataTableExample from "./DataTable.example";
import FlexExample from "./Flex.example";
import GridExample from "./Grid.example";
import ModalExample from "./Modal.example";
import ScrollAreaExample from "./ScrollArea.example";
import SelectExample from "./Select.example";
import ShowExample from "./Show.example";
import StackExample from "./Stack.example";
import TabsExample from "./Tabs.example";
import UseClickOutsideExample from "./useClickOutside.example";
import UseControllableStateExample from "./useControllableState.example";
import UseCopyToClipboardExample from "./useCopyToClipboard.example";
import UseDebounceExample from "./useDebounce.example";
import UseDisclosureExample from "./useDisclosure.example";
import UseElementSizeExample from "./useElementSize.example";
import UseEscapeKeyExample from "./useEscapeKey.example";
import UseEventListenerExample from "./useEventListener.example";
import UseFocusTrapExample from "./useFocusTrap.example";
import UseIntersectionObserverExample from "./useIntersectionObserver.example";
import UseLatestExample from "./useLatest.example";
import UseLocalStorageExample from "./useLocalStorage.example";
import UseMediaQueryExample from "./useMediaQuery.example";
import UseOnlineStatusExample from "./useOnlineStatus.example";
import UsePageVisibilityExample from "./usePageVisibility.example";
import UsePreviousExample from "./usePrevious.example";
import UseScrollPositionExample from "./useScrollPosition.example";
import UseSessionStorageExample from "./useSessionStorage.example";
import UseStableCallbackExample from "./useStableCallback.example";
import UseThrottleExample from "./useThrottle.example";
import UseToggleExample from "./useToggle.example";
import UseWebWorkerExample from "./useWebWorker.example";
import UseWindowSizeExample from "./useWindowSize.example";
import VirtualListExample from "./VirtualList.example";

export const EXAMPLES: Record<string, ComponentType> = {
    // react-hooks/
    useDebounce: UseDebounceExample,
    useThrottle: UseThrottleExample,
    useToggle: UseToggleExample,
    useDisclosure: UseDisclosureExample,
    usePrevious: UsePreviousExample,
    useLocalStorage: UseLocalStorageExample,
    useSessionStorage: UseSessionStorageExample,
    useMediaQuery: UseMediaQueryExample,
    useWindowSize: UseWindowSizeExample,
    useElementSize: UseElementSizeExample,
    useScrollPosition: UseScrollPositionExample,
    useIntersectionObserver: UseIntersectionObserverExample,
    useOnlineStatus: UseOnlineStatusExample,
    usePageVisibility: UsePageVisibilityExample,
    useClickOutside: UseClickOutsideExample,
    useEscapeKey: UseEscapeKeyExample,
    useFocusTrap: UseFocusTrapExample,
    useEventListener: UseEventListenerExample,
    useCopyToClipboard: UseCopyToClipboardExample,
    useControllableState: UseControllableStateExample,
    useLatest: UseLatestExample,
    useStableCallback: UseStableCallbackExample,
    useWebWorker: UseWebWorkerExample,

    // components/
    Modal: ModalExample,
    Accordion: AccordionExample,
    Tabs: TabsExample,
    Stack: StackExample,
    Flex: FlexExample,
    Grid: GridExample,
    Center: CenterExample,
    Show: ShowExample,
    ScrollArea: ScrollAreaExample,
    DataTable: DataTableExample,
    Select: SelectExample,
    "VirtualList / VirtualGrid": VirtualListExample,
};
