import * as React from "react";

interface DemoComponentProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode;
}
declare function DemoComponent({ children, ...other }: DemoComponentProps): JSX.Element;
declare namespace DemoComponent {
  var displayName: string;
}

export { DemoComponent, type DemoComponentProps };
