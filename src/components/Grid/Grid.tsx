import React from "react";

type GridProps = React.HTMLAttributes<HTMLElement> & {
    children: React.ReactNode;

    columns?: number | string;
    rows?: number | string;

    gap?: string | number;
    columnGap?: string | number;
    rowGap?: string | number;

    align?: React.CSSProperties["alignItems"];
    justify?: React.CSSProperties["justifyContent"];

    width?: string | number;

    as?: React.ElementType;
};

const Grid = React.forwardRef<HTMLElement, GridProps>(
    (
        {
            children,
            columns,
            rows,
            gap,
            columnGap,
            rowGap,
            align,
            justify,
            width,
            as: Component = "div",
            style,
            ...rest
        },
        ref
    ) => {
        const gridStyle: React.CSSProperties = {
            display: "grid",
            gridTemplateColumns:
                typeof columns === "number"
                    ? `repeat(${columns}, minmax(0, 1fr))`
                    : columns,

            gridTemplateRows:
                typeof rows === "number"
                    ? `repeat(${rows}, minmax(0, 1fr))`
                    : rows,
            gap,
            columnGap,
            rowGap,

            alignItems: align,
            justifyContent: justify,

            width,

            ...style,
        };

        return (
            <Component ref={ref} style={gridStyle} {...rest}>
                {children}
            </Component>
        );
    }
);

Grid.displayName = "Grid";

export default Grid;