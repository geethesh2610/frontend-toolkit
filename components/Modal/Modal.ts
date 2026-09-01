import {
    useEffect,
    useRef,
    type CSSProperties,
    type MouseEvent,
    type ReactNode,
} from 'react'
import { createPortal } from 'react-dom'

export type ModalProps = {
    open: boolean
    onClose: () => void
    children: ReactNode

    width?: CSSProperties['width']
    maxWidth?: CSSProperties['maxWidth']
    height?: CSSProperties['height']
    maxHeight?: CSSProperties['maxHeight']

    closeOnOverlayClick?: boolean
    closeOnEscape?: boolean

    className?: string
    style?: CSSProperties
}

export default function Modal({
    open,
    onClose,
    children,
    width = 'auto',
    maxWidth,
    height = 'auto',
    maxHeight = 'calc(100vh - 32px)',
    closeOnOverlayClick = true,
    closeOnEscape = true,
    className,
    style,
}: ModalProps) {
    const contentRef = useRef<HTMLDivElement>(null)
    const previousActiveElement = useRef<HTMLElement | null>(null)

    useEffect(() => {
        if (!open) return

        previousActiveElement.current =
            document.activeElement instanceof HTMLElement
                ? document.activeElement
                : null

        const handleKeyDown = (event: KeyboardEvent) => {
            if (closeOnEscape && event.key === 'Escape') {
                event.preventDefault()
                onClose()
            }
        }

        document.addEventListener('keydown', handleKeyDown)

        const previousOverflow = document.body.style.overflow
        document.body.style.overflow = 'hidden'

        requestAnimationFrame(() => {
            contentRef.current?.focus()
        })

        return () => {
            document.removeEventListener('keydown', handleKeyDown)
            document.body.style.overflow = previousOverflow

            previousActiveElement.current?.focus()
        }
    }, [open, closeOnEscape, onClose])

    if (!open) return null

    const handleOverlayClick = (event: MouseEvent<HTMLDivElement>) => {
        if (
            closeOnOverlayClick &&
            event.target === event.currentTarget
        ) {
            onClose()
        }
    }

    return createPortal(
        <div
        role="presentation"
        onMouseDown = { handleOverlayClick }
        style = {{
        position: 'fixed',
        inset: 0,
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16,
        background: 'rgba(0, 0, 0, 0.5)',
    }}
      >
    <div
          ref={ contentRef }
role = "dialog"
aria - modal="true"
tabIndex = {- 1}
className = { className }
style = {{
    width,
        maxWidth,
        height,
        maxHeight,
        overflow: 'auto',
            outline: 'none',
            ...style,
          }}
        >
    { children }
    </div>
    </div>,
document.body,
    )
  }