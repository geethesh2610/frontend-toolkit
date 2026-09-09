import type {
    HTMLAttributes,
    ReactNode,
} from 'react'

import './ScrollArea.css'

// CSS variables can be overridden when calling the component:
// <ScrollArea
//     style={{
//         '--scrollbar-track': '#eee',
//         '--scrollbar-thumb': '#888',
//         '--scrollbar-thumb-hover': '#555',
//     } as React.CSSProperties}
// >
//     ...
// </ScrollArea>

export interface ScrollAreaProps
    extends HTMLAttributes<HTMLDivElement> {
    children: ReactNode
    orientation?: 'vertical' | 'horizontal' | 'both'
}

const ScrollArea = ({
    children,
    orientation = 'vertical',
    style,
    ...props
}: ScrollAreaProps) => {
    const overflow =
        orientation === 'both'
            ? 'auto'
            : orientation === 'horizontal'
                ? 'auto hidden'
                : 'hidden auto'

    return (
        <div
            {...props}
            style={{
                overflow,
                ...style,
            }}
        >
            {children}
        </div>
    )
}

ScrollArea.displayName = 'ScrollArea'

export default ScrollArea