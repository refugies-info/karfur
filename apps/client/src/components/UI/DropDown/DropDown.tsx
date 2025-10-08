import { Slot } from "@radix-ui/react-slot";
import React, {
  createContext,
  CSSProperties,
  forwardRef,
  memo,
  ReactNode,
  useCallback,
  useContext,
  useEffect,
  useId,
  useImperativeHandle,
  useMemo,
  useRef,
  useState,
} from "react";
import { cls } from "~/lib/classname";
import styles from "./DropDown.module.scss";

// Context for managing dropdown state
type DropdownContextValue = {
  isOpen: boolean;
  setIsOpen: (value: boolean) => void;
  triggerId: string;
  contentId: string;
};

const DropdownContext = createContext<DropdownContextValue | null>(null);

// Root component
type DropdownRootProps = {
  children: ReactNode;
  defaultOpen?: boolean;
  onOpenChange?: (open: boolean) => void;
  className?: string;
};

export const DropdownRoot = memo(
  forwardRef(({ children, defaultOpen = false, onOpenChange, className }: DropdownRootProps, ref) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const id = useId();
    const triggerId = `${id}-trigger`;
    const contentId = `${id}-content`;
    const rootRef = useRef<HTMLDivElement>(null);

    const handleOpenChange = useCallback(
      (newIsOpen: boolean) => {
        setIsOpen(newIsOpen);
        onOpenChange?.(newIsOpen);
      },
      [onOpenChange],
    );

    useImperativeHandle(ref, () => ({
      toggleDropdown: () => setIsOpen((prev) => !prev),
      closeDropdown: () => setIsOpen(false),
      openDropdown: () => setIsOpen(true),
    }));

    const handleKeyEvents = useCallback(
      (event: KeyboardEvent) => {
        if (!rootRef.current) return;

        if (event.key === "Escape") {
          handleOpenChange(false);
          return;
        }

        if (event.key === "Tab") {
          const focusableElements = rootRef.current.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );

          if (focusableElements.length === 0) return;

          const firstFocusable = focusableElements[0];
          const lastFocusable = focusableElements[focusableElements.length - 1];
          const activeElement = document.activeElement;

          if (
            (activeElement === lastFocusable && !event.shiftKey) ||
            (activeElement === firstFocusable && event.shiftKey)
          ) {
            handleOpenChange(false);
          }
        }
      },
      [handleOpenChange, rootRef],
    );

    const handleClickOutside = useCallback(
      (event: MouseEvent) => {
        const target = event.target as Node;
        if (!target || !(target instanceof Node)) return;

        if (rootRef.current && !rootRef.current.contains(target)) {
          handleOpenChange(false);
        }
      },
      [handleOpenChange, rootRef],
    );

    useEffect(() => {
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
        document.addEventListener("keydown", handleKeyEvents);
      }

      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("keydown", handleKeyEvents);
      };
    }, [isOpen, handleClickOutside, handleKeyEvents]);

    const contextValue = useMemo(
      () => ({
        isOpen,
        setIsOpen: handleOpenChange,
        triggerId,
        contentId,
      }),
      [isOpen, handleOpenChange, triggerId, contentId],
    );

    return (
      <DropdownContext.Provider value={contextValue}>
        <div ref={rootRef} className={cls(styles.dropdownRoot, className)}>
          {children}
        </div>
      </DropdownContext.Provider>
    );
  }),
);

DropdownRoot.displayName = "DropdownRoot";

// Trigger component
type DropdownTriggerProps = {
  children: ReactNode;
  asChild?: boolean;
};

export const DropdownTrigger = memo(
  forwardRef<HTMLButtonElement, DropdownTriggerProps>(({ children, asChild, ...props }, ref) => {
    const context = useContext(DropdownContext);
    if (!context) throw new Error("DropdownTrigger must be used within DropdownRoot");
    const { isOpen, setIsOpen, triggerId, contentId } = context;

    const handleClick = useCallback(() => {
      setIsOpen(!isOpen);
    }, [isOpen, setIsOpen]);

    const handleKeyDown = useCallback(
      (event: React.KeyboardEvent<HTMLButtonElement>) => {
        switch (event.key) {
          case "ArrowDown":
            if (!isOpen) {
              event.preventDefault();
              setIsOpen(true);
            }
            break;
          case "ArrowUp":
            if (isOpen) {
              event.preventDefault();
              setIsOpen(false);
            }
            break;
          case "Enter":
          case " ": // Space key
            event.preventDefault();
            setIsOpen(!isOpen);
            break;
        }
      },
      [isOpen, setIsOpen],
    );

    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        type="button"
        id={triggerId}
        aria-haspopup="true"
        aria-expanded={isOpen}
        aria-controls={contentId}
        data-triggerdropdown
        onClick={handleClick}
        onKeyDown={handleKeyDown}
        {...props}
      >
        {children}
      </Comp>
    );
  }),
);

DropdownTrigger.displayName = "DropdownTrigger";

// Content component
type DropdownContentProps = {
  children: ReactNode;
  asChild?: boolean;
  className?: string;
  style?: CSSProperties;
  autoFocusFirst?: boolean;
  position?: "center" | "start" | "end";
};

export const DropdownContent = memo(
  forwardRef<HTMLDivElement | null, DropdownContentProps>(
    ({ children, asChild, className, style, autoFocusFirst = true, position = "start", ...props }, ref) => {
      const context = useContext(DropdownContext);
      if (!context) throw new Error("DropdownContent must be used within DropdownRoot");
      const { isOpen, contentId, triggerId } = context;
      const isFirstRender = useRef(true);

      const defaultRef = useRef<HTMLDivElement | null>(null);
      const combinedRef = ref || defaultRef;

      useEffect(() => {
        if (!isOpen || !autoFocusFirst || !isFirstRender.current) return;

        const currentRef = typeof combinedRef === "function" ? null : combinedRef?.current;
        if (currentRef) {
          const focusableElements = currentRef.querySelectorAll<HTMLElement>(
            'a[href], button, input, select, textarea, [tabindex]:not([tabindex="-1"])',
          );
          if (focusableElements.length > 0) {
            focusableElements[0].focus();
          }
        }
        isFirstRender.current = false;
      }, [isOpen, autoFocusFirst, combinedRef]);

      const Component = asChild ? Slot : "div";

      if (!isOpen) {
        isFirstRender.current = true;
        return null;
      }

      return (
        <Component
          ref={combinedRef}
          role="menu"
          id={contentId}
          aria-labelledby={triggerId}
          className={cls(styles.content, styles[position], className)}
          style={style}
          {...props}
        >
          {children}
        </Component>
      );
    },
  ),
);

DropdownContent.displayName = "DropdownContent";
