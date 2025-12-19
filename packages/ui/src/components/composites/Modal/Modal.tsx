/**
 * @fileoverview Accessible Modal Component - Built on Radix UI Dialog
 *
 * A reusable, accessible modal component that follows WCAG 2.1 guidelines and
 * French government design system (DSFR) standards.
 *
 * **Key Features:**
 * - ✅ WCAG 2.1 AA compliant
 * - ✅ Automatic focus management (focus trap, return focus)
 * - ✅ Keyboard navigation (ESC to close, Tab navigation)
 * - ✅ Screen reader friendly (ARIA attributes)
 * - ✅ Customizable trigger element
 * - ✅ Flexible content composition
 *
 * @example
 * ```tsx
 * import { Modal } from "@refugies-info/ui";
 *
 * function MyComponent() {
 *   const [open, setOpen] = useState(false);
 *   const triggerRef = useRef<HTMLButtonElement>(null);
 *
 *   return (
 *     <>
 *       <button ref={triggerRef} onClick={() => setOpen(true)}>
 *         Open Modal
 *       </button>
 *
 *       <Modal
 *         open={open}
 *         onOpenChange={setOpen}
 *         triggerRef={triggerRef}
 *         title="My Modal Title"
 *         description="Optional description for screen readers"
 *       >
 *         <p>Modal content goes here</p>
 *         <button onClick={() => setOpen(false)}>Close</button>
 *       </Modal>
 *     </>
 *   );
 * }
 * ```
 *
 * @module Modal
 */

import Button from "@codegouvfr/react-dsfr/Button";
import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode, RefObject } from "react";

/**
 * Props for the Modal component
 */
export interface ModalProps {
  /**
   * Controls whether the modal is open or closed
   */
  open: boolean;

  /**
   * Callback when the open state changes (user closes modal via ESC, overlay click, or close button)
   */
  onOpenChange: (open: boolean) => void;

  /**
   * Modal title (required for accessibility)
   */
  title: string;

  /**
   * Optional description for screen readers
   * If provided, will be announced along with the title
   */
  description?: string;

  /**
   * Modal content
   */
  children: ReactNode;

  /**
   * Optional ref to the trigger element
   * Focus will return to this element when modal closes
   */
  triggerRef?: RefObject<HTMLElement | null>;

  /**
   * Optional callback fired when modal opens and focus is set
   */
  onOpenAutoFocus?: (event: Event) => void;

  /**
   * Optional callback fired when modal closes and focus returns
   */
  onCloseAutoFocus?: (event: Event) => void;

  /**
   * Optional custom close button label
   * @default "Fermer" (French for "Close")
   */
  closeLabel?: string;

  /**
   * Hide the default close button
   * @default false
   */
  hideCloseButton?: boolean;

  /**
   * Additional CSS classes for the content container
   */
  className?: string;

  /**
   * Maximum width of the modal
   * @default "2xl" (672px)
   */
  maxWidth?: "sm" | "md" | "lg" | "xl" | "2xl" | "3xl" | "4xl" | "full";

  /**
   * Custom overlay className
   */
  overlayClassName?: string;
}

const maxWidthClasses = {
  "sm": "max-w-sm",
  "md": "max-w-md",
  "lg": "max-w-lg",
  "xl": "max-w-xl",
  "2xl": "max-w-2xl",
  "3xl": "max-w-3xl",
  "4xl": "max-w-4xl",
  "full": "max-w-full",
};

/**
 * Accessible Modal Component
 *
 * Built on Radix UI Dialog with automatic focus management and WCAG 2.1 compliance.
 *
 * @example
 * ```tsx
 * <Modal
 *   open={isOpen}
 *   onOpenChange={setIsOpen}
 *   triggerRef={buttonRef}
 *   title="Confirm Action"
 *   description="Are you sure you want to proceed?"
 * >
 *   <div className="space-y-4">
 *     <p>This action cannot be undone.</p>
 *     <div className="flex gap-2">
 *       <Button onClick={handleConfirm}>Confirm</Button>
 *       <Button onClick={() => setIsOpen(false)}>Cancel</Button>
 *     </div>
 *   </div>
 * </Modal>
 * ```
 */
export const Modal = ({
  open,
  onOpenChange,
  title,
  description,
  children,
  triggerRef,
  onOpenAutoFocus,
  onCloseAutoFocus,
  closeLabel = "Fermer",
  hideCloseButton = false,
  className = "",
  maxWidth = "2xl",
  overlayClassName = "",
}: ModalProps) => {
  const handleOpenAutoFocus = (event: Event) => {
    if (onOpenAutoFocus) {
      onOpenAutoFocus(event);
    } else {
      // Prevent default focus behavior (which focuses first focusable element)
      // Instead, focus the dialog container so screen readers
      // announce the title and description via aria-labelledby/aria-describedby
      event.preventDefault();
      const target = event.target as HTMLElement;
      target.focus();
    }
  };

  const handleCloseAutoFocus = (event: Event) => {
    event.preventDefault();
    // Return focus to trigger element if provided
    if (triggerRef?.current) {
      triggerRef.current.focus();
    }
    if (onCloseAutoFocus) {
      onCloseAutoFocus(event);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Overlay className={`fixed inset-0 z-[1000] bg-black/50 ${overlayClassName}`} aria-hidden="true" />
        <Dialog.Content
          className={`fixed top-1/2 left-1/2 z-[1001] flex ${maxWidthClasses[maxWidth]} -translate-x-1/2 -translate-y-1/2 flex-col bg-white p-8 pt-4 shadow-[0_2px_6px_0_rgb(0_0_18_/_16.1%)] focus:outline-none max-sm:w-[95vw] max-sm:max-w-[95vw] max-sm:p-6 ${className}`}
          aria-labelledby="modal-title"
          aria-describedby={description ? "modal-description" : undefined}
          onOpenAutoFocus={handleOpenAutoFocus}
          onCloseAutoFocus={handleCloseAutoFocus}
        >
          <div className="order-1 mb-6">
            <Dialog.Title id="modal-title" className="m-0 mb-6 text-2xl">
              {title}
            </Dialog.Title>
            {description && (
              <Dialog.Description id="modal-description" className="m-0 text-lg text-gray-700">
                {description}
              </Dialog.Description>
            )}
          </div>

          <div className="order-2 flex-1">{children}</div>

          {!hideCloseButton && (
            <Dialog.Close asChild>
              <Button
                iconId="fr-icon-close-line"
                priority="tertiary no outline"
                className="order-0 ml-auto translate-x-4 self-start"
                title={closeLabel}
                aria-label={closeLabel}
              >
                {closeLabel}
              </Button>
            </Dialog.Close>
          )}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
