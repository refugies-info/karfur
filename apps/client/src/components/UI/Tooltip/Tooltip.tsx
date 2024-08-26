import { cls } from "@/lib/classname";
import React, { useState } from "react";
import { TooltipProps, Tooltip as TooltipTS } from "reactstrap";
import styles from "./Tooltip.module.scss";

interface Props {
  children: string | React.ReactNode;
  target: string | HTMLElement | React.RefObject<HTMLElement>;
  placement?: TooltipProps["placement"];
  className?: string;
  hide?: boolean;
  isOpen?: boolean;
}

const Tooltip = (props: Props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen((o) => !o);

  return (
    <TooltipTS
      target={props.target}
      isOpen={props.isOpen || (!props.hide && tooltipOpen)}
      toggle={toggle}
      placement={props.placement}
      className={cls(styles.container, props.className)}
    >
      {props.children}
    </TooltipTS>
  );
};

export default Tooltip;
