import React from "react";

type StackDirection = "row" | "column";
type StackAlign = "start" | "center" | "end" | "stretch" | "baseline";
type StackJustify =
    | "start"
    | "center"
    | "end"
    | "between"
    | "around"
    | "evenly";

export interface StackProps
    extends React.HTMLAttributes<HTMLElement> {
    children: React.ReactNode;

    direction?: StackDirection;
    gap?: string | number;

    align?: StackAlign;
    justify?: StackJustify;

    wrap?: boolean;

    padding?: string | number;
    width?: string | number;

    as?: React.ElementType;
}

const alignMap: Record<StackAlign, React.CSSProperties["alignItems"]> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    stretch: "stretch",
    baseline: "baseline",
};

const justifyMap: Record<
    StackJustify,
    React.CSSProperties["justifyContent"]
> = {
    start: "flex-start",
    center: "center",
    end: "flex-end",
    between: "space-between",
    around: "space-around",
    evenly: "space-evenly",
};

const Stack = React.forwardRef<HTMLElement, StackProps>(
    (
        {
            children,
            direction = "column",
            gap,
            align = "stretch",
            justify = "start",
            wrap = false,
            padding,
            width,
            as: Component = "div",
            style,
            ...rest
        },
        ref
    ) => {
        const stackStyle: React.CSSProperties = {
            display: "flex",
            flexDirection: direction,
            gap,
            alignItems: alignMap[align],
            justifyContent: justifyMap[justify],
            flexWrap: wrap ? "wrap" : "nowrap",
            padding,
            width,
            ...style,
        };

        return (
            <Component
                ref={ref}
                style={stackStyle}
                {...rest}
            >
                {children}
            </Component>
        );
    }
);

Stack.displayName = "Stack";

export default Stack;