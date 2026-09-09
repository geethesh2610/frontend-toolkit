/*
 * ============================================================================
 * Accordion
 * ============================================================================
 *
 * Usage:
 *
 * <Accordion type="single" collapsible>
 *   <AccordionItem value="section-1">
 *     <AccordionTrigger>
 *       Section 1
 *     </AccordionTrigger>
 *
 *     <AccordionContent>
 *       Your content here...
 *     </AccordionContent>
 *   </AccordionItem>
 *
 *   <AccordionItem value="section-2">
 *     <AccordionTrigger>
 *       Section 2
 *     </AccordionTrigger>
 *
 *     <AccordionContent>
 *       Your content here...
 *     </AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 *
 *
 * Multiple items open:
 *
 * <Accordion type="multiple">
 *   ...
 * </Accordion>
 *
 *
 * Custom icon:
 *
 * <AccordionTrigger
 *   icon={({ open }) => (
 *     open ? <OpenIcon /> : <ClosedIcon />
 *   )}
 * >
 *   Section
 * </AccordionTrigger>
 *
 *
 * Icon position:
 *
 * <AccordionTrigger iconPosition="left">
 *   Section
 * </AccordionTrigger>
 *
 *
 * Styling:
 *
 * The Accordion is intentionally generic.
 * Use className/style on Accordion, AccordionItem,
 * AccordionTrigger and AccordionContent for feature-specific designs.
 *
 * Example:
 *
 * <Accordion className="consent-accordion">
 *   <AccordionItem
 *     value="details"
 *     className="consent-accordion__item"
 *   >
 *     <AccordionTrigger
 *       className="consent-accordion__trigger"
 *     >
 *       Consent Details
 *     </AccordionTrigger>
 *
 *     <AccordionContent
 *       className="consent-accordion__content"
 *     >
 *       ...
 *     </AccordionContent>
 *   </AccordionItem>
 * </Accordion>
 *
 * ============================================================================
 */

import {
    createContext,
    useContext,
    useEffect,
    useId,
    useRef,
    useState,
    type CSSProperties,
    type HTMLAttributes,
    type ReactNode,
} from 'react'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

type AccordionType = 'single' | 'multiple'

type AccordionContextValue = {
    type: AccordionType
    openItems: string[]
    toggleItem: (value: string) => void
}

type AccordionItemContextValue = {
    value: string
    open: boolean
    triggerId: string
    contentId: string
}

/* -------------------------------------------------------------------------- */
/* Context                                                                    */
/* -------------------------------------------------------------------------- */

const AccordionContext =
    createContext<AccordionContextValue | null>(null)

const AccordionItemContext =
    createContext<AccordionItemContextValue | null>(null)

/* -------------------------------------------------------------------------- */
/* Context Hooks                                                              */
/* -------------------------------------------------------------------------- */

function useAccordionContext() {
    const context = useContext(AccordionContext)

    if (!context) {
        throw new Error(
            'Accordion components must be used inside <Accordion>.',
        )
    }

    return context
}

function useAccordionItemContext() {
    const context = useContext(AccordionItemContext)

    if (!context) {
        throw new Error(
            'AccordionTrigger and AccordionContent must be used inside <AccordionItem>.',
        )
    }

    return context
}

/* -------------------------------------------------------------------------- */
/* Accordion                                                                   */
/* -------------------------------------------------------------------------- */

export type AccordionProps = {
    /**
     * "single"   -> only one item can be open at a time.
     * "multiple" -> multiple items can be open at the same time.
     */
    type?: AccordionType

    /**
     * Initial open item(s) for uncontrolled usage.
     */
    defaultValue?: string | string[]

    /**
     * Controlled open item(s).
     */
    value?: string | string[]

    /**
     * Called whenever the open value changes.
     */
    onValueChange?: (value: string | string[]) => void

    /**
     * Only relevant when type="single".
     *
     * true  -> currently open item can be closed.
     * false -> one item must remain open.
     */
    collapsible?: boolean

    children: ReactNode

    /**
     * Used only for styling.
     */
    className?: string

    /**
     * Used only for styling.
     */
    style?: CSSProperties
}

export function Accordion({
    type = 'single',
    defaultValue,
    value,
    onValueChange,
    collapsible = true,
    children,
    className,
    style,
}: AccordionProps) {
    const getInitialValue = (): string[] => {
        if (defaultValue === undefined) {
            return []
        }

        return Array.isArray(defaultValue)
            ? defaultValue
            : [defaultValue]
    }

    const [internalValue, setInternalValue] = useState<string[]>(
        getInitialValue,
    )

    const openItems =
        value !== undefined
            ? Array.isArray(value)
                ? value
                : [value]
            : internalValue

    const toggleItem = (itemValue: string) => {
        const isOpen = openItems.includes(itemValue)

        let nextValue: string[]

        if (type === 'single') {
            if (isOpen) {
                if (!collapsible) {
                    return
                }

                nextValue = []
            } else {
                nextValue = [itemValue]
            }
        } else {
            nextValue = isOpen
                ? openItems.filter((item) => item !== itemValue)
                : [...openItems, itemValue]
        }

        if (value === undefined) {
            setInternalValue(nextValue)
        }

        onValueChange?.(
            type === 'single'
                ? nextValue[0] ?? ''
                : nextValue,
        )
    }

    return (
        <AccordionContext.Provider
            value={{
                type,
                openItems,
                toggleItem,
            }}
        >
            <div
                className={className}
                style={style}
            >
                {children}
            </div>
        </AccordionContext.Provider>
    )
}

/* -------------------------------------------------------------------------- */
/* Accordion Item                                                              */
/* -------------------------------------------------------------------------- */

export type AccordionItemProps = {
    /**
     * Unique value identifying this accordion item.
     */
    value: string

    children: ReactNode

    /**
     * Used only for styling.
     */
    className?: string

    /**
     * Used only for styling.
     */
    style?: CSSProperties
}

export function AccordionItem({
    value,
    children,
    className,
    style,
}: AccordionItemProps) {
    const { openItems } = useAccordionContext()

    const open = openItems.includes(value)

    const id = useId()

    const triggerId = `${id}-trigger`
    const contentId = `${id}-content`

    return (
        <AccordionItemContext.Provider
            value={{
                value,
                open,
                triggerId,
                contentId,
            }}
        >
            <div
                data-state={open ? 'open' : 'closed'}
                className={className}
                style={style}
            >
                {children}
            </div>
        </AccordionItemContext.Provider>
    )
}

/* -------------------------------------------------------------------------- */
/* Accordion Trigger                                                           */
/* -------------------------------------------------------------------------- */

export type AccordionIconRenderProps = {
    open: boolean
}

export type AccordionTriggerProps = Omit<
    HTMLAttributes<HTMLButtonElement>,
    'children'
> & {
    children: ReactNode

    /**
     * Custom icon.
     *
     * Can be a normal ReactNode:
     *
     * icon={<MyIcon />}
     *
     * Or a function which receives the current open state:
     *
     * icon={({ open }) => (
     *   open ? <OpenIcon /> : <ClosedIcon />
     * )}
     *
     * If omitted, the default animated chevron is used.
     */
    icon?:
    | ReactNode
    | ((props: AccordionIconRenderProps) => ReactNode)

    /**
     * Position of the icon relative to the trigger content.
     */
    iconPosition?: 'left' | 'right'
}

export function AccordionTrigger({
    children,
    icon,
    iconPosition = 'right',
    className,
    style,
    onClick,
    ...props
}: AccordionTriggerProps) {
    const { toggleItem } = useAccordionContext()

    const {
        value,
        open,
        triggerId,
        contentId,
    } = useAccordionItemContext()

    /*
     * Default icon.
     *
     * This is intentionally generic. If the actual design requires
     * a different icon or animation, it can be changed here or
     * overridden through the "icon" prop.
     */
    const defaultIcon = (
        <span
            aria-hidden="true"
            style={{
                display: 'inline-flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition:
                    'transform 250ms cubic-bezier(0.4, 0, 0.2, 1)',
                transform: open
                    ? 'rotate(180deg)'
                    : 'rotate(0deg)',
            }}
        >
            <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
            >
                <path d="m6 9 6 6 6-6" />
            </svg>
        </span>
    )

    const renderedIcon =
        typeof icon === 'function'
            ? icon({ open })
            : icon ?? defaultIcon

    return (
        <button
            {...props}
            id={triggerId}
            type="button"
            aria-expanded={open}
            aria-controls={contentId}
            data-state={open ? 'open' : 'closed'}
            className={className}
            onClick={(event) => {
                onClick?.(event)

                if (!event.defaultPrevented) {
                    toggleItem(value)
                }
            }}
            style={style}
        >
            {iconPosition === 'left' && renderedIcon}

            <span>
                {children}
            </span>

            {iconPosition === 'right' && renderedIcon}
        </button>
    )
}

/* -------------------------------------------------------------------------- */
/* Accordion Content                                                           */
/* -------------------------------------------------------------------------- */

export type AccordionContentProps = {
    children: ReactNode

    /**
     * Used only for styling.
     */
    className?: string

    /**
     * Used only for styling.
     */
    style?: CSSProperties
}

export function AccordionContent({
    children,
    className,
    style,
}: AccordionContentProps) {
    const {
        open,
        triggerId,
        contentId,
    } = useAccordionItemContext()

    const contentRef = useRef<HTMLDivElement>(null)

    const [height, setHeight] = useState(0)

    /*
     * Calculate the content height whenever the accordion
     * opens/closes or the content itself changes.
     */
    useEffect(() => {
        const element = contentRef.current

        if (!element) {
            return
        }

        setHeight(
            open
                ? element.scrollHeight
                : 0,
        )
    }, [open, children])

    /*
     * Keep the height correct if the content changes size
     * after rendering.
     */
    useEffect(() => {
        const element = contentRef.current

        if (!element) {
            return
        }

        const observer = new ResizeObserver(() => {
            if (open) {
                setHeight(element.scrollHeight)
            }
        })

        observer.observe(element)

        return () => {
            observer.disconnect()
        }
    }, [open])

    return (
        <div
            id={contentId}
            role="region"
            aria-labelledby={triggerId}
            data-state={open ? 'open' : 'closed'}
            className={className}
            style={{
                display: 'grid',
                gridTemplateRows: open
                    ? `${height}px`
                    : '0px',
                transition:
                    'grid-template-rows 300ms cubic-bezier(0.4, 0, 0.2, 1)',
                ...style,
            }}
        >
            <div
                ref={contentRef}
                style={{
                    minHeight: 0,
                    overflow: 'hidden',
                }}
            >
                {children}
            </div>
        </div>
    )
}

/* -------------------------------------------------------------------------- */
/* Default Export                                                             */
/* -------------------------------------------------------------------------- */

export default Accordion