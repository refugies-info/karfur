import { ToastClose, ToastDescription, Toast as ToastRoot } from "@radix-ui/react-toast";
import type React from "react";
import { cn } from "~/lib/classname";
import styles from "./Toast.module.scss";
import { useDeclareToast } from "./ToastPresence";

interface Props {
  open: boolean;
  children: string | React.ReactNode;
  type?: "success" | "error";
  closeCallback: () => void;
}

const Toast = ({ open, children, type = "success", closeCallback }: Props) => {
  // Le viewport n'est monté que si un toast est à afficher (RGAA 8.9).
  useDeclareToast(open);

  const onOpenChange = (open: boolean) => {
    if (!open) closeCallback();
  };

  return (
    <ToastRoot open={open} className={styles.container} onOpenChange={onOpenChange}>
      <ToastDescription className={cn(styles.body, type === "error" && styles.error)}>
        <i
          className={cn(type === "error" ? "fr-icon-error-fill" : "fr-icon-checkbox-circle-fill")}
          aria-hidden
        />
        {children}
      </ToastDescription>
      <ToastClose aria-label="Close" className={styles.close}>
        <i className={"fr-icon-close-line"} aria-hidden />
      </ToastClose>
    </ToastRoot>
  );
};

export default Toast;
