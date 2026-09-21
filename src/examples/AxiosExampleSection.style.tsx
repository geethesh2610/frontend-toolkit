/**
 * AxiosExampleSection styles (styled-components)
 * ----------------------------------------------------------------------------
 * PURPOSE
 *   Visual styling specific to AxiosExampleSection.tsx (the heading, filter
 *   bar, error banner, avatar). Split out the same way
 *   src/styled-components/Button/ splits Button.tsx from Button.style.tsx.
 *
 *   Table and Select styling is NOT duplicated here — this section reuses
 *   the shared `TableWrapper`/`dataTableClassNames` and
 *   `SelectWrapper`/`selectClassNames` from
 *   src/styled-components/StyledDataTable/ and .../StyledSelect/, the same
 *   ones App.tsx's other DataTable/Select demos use, so every table and
 *   select in the app looks consistent.
 * ----------------------------------------------------------------------------
 */

import styled from 'styled-components'

export const Section = styled.section`
    font-family: system-ui, sans-serif;
    font-size: 14px;
    color: #0f172a;
`

export const Heading = styled.h2`
    font-size: 16px;
    font-weight: 600;
    margin: 0 0 16px;
`

export const FilterBar = styled.div`
    display: flex;
    align-items: flex-end;
    flex-wrap: wrap;
    gap: 12px;
    margin-bottom: 16px;
`

export const FilterField = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 240px;
`

export const Label = styled.label`
    font-weight: 600;
    font-size: 12px;
    color: #475569;
`

export const ResultCount = styled.span`
    color: #64748b;
    font-size: 12px;
    padding-bottom: 8px;
`

export const ErrorBanner = styled.p`
    background: #fef2f2;
    border: 1px solid #fecaca;
    color: #b91c1c;
    padding: 8px 12px;
    border-radius: 6px;
    margin: 0 0 16px;
`

export const Avatar = styled.img`
    display: block;
    border-radius: 50%;
    object-fit: cover;
`
