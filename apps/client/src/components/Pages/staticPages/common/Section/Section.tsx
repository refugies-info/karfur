import React, { ReactElement } from "react";
import { cls } from "~/lib/classname";

interface Props {
  children: ReactElement;
  className?: string;
}

export const Section = React.forwardRef<HTMLDivElement | null, Props>((props, ref) => (
  <div ref={ref} className={cls("py-10 md:py-20", props.className)}>
    {props.children}
  </div>
));

Section.displayName = "Section";
