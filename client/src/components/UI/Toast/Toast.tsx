import React, { useEffect, useRef, useState } from "react";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { Toast as ToastTS, ToastBody } from "reactstrap";
import styles from "./Toast.module.scss";

interface Props {
  children: string | React.ReactNode;
  close: () => void;
}

const Toast = (props: Props) => {
  const id = useRef<any | null>(null);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setIsOpen(true);
    id.current = setTimeout(() => {
      props.close();
    }, 3000);

    return () => clearTimeout(id.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToastTS className={styles.container} isOpen={isOpen} fade={false}>
      <ToastBody className={styles.body}>
        <EVAIcon name="checkmark-circle-2" fill={styles.lightTextDefaultSuccess} size={24} className="me-2" />
        {props.children}
      </ToastBody>
      <button onClick={props.close} className={styles.close}>
        <EVAIcon name="close-outline" fill={styles.lightTextMentionGrey} size={24} />
      </button>
    </ToastTS>
  );
};

export default Toast;
