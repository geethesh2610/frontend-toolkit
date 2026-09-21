/**
 * StyledSelect styles
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Select (src/components/Select/) is headless the same way DataTable is —
 *   styled purely through the class names in its `classNames` prop. This
 *   file is the one place that styles it, the same pattern as
 *   StyledDataTable: `SelectWrapper` targets `selectClassNames`'s values via
 *   nested selectors (auto-scoped under the wrapper's generated class).
 *
 * USAGE
 *   import Select from '@/components/Select/Select'
 *   import { SelectWrapper, selectClassNames } from '@/styled-components/StyledSelect/StyledSelect.style'
 *
 *   <SelectWrapper>
 *     <Select options={options} value={value} onChange={setValue} classNames={selectClassNames} />
 *   </SelectWrapper>
 * ----------------------------------------------------------------------------
 */

import styled from 'styled-components'

import type { SelectClassNames } from '../../components/Select/Select.types'

export const selectClassNames: SelectClassNames = {
    trigger: 'styled-select-trigger',
    placeholder: 'styled-select-placeholder',
    valueSummary: 'styled-select-summary',
    pill: 'styled-select-pill',
    pillRemoveButton: 'styled-select-pill-remove',
    clearButton: 'styled-select-clear',
    chevron: 'styled-select-chevron',
    dropdown: 'styled-select-dropdown',
    searchInput: 'styled-select-search',
    groupHeading: 'styled-select-group',
    option: 'styled-select-option',
    createOption: 'styled-select-create',
    emptyState: 'styled-select-empty',
    loadingState: 'styled-select-empty',
}

export const SelectWrapper = styled.div`
    font-family: system-ui, sans-serif;
    font-size: 14px;

    .styled-select-trigger {
        display: flex;
        align-items: center;
        flex-wrap: wrap;
        gap: 4px;
        min-height: 36px;
        padding: 4px 10px;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        background: #ffffff;
        cursor: pointer;
    }

    .styled-select-placeholder {
        color: #94a3b8;
    }

    .styled-select-summary {
        color: #0f172a;
    }

    .styled-select-pill {
        display: inline-flex;
        align-items: center;
        gap: 4px;
        background: #eef2ff;
        border-radius: 999px;
        padding: 2px 6px 2px 10px;
        font-size: 12px;
    }

    .styled-select-pill-remove,
    .styled-select-clear,
    .styled-select-chevron {
        border: none;
        background: none;
        cursor: pointer;
        color: #64748b;
        font-size: 12px;
        line-height: 1;
    }

    .styled-select-search {
        border: none;
        outline: none;
        flex: 1;
        min-width: 60px;
        font: inherit;
    }

    .styled-select-dropdown {
        background: #ffffff;
        border: 1px solid #cbd5e1;
        border-radius: 6px;
        margin-top: 4px;
        box-shadow: 0 4px 12px rgba(15, 23, 42, 0.08);
        overflow: hidden;
    }

    .styled-select-option {
        padding: 8px 10px;
        cursor: pointer;
        display: flex;
        align-items: center;
        gap: 8px;
    }

    .styled-select-option[data-active] {
        background: #eef2ff;
    }

    .styled-select-option[data-selected] {
        font-weight: 600;
    }

    .styled-select-option[data-disabled] {
        color: #94a3b8;
        cursor: not-allowed;
    }

    .styled-select-group {
        padding: 6px 10px 2px;
        font-size: 11px;
        text-transform: uppercase;
        color: #94a3b8;
    }

    .styled-select-create {
        padding: 8px 10px;
        cursor: pointer;
        font-style: italic;
        color: #2563eb;
    }

    .styled-select-empty {
        padding: 8px 10px;
        color: #94a3b8;
    }
`
