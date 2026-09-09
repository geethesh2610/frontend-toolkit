import { forwardRef, type CSSProperties, type HTMLAttributes } from 'react'

type FlexProps = HTMLAttributes<HTMLDivElement> & {
    direction?: CSSProperties['flexDirection']
    align?: CSSProperties['alignItems']
    justify?: CSSProperties['justifyContent']
    wrap?: CSSProperties['flexWrap']
    gap?: CSSProperties['gap']
    rowGap?: CSSProperties['rowGap']
    columnGap?: CSSProperties['columnGap']
    grow?: CSSProperties['flexGrow']
    shrink?: CSSProperties['flexShrink']
    basis?: CSSProperties['flexBasis']
}

const Flex = forwardRef<HTMLDivElement, FlexProps>(
    (
        {
            direction = 'row',
            align,
            justify,
            wrap,
            gap,
            rowGap,
            columnGap,
            grow,
            shrink,
            basis,
            style,
            ...props
        },
        ref
    ) => {
        return (
            <div
                ref={ref}
                style={{
                    display: 'flex',
                    flexDirection: direction,
                    alignItems: align,
                    justifyContent: justify,
                    flexWrap: wrap,
                    gap,
                    rowGap,
                    columnGap,
                    flexGrow: grow,
                    flexShrink: shrink,
                    flexBasis: basis,
                    ...style,
                }}
                {...props}
            />
        )
    }
)

Flex.displayName = 'Flex'

export default Flex