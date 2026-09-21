/**
 * AxiosExampleSection
 * ----------------------------------------------------------------------------
 * REFERENCE ONLY — a runnable demo of axios.example.ts wired into three of
 * this toolkit's pieces:
 *
 *   DataTable (src/components/DataTable/)  → lists the fetched users
 *   Select (src/components/Select/)        → filters them by department
 *   debugger (src/debugger/)               → logs load success/failure
 *   styled-components (this file's .style.tsx) → all of the visuals below
 *
 * Mounted from App.tsx — run `npm run dev` and look for the
 * "axios.ts + zod + DataTable + Select + debugger" section.
 * ----------------------------------------------------------------------------
 */

import { useEffect, useMemo, useState } from 'react'

import DataTable from '../components/DataTable/DataTable'
import { createDataTableColumnHelper } from '../components/DataTable/features'
import Select from '../components/Select/Select'
import { errors, logger } from '../debugger'

import {
    fetchDummyUsers,
    getDepartmentOptions,
    groupUsersByDepartment,
    type DummyUser,
} from '../api/axios.example'
import { TableWrapper, dataTableClassNames } from '../styled-components/StyledDataTable/StyledDataTable.style'
import { SelectWrapper, selectClassNames } from '../styled-components/StyledSelect/StyledSelect.style'

import {
    Avatar,
    ErrorBanner,
    FilterBar,
    FilterField,
    Heading,
    Label,
    ResultCount,
    Section,
} from './AxiosExampleSection.style'

const helper = createDataTableColumnHelper<DummyUser>()

const columns = helper.columns([
    helper.display({
        id: 'avatar',
        header: '',
        size: 48,
        cell: (info) => <Avatar src={info.row.original.image} alt="" width={32} height={32} />,
    }),
    helper.accessor((row) => `${row.firstName} ${row.lastName}`, {
        id: 'name',
        header: 'Name',
        size: 180,
        meta: { filterVariant: 'text' },
    }),
    helper.accessor('email', { header: 'Email', size: 220 }),
    helper.accessor('age', {
        header: 'Age',
        size: 80,
        meta: { filterVariant: 'number', align: 'right' },
    }),
    helper.accessor('gender', { header: 'Gender', size: 100 }),
    helper.accessor('phone', { header: 'Phone', size: 160 }),
    helper.accessor((row) => row.company.department, {
        id: 'department',
        header: 'Department',
        size: 160,
    }),
])

export function AxiosExampleSection() {
    const [users, setUsers] = useState<DummyUser[]>([])
    const [isLoading, setIsLoading] = useState(true)
    const [errorMessage, setErrorMessage] = useState<string | null>(null)
    const [department, setDepartment] = useState<string | null>(null)

    useEffect(() => {
        let cancelled = false

        fetchDummyUsers({ limit: 50 })
            .then((data) => {
                if (cancelled) return
                setUsers(data)
                logger.info('AxiosExampleSection loaded users', { count: data.length })
            })
            .catch((error: unknown) => {
                if (cancelled) return
                setErrorMessage(errors.message(error))
            })
            .finally(() => {
                if (!cancelled) setIsLoading(false)
            })

        // Fetch runs once on mount — this cleanup just guards against
        // setting state after the component (or a Strict Mode double-mount)
        // has already unmounted.
        return () => {
            cancelled = true
        }
    }, [])

    const departmentOptions = useMemo(() => getDepartmentOptions(users), [users])

    const filteredUsers = useMemo(() => {
        if (!department) return users
        const grouped = groupUsersByDepartment(users)
        return grouped[department] ?? []
    }, [users, department])

    return (
        <Section>
            <Heading>axios.ts + zod + DataTable + Select + debugger — https://dummyjson.com/users</Heading>

            <FilterBar>
                <FilterField>
                    <Label>Filter by department</Label>
                    <SelectWrapper>
                        <Select
                            options={departmentOptions}
                            value={department}
                            onChange={setDepartment}
                            placeholder="All departments"
                            isLoading={isLoading}
                            classNames={selectClassNames}
                        />
                    </SelectWrapper>
                </FilterField>

                <ResultCount>
                    {filteredUsers.length} of {users.length} user{users.length === 1 ? '' : 's'}
                </ResultCount>
            </FilterBar>

            {errorMessage && <ErrorBanner>Failed to load users: {errorMessage}</ErrorBanner>}

            <TableWrapper>
                <DataTable
                    columns={columns}
                    data={filteredUsers}
                    getRowId={(row) => String(row.id)}
                    isLoading={isLoading}
                    enableColumnFilters
                    enableGlobalFilter
                    classNames={dataTableClassNames}
                />
            </TableWrapper>
        </Section>
    )
}

export default AxiosExampleSection
