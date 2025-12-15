import { Slot } from "@radix-ui/react-slot";
import React, {
  createContext,
  forwardRef,
  type KeyboardEvent,
  memo,
  type ReactNode,
  useCallback,
  useContext,
  useImperativeHandle,
  useRef,
  useState,
} from "react";

type Orientation = "horizontal" | "vertical";

type AccessibleNavigationProps = React.HTMLAttributes<HTMLDivElement> & {
  children: ReactNode;
  orientation?: Orientation;
  onEscape?: () => void;
  onNavigateOut?: () => void;
  "aria-label"?: string; // Accessible name for the navigation
};

type AccessibleNavigationContextProps = {
  activeIndex: number;
  focusItem: (index: number) => void;
};

const AccessibleNavigationContext = createContext<AccessibleNavigationContextProps | undefined>(
  undefined,
);

const AccessibleNavigation = forwardRef<HTMLDivElement, AccessibleNavigationProps>(
  (
    {
      children,
      orientation = "vertical",
      className,
      onEscape,
      onNavigateOut,
      "aria-label": ariaLabel,
      role,
      ...props
    },
    ref,
  ) => {
    const navRef = useRef<HTMLDivElement | null>(null);
    const [activeIndex, setActiveIndex] = useState(0);
    const isPresentation = role === "presentation" || role === "none";

    // Here we can't use ref directly if we want the querySelector to work
    useImperativeHandle(ref, () => navRef.current as HTMLDivElement);

    const focusItem = useCallback((index: number) => {
      const items = navRef.current?.querySelectorAll<HTMLElement>("[data-nav-item]");
      if (items && items[index]) {
        items[index].focus();
        setActiveIndex(index);
      }
    }, []);

    const handleKeyDown = useCallback(
      (e: KeyboardEvent<HTMLDivElement>) => {
        const items = navRef.current?.querySelectorAll<HTMLElement>("[data-nav-item]");
        if (!items) return;

        const currentIndex = activeIndex;
        let nextIndex = currentIndex;

        switch (e.key) {
          case "ArrowDown":
            if (orientation === "vertical") {
              e.preventDefault();
              nextIndex = (currentIndex + 1) % items.length;
            }
            break;
          case "ArrowUp":
            if (orientation === "vertical") {
              e.preventDefault();
              nextIndex = (currentIndex - 1 + items.length) % items.length;
            }
            break;
          case "ArrowRight":
            if (orientation === "horizontal") {
              e.preventDefault();
              nextIndex = (currentIndex + 1) % items.length;
            }
            break;
          case "ArrowLeft":
            if (orientation === "horizontal") {
              e.preventDefault();
              nextIndex = (currentIndex - 1 + items.length) % items.length;
            }
            break;
          case "Escape":
            onEscape?.();
            break;
          case "Tab":
            onNavigateOut?.();
            break;
        }

        if (nextIndex !== currentIndex) {
          focusItem(nextIndex);
        }
      },
      [activeIndex, orientation, onEscape, onNavigateOut, focusItem],
    );

    const contextValue = React.useMemo(
      () => ({
        activeIndex,
        focusItem,
      }),
      [activeIndex, focusItem],
    );

    return (
      <AccessibleNavigationContext.Provider value={contextValue}>
        <div
          ref={navRef}
          role={role || "menubar"}
          aria-orientation={isPresentation ? undefined : orientation}
          aria-label={isPresentation ? undefined : ariaLabel}
          className={className}
          onKeyDown={handleKeyDown}
          {...props}
        >
          {children}
        </div>
      </AccessibleNavigationContext.Provider>
    );
  },
);
AccessibleNavigation.displayName = "AccessibleNavigation";

type AccessibleNavigationItemProps = {
  children: ReactNode;
  asChild?: boolean;
  "aria-current"?: "page" | "step" | "location" | "date" | boolean;
  className?: string;
};

const AccessibleNavigationItem = memo(
  forwardRef<HTMLDivElement, AccessibleNavigationItemProps>(
    ({ children, className, asChild = false, "aria-current": ariaCurrent, ...props }, ref) => {
      const context = useContext(AccessibleNavigationContext);
      if (!context) {
        throw new Error(
          "AccessibleNavigationItem must be used within an AccessibleNavigation component",
        );
      }

      const { focusItem } = context;
      const itemRef = useRef<HTMLDivElement>(null);

      useImperativeHandle(ref, () => itemRef.current as HTMLDivElement, []);

      const handleFocus = useCallback(() => {
        const index = Array.from(itemRef.current?.parentNode?.children || []).indexOf(
          itemRef.current as any,
        );
        if (index !== -1) focusItem(index);
      }, [focusItem]);

      const Comp = asChild ? Slot : "div";

      return (
        <Comp
          ref={itemRef}
          tabIndex={0}
          role="menuitem"
          data-nav-item
          aria-current={ariaCurrent}
          className={className}
          onFocus={handleFocus}
          {...props}
        >
          {children}
        </Comp>
      );
    },
  ),
);
AccessibleNavigationItem.displayName = "AccessibleNavigationItem";

export { AccessibleNavigation, AccessibleNavigationItem };
