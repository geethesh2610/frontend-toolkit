/*
 * Layout/styling for App.tsx's kitchen-sink demo page. Replaces the old
 * inline <style> block — every section below is a bordered SectionCard so
 * each demo is visually separated from the next.
 */

import styled from 'styled-components'

export const PageWrapper = styled.div`
    display: flex;
    flex-direction: column;
    gap: 24px;
    padding: 24px;
    max-width: 1200px;
    margin: 0 auto;
    font-family: system-ui, sans-serif;
    color: #0f172a;
`

export const SectionCard = styled.section`
    border: 1px solid #e2e8f0;
    border-radius: 12px;
    background: #ffffff;
    padding: 20px;
`

export const SectionTitle = styled.h2`
    margin: 0 0 4px;
    font-size: 16px;
    font-weight: 600;
`

export const SectionMeta = styled.p`
    margin: 0 0 12px;
    color: #64748b;
    font-size: 13px;
`

export const SelectGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
    gap: 20px;
`

export const SelectField = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

export const FieldLabel = styled.label`
    font-weight: 600;
    font-size: 12px;
    color: #475569;
`

export const ButtonVariantRows = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`

export const ButtonVariantRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`

export const VariantLabel = styled.span`
    width: 80px;
    text-transform: capitalize;
    color: #475569;
    font-size: 13px;
`

export const StateGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
    gap: 20px;
`

export const StateCard = styled.div`
    border: 1px solid #e2e8f0;
    border-radius: 8px;
    padding: 12px;
`

export const StateCardTitle = styled.h3`
    margin: 0 0 8px;
    font-size: 13px;
    font-weight: 600;
    color: #334155;
`
