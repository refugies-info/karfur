import React, { useEffect, useState } from "react";
import { TooltipProps, Tooltip as TooltipTS, UncontrolledTooltip } from "reactstrap";
import { cls } from "~/lib/classname";
import styles from "./Tooltip.module.scss";

interface Props {
  children: string | React.ReactNode;
  target: string | HTMLElement | React.RefObject<HTMLElement>;
  placement?: TooltipProps["placement"];
  className?: string;
  hide?: boolean;
  isOpen?: boolean;
  transitionTimeout?: number;
}

const Tooltip = (props: Props) => {
  const [hasMounted, setHasMounted] = useState(false);

  useEffect(() => {
    setHasMounted(true);
  }, []);

  // Don't render tooltip during SSR or before target element is available
  if (!hasMounted) return null;

  // Use UncontrolledTooltip instead of Tooltip to avoid the transition.timeout warning
  // UncontrolledTooltip has default transition values set internally
  if (props.isOpen !== undefined) {
    // If isOpen is explicitly provided, use controlled Tooltip with fixed transition
    return (
      <TooltipTS
        target={props.target}
        isOpen={props.isOpen}
        placement={props.placement}
        className={cls(styles.container, props.className)}
        // Fix for transition.timeout warning
        {...{
          // @ts-ignore - Adding direct props to fix reactstrap PopperContent warning
          popperProps: {
            modifiers: {
              preventOverflow: { enabled: true },
            },
          },
          // @ts-ignore - Adding direct props to fix reactstrap PopperContent warning
          fade: true,
          // @ts-ignore - Adding direct props to fix reactstrap PopperContent warning
          delay: { show: 0, hide: 0 },
          // @ts-ignore - Adding direct props to fix reactstrap PopperContent warning
          transition: { timeout: 150 },
        }}
      >
        {props.children}
      </TooltipTS>
    );
  }

  // Otherwise use UncontrolledTooltip which handles transitions internally
  return (
    <UncontrolledTooltip
      target={props.target}
      placement={props.placement}
      className={cls(styles.container, props.className)}
      trigger="hover focus"
    >
      {props.children}
    </UncontrolledTooltip>
  );
};

export default Tooltip;
