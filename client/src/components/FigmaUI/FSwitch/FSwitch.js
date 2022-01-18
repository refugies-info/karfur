import React from "react";
// import { AppSwitch } from "@coreui/react";

import styles from "./FSwitch.module.scss";

const fSwitch = (props) => {
  return (
    <div className={styles.switch + " " + (props.className || "")}>
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
