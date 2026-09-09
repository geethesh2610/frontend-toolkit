import type { ReactNode } from 'react'

export interface ShowProps {
    when: boolean
    children: ReactNode
    fallback?: ReactNode
}

const Show = ({ when, children, fallback = null }: ShowProps) => {
    return when ? children : fallback
}

Show.displayName = 'Show'

export default Show