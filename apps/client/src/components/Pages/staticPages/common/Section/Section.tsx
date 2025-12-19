import React, { type ReactElement } from "react";
import { cls } from "~/lib/classname";

interface Props {
  children: ReactElement | ReactElement[];
  className?: string;
  style?: React.CSSProperties;
}

export const Section = React.forwardRef<HTMLDivElement | null, Props>((props, ref) => (
  <div ref={ref} className={cls("py-10 md:py-20", props.className)} style={props.style}>
    {props.children}
  </div>
));

Section.displayName = "Section";
