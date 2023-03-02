import React from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { Toast as ToastTS, ToastBody } from "reactstrap";
import styles from "./Toast.module.scss";

interface Props {
  children: string | React.ReactNode;
  close: () => void;
}

const Toast = (props: Props) => {
  return (
    <ToastTS className={styles.container}>
      <ToastBody className={styles.body}>
        <EVAIcon name="checkmark-circle-2" fill="#18753C" size={24} className="me-2" />
        {props.children}
      </ToastBody>
      <button onClick={props.close} className={styles.close}>
        <EVAIcon name="close-outline" fill="#666666" size={24} />
      </button>
    </ToastTS>
  );
};

export default Toast;
