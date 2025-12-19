import type * as React from "react";
import { cn } from "../lib/cn";

export interface DemoComponentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function DemoComponent({
  children,
  className,
  ...other
}: DemoComponentProps): React.JSX.Element {
  return (
    <button
      className={cn("flex gap-11 bg-slate-500 p-4 font-bold hover:bg-slate-600", className)}
      type="button"
      {...other}
    >
      <span>😎</span>
      {children}
    </button>
  );
}

DemoComponent.displayName = "DemoComponent";
