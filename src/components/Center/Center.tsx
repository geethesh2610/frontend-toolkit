import type { CSSProperties, ReactNode } from 'react'

export interface CenterProps {
    children: ReactNode
    className?: string
    style?: CSSProperties
}

const Center = ({
    children,
    className,
    style,
}: CenterProps) => {
    return (
        <div
            className={className}
            style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                ...style,
            }}
        >
            {children}
        </div>
    )
}

Center.displayName = 'Center'

export default Center