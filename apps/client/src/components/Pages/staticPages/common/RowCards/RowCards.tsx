import type React from "react";

interface Props {
  children: React.ReactNode;
}

export const RowCards = (props: Props) => (
  <div className="flex flex-col gap-4 lg:flex-row lg:items-stretch lg:justify-center lg:gap-10">
    {props.children}
  </div>
);
