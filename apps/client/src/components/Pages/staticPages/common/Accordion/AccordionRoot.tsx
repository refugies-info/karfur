import * as AccordionRadix from "@radix-ui/react-accordion";
import type React from "react";

interface Props {
  multiOpen?: boolean;
  initOpen?: boolean;
  setOpen: (open: number[]) => void;
  children: React.ReactNode[];
}

const AccordionRoot = (props: Props) => {
  return props.multiOpen ? (
    <AccordionRadix.Root
      type="multiple"
      onValueChange={(value: string[]) => props.setOpen(value.map((n) => Number.parseInt(n)))}
      defaultValue={props.initOpen ? ["0"] : []}
    >
      {props.children}
    </AccordionRadix.Root>
  ) : (
    <AccordionRadix.Root
      type="single"
      onValueChange={(value: string | string[]) =>
        props.setOpen([Number.parseInt(value as string)])
      }
      defaultValue={props.initOpen ? "0" : undefined}
    >
      {props.children}
    </AccordionRadix.Root>
  );
};

export default AccordionRoot;
