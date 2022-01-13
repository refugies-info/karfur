import React from "react";
// import { AppSwitch } from "@coreui/react";

import "./FSwitch.scss";

const fSwitch = (props) => {
  return (
    <div className={"switch-wrapper " + (props.className || "")}>
      {props.precontent}
{/*       <AppSwitch
        className={"mr-10" + (props.precontent ? " ml-10" : "")}
        outline
        variant="pill"
        color="light"
        {...props}
      /> */}
      {props.content}
    </div>
  );
};

export default fSwitch;
