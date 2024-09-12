import { fr } from "@codegouvfr/react-dsfr";
import React, { useEffect, useRef, useState } from "react";
import { ToastBody, Toast as ToastTS } from "reactstrap";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
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
    }, 5000);

    return () => clearTimeout(id.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ToastTS className={styles.container} isOpen={isOpen} fade={false} aria-live="polite">
      <ToastBody className={styles.body}>
        <EVAIcon
          name="checkmark-circle-2"
          fill={fr.colors.decisions.background.actionHigh.success.default}
          size={24}
          className="me-2"
        />
        {props.children}
      </ToastBody>
      <button
        onClick={(e: any) => {
          e.preventDefault();
          props.close();
        }}
        className={styles.close}
      >
        <EVAIcon name="close-outline" fill={fr.colors.decisions.text.mention.grey.default} size={24} />
      </button>
    </ToastTS>
  );
};

export default Toast;
