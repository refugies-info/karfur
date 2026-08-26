import React from "react";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { cls } from "~/lib/classname";
import styles from "./TabsBar.module.scss";

interface TabsBarProps {
  children: React.ReactNode;
}

const TabsBar = React.forwardRef<HTMLUListElement, TabsBarProps>(({ children, ...props }, ref) => {
  const stylesDisabled = useStylesDisabled();

  return (
    // role="list" : parade défensive, un ul sans puce peut perdre sa nature de liste sous
    // Safari et VoiceOver. Les li gardent display: list-item, ils n'ont besoin de rien.
    <ul className={cls(styles.tabsbar)} role="list" {...props} ref={ref}>
      {children}
      {stylesDisabled && (
        <li aria-hidden="true">
          <br />
          <br />
        </li>
      )}
    </ul>
  );
});

TabsBar.displayName = "TabsBar";
export default TabsBar;
