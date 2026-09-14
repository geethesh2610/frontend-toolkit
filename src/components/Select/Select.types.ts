import type { CSSProperties, ReactNode } from "react";

export type SelectValue = string | number;

export interface SelectOption<TValue extends SelectValue = string> {
    value: TValue;
    label: string;
    disabled?: boolean;
    /** Options sharing a `group` render under a heading, in order of first appearance. */
    group?: string;
}

/** `null` = nothing selected. Never `undefined` — makes "no selection" one unambiguous value. */
export type SelectSingleValue<TValue extends SelectValue> = TValue | null;
export type SelectMultiValue<TValue extends SelectValue> = TValue[];

/** The dropdown flattened to one list — group headers included as non-selectable entries — so keyboard navigation and virtualization share a single index space. */
export type SelectFlatItem<TValue extends SelectValue> =
    | { type: "group"; key: string; label: string }
    | { type: "option"; key: string; option: SelectOption<TValue> }
    | { type: "create"; key: string; label: string };

export type SelectValueFor<
    TValue extends SelectValue,
    Multiple extends boolean,
> = Multiple extends true ? SelectMultiValue<TValue> : SelectSingleValue<TValue>;

export interface SelectClassNames {
    root?: string;
    trigger?: string;
    placeholder?: string;
    valueSummary?: string;
    pill?: string;
    pillRemoveButton?: string;
    clearButton?: string;
    chevron?: string;
    dropdown?: string;
    searchInput?: string;
    groupHeading?: string;
    option?: string;
    optionCheckbox?: string;
    optionLabel?: string;
    createOption?: string;
    emptyState?: string;
    loadingState?: string;
}

export interface SelectProps<TValue extends SelectValue = string, Multiple extends boolean = false> {
    options: SelectOption<TValue>[];
    multiple?: Multiple;

    value?: SelectValueFor<TValue, Multiple>;
    defaultValue?: SelectValueFor<TValue, Multiple>;
    onChange?: (value: SelectValueFor<TValue, Multiple>) => void;

    /** `'custom'` (default): fully custom dropdown with every feature below. `'native'`: a real `<select>` — accessible and zero-JS-styling, but only `placeholder`/`disabled`/grouping apply. */
    variant?: "custom" | "native";

    placeholder?: string;
    disabled?: boolean;
    required?: boolean;
    /** Shows a button to reset the selection to empty. Default `true`. */
    clearable?: boolean;

    /* ---------------------------------------------------------------- */
    /* Search (custom variant only)                                     */
    /* ---------------------------------------------------------------- */
    searchable?: boolean;
    searchPlaceholder?: string;
    /** Default: case-insensitive substring match against `label`. Ignored once `onSearch` is set. */
    filterOption?: (option: SelectOption<TValue>, query: string) => boolean;
    /** Presence switches to "remote" mode: the component stops filtering locally and calls this (debounced) instead — filter `options` yourself and pass the result back in. */
    onSearch?: (query: string) => void;
    searchDebounceMs?: number;
    isLoading?: boolean;

    /* ---------------------------------------------------------------- */
    /* Multi-select presentation (custom variant only)                  */
    /* ---------------------------------------------------------------- */
    /** Render a checkbox next to each option. Default `true` when `multiple`. */
    showCheckboxes?: boolean;
    /** Render selected values as removable pills inside the trigger, instead of a "N selected" summary. Default `true` when `multiple`. */
    showSelectedAsPills?: boolean;
    maxSelectedItems?: number;

    /* ---------------------------------------------------------------- */
    /* Creatable (custom variant only)                                  */
    /* ---------------------------------------------------------------- */
    enableCreatable?: boolean;
    /** Required when `enableCreatable` — you own id/value generation, the component just selects whatever you return. */
    onCreateOption?: (inputValue: string) => TValue;
    createLabel?: (inputValue: string) => string;

    /* ---------------------------------------------------------------- */
    /* Virtualization (custom variant only)                             */
    /* ---------------------------------------------------------------- */
    enableVirtualization?: boolean;
    optionHeight?: number;
    maxDropdownHeight?: number;

    /* ---------------------------------------------------------------- */
    /* Misc                                                             */
    /* ---------------------------------------------------------------- */
    noOptionsMessage?: ReactNode;
    renderOption?: (option: SelectOption<TValue>, state: { selected: boolean; active: boolean }) => ReactNode;

    open?: boolean;
    defaultOpen?: boolean;
    onOpenChange?: (open: boolean) => void;

    id?: string;
    /** Renders hidden native `<input>`(s) so the value participates in native form submission. */
    name?: string;

    classNames?: SelectClassNames;
    className?: string;
    style?: CSSProperties;
}
