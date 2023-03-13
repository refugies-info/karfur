import React from "react";
import { Modal } from "reactstrap";
import Image from "next/image";
import { cls } from "lib/classname";
import Button from "components/UI/Button";
import TutoImg from "assets/dispositif/tutoriel-image.svg";
import styles from "./BaseModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  className?: string;
  help: {
    title: string;
    content: string | React.ReactNode;
  };
  title: string;
  children: React.ReactNode;
}

const BaseModal = (props: Props) => {
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className={cls(styles.modal, props.className || "")}
      contentClassName={styles.modal_content}
    >
      <div className={styles.container}>
        <div className={styles.sidebar}>
          <Image src={TutoImg} width={47} height={32} alt="" />
          <p className={styles.title}>{props.help.title}</p>
          <div className={styles.text}>{props.help.content}</div>
        </div>
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
