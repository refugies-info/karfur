import React from "react";
import { cls } from "~/lib/classname";
import styles from "./TabsBar.module.scss";

interface TabsBarProps {
  children: React.ReactNode;
}

const TabsBar = React.forwardRef<HTMLDivElement, TabsBarProps>(({ children, ...props }, ref) => {
  return (
    <div className={cls(styles.tabsbar)} {...props} ref={ref}>
      {children}
    </div>
  );
});

TabsBar.displayName = "TabsBar";
export default TabsBar;
