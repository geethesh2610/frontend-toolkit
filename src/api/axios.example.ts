/**
 * axios.example
 * ----------------------------------------------------------------------------
 * REFERENCE ONLY — shows how the pieces of this toolkit fit together:
 *
 *   axios.ts (api)        → the shared HTTP client
 *   zod                   → validating what the API actually returned
 *   utils/array/groupBy   → turning a flat list into buckets (for the UI)
 *   utils/array/uniqueBy  → deriving filter options from the data itself
 *   debugger (index.ts)   → timing, logging, and normalizing the request
 *
 * DATA SOURCE
 *   https://dummyjson.com/users — a free, public dummy API. No auth needed.
 *
 *   The URL passed to `api.get()` below is absolute (starts with
 *   `https://`), so it bypasses whatever `baseURL` axios.ts resolved from
 *   env vars — that keeps this example working regardless of how (or
 *   whether) VITE_API_BASE_URL/NEXT_PUBLIC_API_BASE_URL is set in this
 *   project. In a real app you'd normally call `api.get('/users')` and let
 *   `baseURL` do this for you.
 * ----------------------------------------------------------------------------
 */

import { z } from 'zod'

import { api } from './axios'
import { errors, logger, start } from '../debugger'
import { groupBy } from '../utils/array/groupBy'
import { uniqueBy } from '../utils/array/uniqueBy'
import type { SelectOption } from '../components/Select/Select.types'

/* -------------------------------------------------------------------------- */
/* Shape of the data we actually use                                         */
/* -------------------------------------------------------------------------- */

/**
 * dummyjson's user objects have ~30 fields (address, bank, crypto, ...).
 * We only declare the ones this example uses — zod silently strips
 * everything else, so there's no need to model the entire API response.
 */
const dummyUserSchema = z.object({
    id: z.number(),
    firstName: z.string(),
    lastName: z.string(),
    email: z.string(),
    age: z.number(),
    gender: z.string(),
    phone: z.string(),
    image: z.string(),
    company: z.object({
        name: z.string(),
        department: z.string(),
        title: z.string(),
    }),
})

const dummyUsersResponseSchema = z.object({
    users: z.array(dummyUserSchema),
    total: z.number(),
    skip: z.number(),
    limit: z.number(),
})

export type DummyUser = z.infer<typeof dummyUserSchema>

/* -------------------------------------------------------------------------- */
/* Fetch                                                                     */
/* -------------------------------------------------------------------------- */

export interface FetchDummyUsersOptions {
    limit?: number
    skip?: number
}

/**
 * Fetches, validates, and returns dummyjson users.
 *
 * If the API ever changes shape, `dummyUsersResponseSchema.parse()` throws
 * instead of letting `undefined`/wrong-typed values silently leak into the
 * UI — that's the whole point of validating at the network boundary rather
 * than trusting axios's `response.data: any`.
 */
export async function fetchDummyUsers(
    options: FetchDummyUsersOptions = {}
): Promise<DummyUser[]> {
    const { limit = Infinity, skip = 0 } = options

    const timer = start('fetchDummyUsers')
    logger.debug('Fetching dummy users', { limit, skip })

    try {
        const response = await api.get('https://dummyjson.com/users', {
            params: { limit, skip },
        })

        const parsed = dummyUsersResponseSchema.parse(response.data)

        logger.info(`Fetched ${parsed.users.length} dummy users`, {
            total: parsed.total,
        })

        return parsed.users
    } catch (error) {
        // Normalizes + console.errors an Axios error, a zod error, or
        // anything else that could land in a catch block — see
        // src/debugger/errors.ts for what `normalize`/`log` do with each.
        errors.log(error, 'axios.example.fetchDummyUsers')
        throw errors.toError(error)
    } finally {
        timer.end()
    }
}

/* -------------------------------------------------------------------------- */
/* Derived data (utils/array)                                                */
/* -------------------------------------------------------------------------- */

/** Buckets users by department — e.g. for a grouped list or a summary count. */
export function groupUsersByDepartment(users: DummyUser[]): Record<string, DummyUser[]> {
    return groupBy(users, (user) => user.company.department)
}

/** Builds `<Select>` options from whatever departments are actually present in the data. */
export function getDepartmentOptions(users: DummyUser[]): SelectOption<string>[] {
    return uniqueBy(users, (user) => user.company.department)
        .map((user) => ({ value: user.company.department, label: user.company.department }))
        .sort((a, b) => a.label.localeCompare(b.label))
}
