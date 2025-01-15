import React from "react";

interface Props {
  children: React.ReactNode;
}

export const RowCards = (props: Props) => (
  <div className="flex flex-col lg:flex-row lg:items-stretch gap-4 lg:gap-10">{props.children}</div>
);
