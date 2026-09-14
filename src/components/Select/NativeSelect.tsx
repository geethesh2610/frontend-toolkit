/*
 * A real <select> — accessible and zero-JS-styling by default, works on
 * every device without any positioning/keyboard logic of our own (the
 * browser owns all of that). Trades away search, pills, checkboxes,
 * creatable, and virtualization for that simplicity; use `variant="custom"`
 * (the default) when you need those.
 */

import type { ChangeEvent } from "react";

import { useControllableState } from "../../react-hooks/useControllableState";

import type { SelectOption, SelectProps, SelectValue, SelectValueFor } from "./Select.types";

export default function NativeSelect<TValue extends SelectValue, Multiple extends boolean = false>({
    options,
    multiple = false as Multiple,
    value,
    defaultValue,
    onChange,
    placeholder = "Select…",
    disabled = false,
    required,
    clearable = true,
    id,
    name,
    classNames,
    className,
    style,
}: SelectProps<TValue, Multiple>) {
    const emptyValue = (multiple ? [] : null) as SelectValueFor<TValue, Multiple>;

    const [currentValue, setValue] = useControllableState<SelectValueFor<TValue, Multiple>>({
        value,
        defaultValue: defaultValue ?? emptyValue,
        onChange,
    });

    const selectedValues = multiple
        ? (currentValue as TValue[])
        : currentValue == null
            ? []
            : [currentValue as TValue];

    const findByRawValue = (raw: string): TValue | undefined =>
        options.find((option) => String(option.value) === raw)?.value;

    const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
        if (multiple) {
            const next = Array.from(event.target.selectedOptions)
                .map((option) => findByRawValue(option.value))
                .filter((v): v is TValue => v !== undefined);
            setValue(next as SelectValueFor<TValue, Multiple>);
        } else {
            const raw = event.target.value;
            setValue((raw === "" ? null : (findByRawValue(raw) ?? null)) as SelectValueFor<TValue, Multiple>);
        }
    };

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

    const renderOption = (option: SelectOption<TValue>) => (
        <option key={option.value} value={option.value} disabled={option.disabled}>
            {option.label}
        </option>
    );

    return (
        <div className={classNames?.root ?? className} style={style}>
            <select
                id={id}
                name={multiple ? undefined : name}
                multiple={multiple}
                disabled={disabled}
                required={required}
                value={multiple ? selectedValues.map(String) : (currentValue == null ? "" : String(currentValue))}
                onChange={handleChange}
                className={classNames?.trigger}
            >
                {!multiple && (
                    <option value="" disabled={required}>
                        {placeholder}
                    </option>
                )}
                {ungrouped.map(renderOption)}
                {groupOrder.map((groupName) => (
                    <optgroup key={groupName} label={groupName} className={classNames?.groupHeading}>
                        {groups.get(groupName)!.map(renderOption)}
                    </optgroup>
                ))}
            </select>

            {multiple &&
                name &&
                selectedValues.map((v) => <input key={v} type="hidden" name={name} value={v} />)}

            {clearable && selectedValues.length > 0 && !disabled && (
                <button
                    type="button"
                    className={classNames?.clearButton}
                    aria-label="Clear selection"
                    onClick={() => setValue(emptyValue)}
                >
                    ×
                </button>
            )}
        </div>
    );
}
