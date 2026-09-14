/*
 * The fully custom-rendered variant: a combobox trigger (button, or an
 * editable input when `searchable`) plus a listbox dropdown. All state and
 * interaction logic lives in useSelect — this file is rendering + wiring
 * only, plus the one bit of layout logic hand-rolled positioning needs: a
 * one-time "is there more room above or below" measurement taken each time
 * the dropdown opens (no continuous repositioning, no portal — the dropdown
 * can get clipped inside an `overflow: hidden` ancestor, which is the
 * accepted tradeoff of not pulling in a floating-ui-style dependency).
 */

import { useEffect, useId, useLayoutEffect, useRef, useState } from "react";

import { useClickOutside } from "../../react-hooks/useClickOutside";
import { useEscapeKey } from "../../react-hooks/useEscapeKey";

import { sanitizeId } from "./sanitizeId";
import SelectOptionList from "./SelectOptionList";
import { useSelect } from "./useSelect";
import type { SelectProps, SelectValue } from "./Select.types";

export default function CustomSelect<TValue extends SelectValue, Multiple extends boolean = false>(
    props: SelectProps<TValue, Multiple>,
) {
    const {
        options,
        multiple = false as Multiple,
        value,
        defaultValue,
        onChange,
        placeholder = "Select…",
        disabled = false,
        required,
        clearable = true,

        searchable = false,
        searchPlaceholder = "Search…",
        filterOption,
        onSearch,
        searchDebounceMs,
        isLoading,

        showCheckboxes = multiple,
        showSelectedAsPills = multiple,
        maxSelectedItems,

        enableCreatable = false,
        onCreateOption,
        createLabel,

        enableVirtualization = false,
        optionHeight = 36,
        maxDropdownHeight = 280,

        noOptionsMessage,
        renderOption,

        open,
        defaultOpen,
        onOpenChange,

        id,
        name,

        classNames,
        className,
        style,
    } = props;

    const {
        isOpen,
        openDropdown,
        closeDropdown,
        searchQuery,
        setSearchQuery,
        activeKey,
        setActiveKey,
        flatItems,
        selectedValues,
        selectedOptions,
        isSelected,
        selectOption,
        removeValue,
        clearAll,
        handleCreate,
        handleKeyDown,
    } = useSelect<TValue, Multiple>({
        options,
        multiple,
        value,
        defaultValue,
        onChange,
        disabled,
        searchable,
        filterOption,
        onSearch,
        searchDebounceMs,
        maxSelectedItems,
        enableCreatable,
        onCreateOption,
        createLabel,
        open,
        defaultOpen,
        onOpenChange,
    });

    const generatedId = useId();
    const controlId = id ?? generatedId;
    const listboxId = `${controlId}-listbox`;

    const rootRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const [placement, setPlacement] = useState<"top" | "bottom">("bottom");

    useClickOutside(rootRef, closeDropdown, { enabled: isOpen });
    useEscapeKey(closeDropdown, { enabled: isOpen });

    // One-time flip decision per open — see file header.
    useLayoutEffect(() => {
        if (!isOpen || !rootRef.current) return;
        const rect = rootRef.current.getBoundingClientRect();
        const spaceBelow = window.innerHeight - rect.bottom;
        const spaceAbove = rect.top;
        setPlacement(spaceBelow < maxDropdownHeight && spaceAbove > spaceBelow ? "top" : "bottom");
    }, [isOpen, maxDropdownHeight]);

    useEffect(() => {
        if (isOpen && searchable) {
            inputRef.current?.focus();
        }
    }, [isOpen, searchable]);

    // Keep the active option scrolled into view as it changes via keyboard.
    useEffect(() => {
        if (!isOpen || !activeKey) return;
        const element = document.getElementById(`${listboxId}-${sanitizeId(activeKey)}`);
        element?.scrollIntoView({ block: "nearest" });
    }, [isOpen, activeKey, listboxId]);

    const hasValue = selectedValues.length > 0;
    const activeDescendant = activeKey ? `${listboxId}-${sanitizeId(activeKey)}` : undefined;

    // Shared ARIA combobox attributes. `disabled` is intentionally NOT here —
    // it's a real DOM attribute only on <input>/<button> (added explicitly
    // where those render below); a plain <div> only gets `aria-disabled`.
    const comboboxAriaProps = {
        role: "combobox" as const,
        "aria-expanded": isOpen,
        "aria-haspopup": "listbox" as const,
        "aria-controls": listboxId,
        "aria-activedescendant": activeDescendant,
        "aria-autocomplete": searchable ? ("list" as const) : ("none" as const),
        "aria-disabled": disabled || undefined,
        "aria-required": required || undefined,
        onKeyDown: handleKeyDown,
    };

    return (
        <div ref={rootRef} id={controlId} className={classNames?.root ?? className} style={{ position: "relative", ...style }}>
            <div
                className={classNames?.trigger}
                // A multi-select's trigger holds per-pill remove buttons the
                // user must be able to click — an absolutely-positioned
                // full-cover overlay button (used below for the
                // single-select case) would sit on top of them and swallow
                // those clicks. Instead, the trigger <div> itself becomes
                // the focusable combobox control in that case.
                {...(multiple && !searchable ? { ...comboboxAriaProps, tabIndex: disabled ? -1 : 0 } : null)}
                onClick={() => !disabled && !searchable && (isOpen ? closeDropdown() : openDropdown())}
            >
                {multiple && showSelectedAsPills && (
                    <>
                        {selectedOptions.map((option) => (
                            <span key={option.value} className={classNames?.pill}>
                                {option.label}
                                <button
                                    type="button"
                                    className={classNames?.pillRemoveButton}
                                    aria-label={`Remove ${option.label}`}
                                    onClick={(event) => {
                                        event.stopPropagation();
                                        removeValue(option.value);
                                    }}
                                >
                                    ×
                                </button>
                            </span>
                        ))}
                    </>
                )}

                {multiple && !showSelectedAsPills && hasValue && (
                    <span className={classNames?.valueSummary}>
                        {selectedOptions.length === 1
                            ? selectedOptions[0].label
                            : `${selectedOptions.length} selected`}
                    </span>
                )}

                {!multiple && !searchable && (
                    <span className={hasValue ? classNames?.valueSummary : classNames?.placeholder}>
                        {selectedOptions[0]?.label ?? placeholder}
                    </span>
                )}

                {searchable ? (
                    <input
                        {...comboboxAriaProps}
                        disabled={disabled}
                        ref={inputRef}
                        type="text"
                        className={classNames?.searchInput}
                        placeholder={searchPlaceholder}
                        value={
                            multiple
                                ? searchQuery
                                : isOpen
                                    ? searchQuery
                                    : (selectedOptions[0]?.label ?? "")
                        }
                        onFocus={() => {
                            if (!disabled) {
                                openDropdown();
                                if (!multiple) setSearchQuery("");
                            }
                        }}
                        onChange={(event) => setSearchQuery(event.target.value)}
                    />
                ) : (
                    !multiple && (
                        <button
                            type="button"
                            {...comboboxAriaProps}
                            disabled={disabled}
                            style={{ position: "absolute", inset: 0, opacity: 0 }}
                            aria-label={placeholder}
                        />
                    )
                )}

                {clearable && hasValue && !disabled && (
                    <button
                        type="button"
                        className={classNames?.clearButton}
                        aria-label="Clear selection"
                        onClick={(event) => {
                            event.stopPropagation();
                            clearAll();
                        }}
                    >
                        ×
                    </button>
                )}

                <span className={classNames?.chevron} aria-hidden="true">
                    {isOpen ? "▲" : "▼"}
                </span>
            </div>

            {isOpen && (
                <div
                    className={classNames?.dropdown}
                    style={{
                        position: "absolute",
                        left: 0,
                        right: 0,
                        zIndex: 20,
                        ...(placement === "bottom" ? { top: "100%" } : { bottom: "100%" }),
                    }}
                >
                    <SelectOptionList
                        listboxId={listboxId}
                        items={flatItems}
                        activeKey={activeKey}
                        isSelected={isSelected}
                        onHover={setActiveKey}
                        onSelect={selectOption}
                        onCreate={handleCreate}
                        multiple={multiple}
                        showCheckboxes={showCheckboxes}
                        renderOption={renderOption}
                        enableVirtualization={enableVirtualization}
                        optionHeight={optionHeight}
                        maxDropdownHeight={maxDropdownHeight}
                        isLoading={isLoading}
                        noOptionsMessage={noOptionsMessage}
                        classNames={classNames}
                    />
                </div>
            )}

            {name &&
                (multiple ? (
                    selectedValues.map((v) => <input key={v} type="hidden" name={name} value={v} />)
                ) : (
                    <input type="hidden" name={name} value={selectedValues[0] ?? ""} />
                ))}
        </div>
    );
}
