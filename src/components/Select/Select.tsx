/*
 * ============================================================================
 * Select
 * ============================================================================
 *
 * One configurable select for everything from a plain single-choice dropdown
 * to a searchable, checkbox-driven, pill-tagged, virtualized, creatable
 * multi-select — headless like the rest of this toolkit's components:
 * structure and behavior only, styling entirely via `classNames` (one key
 * per slot) and `[data-selected]`/`[data-active]`/`[data-disabled]`
 * attributes on the rendered options.
 *
 * `variant="native"` renders a real <select> instead (see NativeSelect.tsx's
 * header) — every prop below except options/value/onChange/placeholder/
 * disabled/required/clearable/id/name is ignored in that mode.
 *
 * Usage — plain single select:
 *
 * <Select
 *   options={[{ value: 'us', label: 'United States' }, { value: 'in', label: 'India' }]}
 *   value={country}
 *   onChange={setCountry}
 * />
 *
 *
 * Multi-select, pills + checkboxes, searchable:
 *
 * <Select
 *   multiple
 *   searchable
 *   options={tagOptions}
 *   value={tags}
 *   onChange={setTags}
 * />
 *
 *
 * Multi-select, "N selected" summary instead of pills, no checkboxes:
 *
 * <Select
 *   multiple
 *   showSelectedAsPills={false}
 *   showCheckboxes={false}
 *   options={options}
 *   value={value}
 *   onChange={setValue}
 * />
 *
 *
 * Grouped options:
 *
 * const options = [
 *   { value: 'apple', label: 'Apple', group: 'Fruit' },
 *   { value: 'carrot', label: 'Carrot', group: 'Vegetable' },
 * ]
 *
 *
 * Async/remote search — you own fetching, the component just calls onSearch:
 *
 * <Select
 *   searchable
 *   isLoading={isFetching}
 *   options={results}
 *   onSearch={(query) => fetchUsers(query).then(setResults)}
 *   value={userId}
 *   onChange={setUserId}
 * />
 *
 *
 * Creatable — let the user add an option that isn't in the list:
 *
 * <Select
 *   searchable
 *   enableCreatable
 *   options={options}
 *   onCreateOption={(text) => {
 *     const id = crypto.randomUUID()
 *     setOptions((prev) => [...prev, { value: id, label: text }])
 *     return id
 *   }}
 *   value={value}
 *   onChange={setValue}
 * />
 *
 *
 * Thousands of options — virtualize the dropdown:
 *
 * <Select options={hugeOptionList} enableVirtualization value={value} onChange={setValue} />
 *
 *
 * Native (real <select>, no JS-driven dropdown):
 *
 * <Select variant="native" options={options} value={value} onChange={setValue} />
 *
 * ============================================================================
 */

import CustomSelect from "./CustomSelect";
import NativeSelect from "./NativeSelect";
import type { SelectProps, SelectValue } from "./Select.types";

export default function Select<TValue extends SelectValue = string, Multiple extends boolean = false>(
    props: SelectProps<TValue, Multiple>,
) {
    if (props.variant === "native") {
        return <NativeSelect {...props} />;
    }
    return <CustomSelect {...props} />;
}
