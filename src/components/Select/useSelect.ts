/*
 * The headless brain of the custom Select: open state, selection, search
 * filtering, grouping, and keyboard navigation — all state and no markup.
 * CustomSelect.tsx is the only consumer; kept separate so the interaction
 * logic can be read/adjusted without wading through JSX.
 */

import { useCallback, useEffect, useMemo, useRef, useState, type KeyboardEvent } from "react";

import { KEYBOARD_KEYS } from "../../constants/keyboard";
import { useControllableState } from "../../react-hooks/useControllableState";
import { useDebounce } from "../../react-hooks/useDebounce";
import { useDisclosure } from "../../react-hooks/useDisclosure";

import type { SelectFlatItem, SelectOption, SelectValue, SelectValueFor } from "./Select.types";

export interface UseSelectParams<TValue extends SelectValue, Multiple extends boolean> {
    options: SelectOption<TValue>[];
    multiple?: Multiple;
    value?: SelectValueFor<TValue, Multiple>;
    defaultValue?: SelectValueFor<TValue, Multiple>;
    onChange?: (value: SelectValueFor<TValue, Multiple>) => void;
    disabled?: boolean;
    searchable?: boolean;
    filterOption?: (option: SelectOption<TValue>, query: string) => boolean;
    onSearch?: (query: string) => void;
    searchDebounceMs?: number;
    maxSelectedItems?: number;
    enableCreatable?: boolean;
    onCreateOption?: (inputValue: string) => TValue;
    createLabel?: (inputValue: string) => string;
    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;
}

function defaultFilterOption<TValue extends SelectValue>(
    option: SelectOption<TValue>,
    query: string,
): boolean {
    return option.label.toLowerCase().includes(query.toLowerCase());
}

/** Buckets options by `group` (first-appearance order) rather than scanning in place, so a group's options don't have to be contiguous in the input array. */
function buildFlatItems<TValue extends SelectValue>(
    options: SelectOption<TValue>[],
    canCreate: boolean,
    createLabelText: string,
): SelectFlatItem<TValue>[] {
    const ungrouped: SelectOption<TValue>[] = [];
    const groupOrder: string[] = [];
    const groups = new Map<string, SelectOption<TValue>[]>();

    for (const option of options) {
        if (option.group) {
            if (!groups.has(option.group)) {
                groups.set(option.group, []);
                groupOrder.push(option.group);
            }
            groups.get(option.group)!.push(option);
        } else {
            ungrouped.push(option);
        }
    }

    const items: SelectFlatItem<TValue>[] = ungrouped.map((option) => ({
        type: "option",
        key: `option:${option.value}`,
        option,
    }));

    for (const groupName of groupOrder) {
        items.push({ type: "group", key: `group:${groupName}`, label: groupName });
        for (const option of groups.get(groupName)!) {
            items.push({ type: "option", key: `option:${option.value}`, option });
        }
    }

    if (canCreate) {
        items.push({ type: "create", key: "__create__", label: createLabelText });
    }

    return items;
}

export function useSelect<TValue extends SelectValue, Multiple extends boolean = false>(
    params: UseSelectParams<TValue, Multiple>,
) {
    const {
        options,
        multiple = false as Multiple,
        value: valueProp,
        defaultValue,
        onChange,
        disabled = false,
        searchable = false,
        filterOption = defaultFilterOption,
        onSearch,
        searchDebounceMs = 250,
        maxSelectedItems,
        enableCreatable = false,
        onCreateOption,
        createLabel = (query: string) => `Create "${query}"`,
        open: openProp,
        defaultOpen = false,
        onOpenChange,
    } = params;

    const isRemote = Boolean(onSearch);
    const emptyValue = (multiple ? [] : null) as SelectValueFor<TValue, Multiple>;

    const [value, setValue] = useControllableState<SelectValueFor<TValue, Multiple>>({
        value: valueProp,
        defaultValue: defaultValue ?? emptyValue,
        onChange,
    });

    const {
        isOpen,
        open: openDropdown,
        close: closeDropdownRaw,
        toggle: toggleDropdown,
    } = useDisclosure({ open: openProp, defaultOpen, onOpenChange });

    const [searchQuery, setSearchQuery] = useState("");
    const debouncedQuery = useDebounce(searchQuery, searchDebounceMs);
    const [activeKey, setActiveKey] = useState<string | null>(null);

    // Search/active-option state resets whenever the dropdown closes —
    // done here, in the same handler that closes it, rather than in a
    // `useEffect` watching `isOpen` (which would set state synchronously
    // during an effect, triggering an extra render pass for no reason).
    const closeDropdown = useCallback(() => {
        closeDropdownRaw();
        setSearchQuery("");
        setActiveKey(null);
    }, [closeDropdownRaw]);

    // Fires once on mount too (query=""), which is usually what you want for
    // an async select — it preloads a default result set instead of showing
    // an empty dropdown until the user types.
    useEffect(() => {
        if (isRemote) {
            onSearch?.(debouncedQuery);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [debouncedQuery, isRemote]);

    const selectedValues = useMemo<TValue[]>(
        () => (multiple ? (value as TValue[]) : value == null ? [] : [value as TValue]),
        [multiple, value],
    );

    const selectedOptions = useMemo(
        () =>
            selectedValues
                .map((v) => options.find((option) => option.value === v))
                .filter((option): option is SelectOption<TValue> => option !== undefined),
        [selectedValues, options],
    );

    const isSelected = useCallback((v: TValue) => selectedValues.includes(v), [selectedValues]);

    const visibleOptions = useMemo(() => {
        if (isRemote || !searchable || !searchQuery.trim()) {
            return options;
        }
        return options.filter((option) => filterOption(option, searchQuery));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [options, isRemote, searchable, searchQuery]);

    const trimmedQuery = searchQuery.trim();
    const canCreate =
        enableCreatable &&
        searchable &&
        trimmedQuery !== "" &&
        !visibleOptions.some((option) => option.label.toLowerCase() === trimmedQuery.toLowerCase());

    const flatItems = useMemo<SelectFlatItem<TValue>[]>(
        () => buildFlatItems(visibleOptions, canCreate, createLabel(trimmedQuery)),
        [visibleOptions, canCreate, createLabel, trimmedQuery],
    );

    const selectableItems = useMemo(() => flatItems.filter((item) => item.type !== "group"), [flatItems]);

    const maxReached =
        multiple && maxSelectedItems !== undefined && selectedValues.length >= maxSelectedItems;

    const commitValue = useCallback(
        (next: TValue[] | TValue | null) => {
            setValue(next as SelectValueFor<TValue, Multiple>);
        },
        [setValue],
    );

    const selectOption = useCallback(
        (option: SelectOption<TValue>) => {
            if (option.disabled) return;

            if (multiple) {
                const already = selectedValues.includes(option.value);
                if (already) {
                    commitValue(selectedValues.filter((v) => v !== option.value));
                } else if (!maxReached) {
                    commitValue([...selectedValues, option.value]);
                }
            } else {
                commitValue(option.value);
                closeDropdown();
            }
        },
        [multiple, selectedValues, maxReached, commitValue, closeDropdown],
    );

    const removeValue = useCallback(
        (v: TValue) => {
            commitValue(multiple ? selectedValues.filter((item) => item !== v) : null);
        },
        [multiple, selectedValues, commitValue],
    );

    const clearAll = useCallback(() => {
        commitValue(multiple ? [] : null);
    }, [multiple, commitValue]);

    const handleCreate = useCallback(() => {
        if (!canCreate || !onCreateOption) return;
        const newValue = onCreateOption(trimmedQuery);

        if (multiple) {
            if (!maxReached) {
                commitValue([...selectedValues, newValue]);
            }
        } else {
            commitValue(newValue);
            closeDropdown();
        }
        setSearchQuery("");
    }, [canCreate, onCreateOption, trimmedQuery, multiple, maxReached, selectedValues, commitValue, closeDropdown]);

    const activateItem = useCallback(
        (key: string) => {
            const item = selectableItems.find((i) => i.key === key);
            if (!item) return;
            if (item.type === "option") {
                selectOption(item.option);
            } else if (item.type === "create") {
                handleCreate();
            }
        },
        [selectableItems, selectOption, handleCreate],
    );

    const moveActive = useCallback(
        (direction: 1 | -1) => {
            if (selectableItems.length === 0) return;
            const currentIndex = selectableItems.findIndex((item) => item.key === activeKey);
            let nextIndex = currentIndex + direction;
            if (nextIndex < 0) nextIndex = selectableItems.length - 1;
            if (nextIndex >= selectableItems.length) nextIndex = 0;
            setActiveKey(selectableItems[nextIndex].key);
        },
        [selectableItems, activeKey],
    );

    // Typeahead buffer for the non-searchable custom variant — mirrors a
    // native <select>, where typing letters jumps to the first match.
    const typeaheadRef = useRef({ buffer: "", timeoutId: 0 as ReturnType<typeof setTimeout> | 0 });

    const handleTypeahead = useCallback(
        (char: string) => {
            const state = typeaheadRef.current;
            clearTimeout(state.timeoutId);
            state.buffer += char.toLowerCase();
            state.timeoutId = setTimeout(() => {
                state.buffer = "";
            }, 500);

            const match = selectableItems.find(
                (item) => item.type === "option" && item.option.label.toLowerCase().startsWith(state.buffer),
            );
            if (match) {
                setActiveKey(match.key);
            }
        },
        [selectableItems],
    );

    const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
            if (disabled) return;

            switch (event.key) {
                case KEYBOARD_KEYS.ARROW_DOWN:
                    event.preventDefault();
                    if (!isOpen) {
                        openDropdown();
                        setActiveKey(selectableItems[0]?.key ?? null);
                    } else {
                        moveActive(1);
                    }
                    return;

                case KEYBOARD_KEYS.ARROW_UP:
                    event.preventDefault();
                    if (!isOpen) {
                        openDropdown();
                        setActiveKey(selectableItems[selectableItems.length - 1]?.key ?? null);
                    } else {
                        moveActive(-1);
                    }
                    return;

                case KEYBOARD_KEYS.HOME:
                    if (isOpen) {
                        event.preventDefault();
                        setActiveKey(selectableItems[0]?.key ?? null);
                    }
                    return;

                case KEYBOARD_KEYS.END:
                    if (isOpen) {
                        event.preventDefault();
                        setActiveKey(selectableItems[selectableItems.length - 1]?.key ?? null);
                    }
                    return;

                case KEYBOARD_KEYS.SPACE:
                    if (searchable) return; // let the search input type a space
                    event.preventDefault();
                    if (!isOpen) {
                        openDropdown();
                        return;
                    }
                    if (activeKey) activateItem(activeKey);
                    return;

                case KEYBOARD_KEYS.ENTER:
                    event.preventDefault();
                    if (!isOpen) {
                        openDropdown();
                        return;
                    }
                    if (activeKey) activateItem(activeKey);
                    return;

                case KEYBOARD_KEYS.ESCAPE:
                    if (isOpen) {
                        event.preventDefault();
                        closeDropdown();
                    }
                    return;

                case KEYBOARD_KEYS.TAB:
                    closeDropdown();
                    return;

                default:
                    if (!searchable && event.key.length === 1 && !event.altKey && !event.ctrlKey && !event.metaKey) {
                        if (!isOpen) openDropdown();
                        handleTypeahead(event.key);
                    }
            }
        },
        [
            disabled,
            isOpen,
            openDropdown,
            closeDropdown,
            moveActive,
            selectableItems,
            activeKey,
            activateItem,
            searchable,
            handleTypeahead,
        ],
    );

    return {
        isOpen,
        openDropdown,
        closeDropdown,
        toggleDropdown,
        searchQuery,
        setSearchQuery,
        activeKey,
        setActiveKey,
        flatItems,
        selectableItems,
        selectedValues,
        selectedOptions,
        isSelected,
        selectOption,
        removeValue,
        clearAll,
        handleCreate,
        canCreate,
        handleKeyDown,
        maxReached,
        isRemote,
    };
}
