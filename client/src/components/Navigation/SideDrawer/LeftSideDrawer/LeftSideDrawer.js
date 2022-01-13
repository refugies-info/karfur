import React from "react";
import { useRouter } from 'next/router'
import Logo from "../../../Logo/Logo";
import NavigationItems from "../../NavigationItems/NavigationItems";
import BackendNavigationItems from "../../BackendNavigationItems/BackendNavigationItems";

import "./LeftSideDrawer.module.css";

const leftSideDrawer = (props) => {
  const router = useRouter();

  let attachedClasses = ["SideDrawer", "Close", "HideSideDrawer"];
  if (props.open) {
    attachedClasses = ["SideDrawer", "Open", "HideSideDrawer"];
  }
  const path = router.pathname;
  if (path.includes("/backend")) {
    attachedClasses.splice(2);
  }

  return (
    <div className={attachedClasses.join(" ")}>
      <Logo />
      <nav>
        {!path.includes("/backend") && <NavigationItems {...props} />}
        {path.includes("/backend") && <BackendNavigationItems {...props} />}
      </nav>
    </div>
  );
};

export default leftSideDrawer;
