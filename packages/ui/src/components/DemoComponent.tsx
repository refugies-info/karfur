import { cn } from "@/lib/cn";
import * as React from "react";
export interface DemoComponentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}

export function DemoComponent({ children, className, ...other }: DemoComponentProps): JSX.Element {
  return (
    <button
      className={cn(" bg-slate-500 hover:bg-slate-600 p-4 font-bold flex gap-11", className)}
      type="button"
      {...other}
    >
      <span>😎</span>
      {children}
    </button>
  );
}

DemoComponent.displayName = "DemoComponent";
