import * as React from "react";

export interface DemoComponentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function DemoComponent({ children, ...other }: DemoComponentProps): JSX.Element {
  return (
    <button className=" bg-slate-500 hover:bg-slate-600 p-4 font-bold flex gap-11" type="button" {...other}>
      <span>huhu</span>
      {children}
    </button>
  );
}

DemoComponent.displayName = "DemoComponent";
