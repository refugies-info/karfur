import React from "react";
import { cls } from "~/lib/classname";
import styles from "./TabItem.module.scss";

interface TabItemProps {
  children: React.ReactNode;
  className?: string;
  isActive?: boolean;
  onClick?: () => void;
}

const TabItem = React.forwardRef<HTMLButtonElement, TabItemProps>(
  ({ children, isActive, className, ...props }, ref) => {
    return (
      <button className={cls(styles.tabitem, isActive && styles.active, className)} {...props} ref={ref}>
        {children}
      </button>
    );
  },
);

TabItem.displayName = "TabItem";
export default TabItem;
