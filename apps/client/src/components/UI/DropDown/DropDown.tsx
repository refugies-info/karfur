import React, {
  Dispatch,
  forwardRef,
  HTMLProps,
  KeyboardEvent,
  ReactNode,
  SetStateAction,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

interface DropDownProps extends Omit<HTMLProps<HTMLDivElement>, "children"> {
  open: boolean;
  setOpen: Dispatch<SetStateAction<boolean>>;
  children: ReactNode;
  label?: string;
}

const DropDown = React.memo(
  forwardRef<HTMLDivElement, DropDownProps>(
    ({ open, setOpen, children, label = "Menu", className = "", ...props }, ref) => {
      const [activeIndex, setActiveIndex] = useState<number>(-1);
      const itemsRef = useRef<HTMLElement[]>([]);
      const menuId = useRef(`dropdown-${Math.random().toString(36).substr(2, 9)}`);

      const handleKeyDown = useCallback(
        (event: KeyboardEvent) => {
          const itemCount = itemsRef.current.length;

          switch (event.key) {
            case "ArrowDown":
              event.preventDefault();
              setActiveIndex((prev) => (prev + 1) % itemCount);
              break;
            case "ArrowUp":
              event.preventDefault();
              setActiveIndex((prev) => (prev - 1 + itemCount) % itemCount);
              break;
            case "Home":
              event.preventDefault();
              setActiveIndex(0);
              break;
            case "End":
              event.preventDefault();
              setActiveIndex(itemCount - 1);
              break;
            case "Escape":
              event.preventDefault();
              setOpen(false);
              break;
            case "Tab":
              setOpen(false);
              break;
          }
        },
        [setOpen],
      );

      useEffect(() => {
        if (open && activeIndex >= 0 && itemsRef.current[activeIndex]) {
          itemsRef.current[activeIndex].focus();
        }
      }, [activeIndex, open]);

      // Reset active index when closing
      useEffect(() => {
        if (!open) {
          setActiveIndex(-1);
        }
      }, [open]);

      const mappedChildren = useMemo(
        () =>
          React.Children.map(children, (child, index) => {
            if (!React.isValidElement(child)) return child;

            return React.cloneElement(child as React.ReactElement, {
              "role": "menuitem",
              "tabIndex": activeIndex === index ? 0 : -1,
              "ref": (el: HTMLElement) => {
                if (el) itemsRef.current[index] = el;
              },
              "aria-selected": activeIndex === index,
            });
          }),
        [children, activeIndex],
      );

      return (
        <div
          ref={ref}
          role="menu"
          aria-labelledby={menuId.current}
          onKeyDown={handleKeyDown}
          className={`${className} ${open ? "open" : ""}`}
          {...props}
        >
          {mappedChildren}
        </div>
      );
    },
  ),
);

DropDown.displayName = "DropDown";

export default DropDown;
