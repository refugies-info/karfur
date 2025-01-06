import * as React from "react";
import { cls } from "../lib/classname";
export interface DemoComponentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function DemoComponent({ children, className, ...other }: DemoComponentProps): JSX.Element {
  return (
    <button
      className={cls(" bg-slate-500 hover:bg-slate-600 p-4 font-bold flex gap-11", className)}
      type="button"
      {...other}
    >
      <span>huhu</span>
      {children}
    </button>
  );
}

DemoComponent.displayName = "DemoComponent";
