/*
 * The dropdown's listbox — shared between virtualized and non-virtualized
 * rendering so keyboard navigation (driven by `activeKey` from useSelect)
 * behaves identically either way.
 *
 * Built with `role="listbox"`/`role="option"` on plain `<div>`s rather than
 * `<ul>`/`<li>` — ARIA roles don't require the matching native tag, and a
 * virtualized item needs an absolutely-positioned wrapper as a sibling
 * inside a sized spacer, which nested `<li>`s can't validly express.
 */

import { useRef, type CSSProperties, type ReactNode } from "react";

import { useVirtualizer } from "@tanstack/react-virtual";

import { sanitizeId } from "./sanitizeId";
import type { SelectClassNames, SelectFlatItem, SelectOption, SelectValue } from "./Select.types";

export interface SelectOptionListProps<TValue extends SelectValue> {
    listboxId: string;
    items: SelectFlatItem<TValue>[];
    activeKey: string | null;
    isSelected: (value: TValue) => boolean;
    onHover: (key: string) => void;
    onSelect: (option: SelectOption<TValue>) => void;
    onCreate: () => void;
    multiple: boolean;
    showCheckboxes: boolean;
    renderOption?: (option: SelectOption<TValue>, state: { selected: boolean; active: boolean }) => ReactNode;
    enableVirtualization: boolean;
    optionHeight: number;
    maxDropdownHeight: number;
    isLoading?: boolean;
    noOptionsMessage?: ReactNode;
    classNames?: SelectClassNames;
}

export default function SelectOptionList<TValue extends SelectValue>({
    listboxId,
    items,
    activeKey,
    isSelected,
    onHover,
    onSelect,
    onCreate,
    multiple,
    showCheckboxes,
    renderOption,
    enableVirtualization,
    optionHeight,
    maxDropdownHeight,
    isLoading,
    noOptionsMessage,
    classNames,
}: SelectOptionListProps<TValue>) {
    const scrollRef = useRef<HTMLDivElement>(null);

    const virtualizer = useVirtualizer({
        count: items.length,
        getScrollElement: () => scrollRef.current,
        estimateSize: (index) => (items[index].type === "group" ? 28 : optionHeight),
        overscan: 8,
        enabled: enableVirtualization,
    });

    const renderItem = (item: SelectFlatItem<TValue>, style?: CSSProperties) => {
        const id = `${listboxId}-${sanitizeId(item.key)}`;

        if (item.type === "group") {
            return (
                <div key={item.key} id={id} role="presentation" className={classNames?.groupHeading} style={style}>
                    {item.label}
                </div>
            );
        }

        if (item.type === "create") {
            return (
                <div
                    key={item.key}
                    id={id}
                    role="option"
                    aria-selected={false}
                    data-active={activeKey === item.key || undefined}
                    className={classNames?.createOption}
                    style={style}
                    onMouseEnter={() => onHover(item.key)}
                    onClick={onCreate}
                >
                    {item.label}
                </div>
            );
        }

        const selected = isSelected(item.option.value);
        const active = activeKey === item.key;

        return (
            <div
                key={item.key}
                id={id}
                role="option"
                aria-selected={selected}
                aria-disabled={item.option.disabled || undefined}
                data-active={active || undefined}
                data-selected={selected || undefined}
                data-disabled={item.option.disabled || undefined}
                className={classNames?.option}
                style={style}
                onMouseEnter={() => onHover(item.key)}
                onClick={() => onSelect(item.option)}
            >
                {multiple && showCheckboxes && (
                    <input
                        type="checkbox"
                        checked={selected}
                        readOnly
                        tabIndex={-1}
                        className={classNames?.optionCheckbox}
                    />
                )}
                <span className={classNames?.optionLabel}>
                    {renderOption ? renderOption(item.option, { selected, active }) : item.option.label}
                </span>
            </div>
        );
    };

    if (isLoading) {
        return (
            <div id={listboxId} role="listbox" className={classNames?.loadingState} style={{ maxHeight: maxDropdownHeight }}>
                <div role="presentation">Loading…</div>
            </div>
        );
    }

    if (items.length === 0) {
        return (
            <div id={listboxId} role="listbox" className={classNames?.emptyState} style={{ maxHeight: maxDropdownHeight }}>
                <div role="presentation">{noOptionsMessage ?? "No options"}</div>
            </div>
        );
    }

    if (!enableVirtualization) {
        return (
            <div id={listboxId} role="listbox" ref={scrollRef} style={{ maxHeight: maxDropdownHeight, overflowY: "auto" }}>
                {items.map((item) => renderItem(item))}
            </div>
        );
    }

    const virtualItems = virtualizer.getVirtualItems();

    return (
        <div
            id={listboxId}
            role="listbox"
            ref={scrollRef}
            style={{ maxHeight: maxDropdownHeight, overflowY: "auto", position: "relative" }}
        >
            <div style={{ height: virtualizer.getTotalSize(), position: "relative" }}>
                {virtualItems.map((virtualItem) =>
                    renderItem(items[virtualItem.index], {
                        position: "absolute",
                        top: 0,
                        left: 0,
                        width: "100%",
                        height: virtualItem.size,
                        transform: `translateY(${virtualItem.start}px)`,
                    }),
                )}
            </div>
        </div>
    );
}
