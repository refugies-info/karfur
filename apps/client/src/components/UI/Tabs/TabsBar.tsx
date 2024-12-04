import React from "react";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cls } from "~/lib/classname";
import styles from "./TabsBar.module.scss";

interface TabsBarProps {
  children: React.ReactNode;
}

const TabsBar = React.forwardRef<HTMLDivElement, TabsBarProps>(({ children, ...props }, ref) => {
  const stylesDisabled = useStylesDisabled();

  return (
    <div className={cls(styles.tabsbar)} {...props} ref={ref}>
      {children}
      {stylesDisabled && (
        <>
          <br />
          <br />
        </>
      )}
    </div>
  );
});

TabsBar.displayName = "TabsBar";
export default TabsBar;
