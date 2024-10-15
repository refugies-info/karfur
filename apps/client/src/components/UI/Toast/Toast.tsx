import { ToastClose, ToastDescription, Toast as ToastRoot } from "@radix-ui/react-toast";
import React from "react";
import { cls } from "~/lib/classname";
import styles from "./Toast.module.scss";

interface Props {
  open: boolean;
  children: string | React.ReactNode;
  closeCallback: () => void;
}

const Toast = (props: Props) => {
  const onOpenChange = (open: boolean) => {
    if (!open) props.closeCallback();
  };

  return (
    <ToastRoot open={props.open} className={styles.container} onOpenChange={onOpenChange}>
      <ToastDescription className={styles.body}>
        <i className="fr-icon-checkbox-circle-fill" aria-hidden />
        {props.children}
      </ToastDescription>
      <ToastClose aria-label="Close" className={styles.close}>
        <i className={cls("fr-icon-close-line", styles.icon)} aria-hidden />
      </ToastClose>
    </ToastRoot>
  );
};

export default Toast;
