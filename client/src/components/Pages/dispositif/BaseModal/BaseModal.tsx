import React from "react";
import { Modal } from "reactstrap";
import Image from "next/image";
import { cls } from "lib/classname";
import { useContentLocale } from "hooks";
import Button from "components/UI/Button";
import TutoImg from "assets/dispositif/tutoriel-image.svg";
import styles from "./BaseModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  className?: string;
  help?: {
    title: string;
    content: string | React.ReactNode;
  };
  title: string | React.ReactNode;
  children: React.ReactNode;
  small?: boolean;
  onOpened?: () => void;
}

/**
 * Modal structure used across the EDIT mode of the page.
 */
const BaseModal = (props: Props) => {
  const { isRTL } = useContentLocale();

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className={cls(styles.modal, props.small && styles.small, props.className || "")}
      contentClassName={styles.modal_content}
      onOpened={props.onOpened}
    >
      <div className={styles.container} dir={isRTL ? undefined : "ltr"}>
        {props.help && (
          <div className={styles.sidebar}>
            <Image src={TutoImg} width={47} height={32} alt="" />
            <p className={styles.title}>{props.help.title}</p>
            <div className={styles.text}>{props.help.content}</div>
          </div>
        )}
        <div className={styles.content}>
          <div className="text-end">
            <Button icon="close-outline" iconPlacement="end" tertiary className={styles.close} onClick={props.toggle}>
              Fermer
            </Button>
          </div>
          <p className={styles.title}>{props.title}</p>
          {props.children}
        </div>
      </div>
    </Modal>
  );
};

export default BaseModal;
