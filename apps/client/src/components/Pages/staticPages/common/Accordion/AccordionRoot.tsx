import * as AccordionRadix from "@radix-ui/react-accordion";
import React from "react";

interface Props {
  multiOpen?: boolean;
  initOpen?: boolean;
  setOpen: (open: string[]) => void;
  children: React.ReactNode[];
  name: string;
  nbItems: number;
}

const AccordionRoot = (props: Props) => {
  return props.multiOpen ? (
    <AccordionRadix.Root
      type="multiple"
      onValueChange={(value: string[]) => props.setOpen(value)}
      defaultValue={props.initOpen ? [`${props.name}-0`] : []}
    >
      {props.children}
    </AccordionRadix.Root>
  ) : (
    <AccordionRadix.Root
      type="single"
      onValueChange={(value: string) => props.setOpen(value ? [value] : [])}
      defaultValue={props.initOpen ? `${props.name}-0` : undefined}
      collapsible
    >
      {props.children}
    </AccordionRadix.Root>
  );
};

export default AccordionRoot;
