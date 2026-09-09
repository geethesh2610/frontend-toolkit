/*
 * ============================================================================
 * Modal
 * ============================================================================
 *
 * Usage:
 *
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 * >
 *   Your modal content here...
 * </Modal>
 *
 *
 * With size:
 *
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   width="600px"
 *   maxWidth="90vw"
 *   height="400px"
 * >
 *   ...
 * </Modal>
 *
 *
 * Disable closing when clicking outside:
 *
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   closeOnOverlayClick={false}
 * >
 *   ...
 * </Modal>
 *
 *
 * Disable closing with Escape:
 *
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   closeOnEscape={false}
 * >
 *   ...
 * </Modal>
 *
 *
 * Feature-specific styling:
 *
 * The Modal handles generic modal behavior only.
 * The actual visual design should be controlled by the consumer
 * using className, style, and children.
 *
 * Example:
 *
 * <Modal
 *   open={isOpen}
 *   onClose={() => setIsOpen(false)}
 *   className="consent-modal"
 * >
 *   <ConsentForm />
 * </Modal>
 *
 *
 * The Modal provides:
 *
 * - Portal rendering
 * - Overlay
 * - Outside click handling
 * - Escape key handling
 * - Body scroll locking
 * - Focus trapping
 * - Focus restoration
 * - Configurable width/height
 * - Configurable max-width/max-height
 *
 * Reusable hooks:
 *
 * - useEscapeKey
 * - useClickOutside
 * - useFocusTrap
 *
 * ============================================================================
 */

import {
	useEffect,
	useRef,
	type CSSProperties,
	type ReactNode,
} from 'react'

import { createPortal } from 'react-dom'

import { useClickOutside } from '../../react-hooks/useClickOutside'
import { useEscapeKey } from '../../react-hooks/useEscapeKey'
import { useFocusTrap } from '../../react-hooks/useFocusTrap'

/* -------------------------------------------------------------------------- */
/* Types                                                                      */
/* -------------------------------------------------------------------------- */

export type ModalProps = {
	open: boolean

	onClose: () => void

	children: ReactNode

	/**
	 * Modal dimensions.
	 */
	width?: CSSProperties['width']
	maxWidth?: CSSProperties['maxWidth']
	height?: CSSProperties['height']
	maxHeight?: CSSProperties['maxHeight']

	/**
	 * Controls how the modal can be dismissed.
	 */
	closeOnOverlayClick?: boolean
	closeOnEscape?: boolean

	/**
	 * Used for feature-specific styling.
	 */
	className?: string
	style?: CSSProperties
}

/* -------------------------------------------------------------------------- */
/* Modal                                                                      */
/* -------------------------------------------------------------------------- */

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

	/* ---------------------------------------------------------------------- */
	/* Escape key                                                              */
	/* ---------------------------------------------------------------------- */

	useEscapeKey(
		() => {
			onClose()
		},
		{
			enabled: open && closeOnEscape,
		},
	)

	/* ---------------------------------------------------------------------- */
	/* Outside click                                                           */
	/* ---------------------------------------------------------------------- */

	useClickOutside(
		contentRef,
		() => {
			onClose()
		},
		{
			enabled: open && closeOnOverlayClick,
		},
	)

	/* ---------------------------------------------------------------------- */
	/* Focus trap                                                              */
	/* ---------------------------------------------------------------------- */

	useFocusTrap(contentRef, {
		enabled: open,
		restoreFocus: true,
		preventScroll: true,
	})

	/* ---------------------------------------------------------------------- */
	/* Body scroll lock                                                        */
	/* ---------------------------------------------------------------------- */

	useEffect(() => {
		if (!open) {
			return
		}

		const previousOverflow =
			document.body.style.overflow

		document.body.style.overflow = 'hidden'

		return () => {
			document.body.style.overflow =
				previousOverflow
		}
	}, [open])

	/* ---------------------------------------------------------------------- */
	/* Closed                                                                  */
	/* ---------------------------------------------------------------------- */

	if (!open) {
		return null
	}

	/* ---------------------------------------------------------------------- */
	/* Render                                                                  */
	/* ---------------------------------------------------------------------- */

	return createPortal(
		<div
			role="presentation"
			style={{
				position: 'fixed',
				inset: 0,
				zIndex: 1000,

				display: 'flex',
				alignItems: 'center',
				justifyContent: 'center',

				padding: 16,

				background:
					'rgba(0, 0, 0, 0.5)',
			}}
		>
			<div
				ref={contentRef}
				role="dialog"
				aria-modal="true"
				aria-label="Dialog"
				style={{
					width,
					maxWidth,
					height,
					maxHeight,

					overflow: 'auto',
					outline: 'none',

					...style,
				}}
				className={className}
			>
				{children}
			</div>
		</div>,
		document.body,
	)
}