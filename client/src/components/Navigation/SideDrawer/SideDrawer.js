import React from "react";

import Backdrop from "../../UI/Backdrop/Backdrop";
import LeftSideDrawer from "./LeftSideDrawer/LeftSideDrawer";

import "./SideDrawer.module.scss";

const sideDrawer = (props) => {
  const drawer = <LeftSideDrawer {...props} />;

  return (
    <>
      <Backdrop show={props.open} clicked={props.closed} />
      {drawer}
    </>
  );
};

export default sideDrawer;
