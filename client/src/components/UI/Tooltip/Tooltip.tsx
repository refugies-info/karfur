import React, { useState } from "react";
import { Tooltip as TooltipTS, TooltipProps } from "reactstrap";
import styles from "./Tooltip.module.scss";

interface Props {
  children: string | React.ReactNode;
  target: string | HTMLElement | React.RefObject<HTMLElement>;
  placement?: TooltipProps["placement"];
}

const Tooltip = (props: Props) => {
  const [tooltipOpen, setTooltipOpen] = useState(false);
  const toggle = () => setTooltipOpen((o) => !o);

  return (
    <TooltipTS
      target={props.target}
      isOpen={tooltipOpen}
      toggle={toggle}
      placement={props.placement}
      className={styles.container}
    >
      {props.children}
    </TooltipTS>
  );
};

export default Tooltip;
