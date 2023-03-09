import React from "react";
import { Modal, ModalBody, ModalHeader } from "reactstrap";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./MobileModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  title: string;
  children: React.ReactNode;
}

const MobileModal = (props: Props) => {
  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal}>
      <ModalHeader className={styles.header}>
        {props.title}
        <button onClick={props.toggle}>
          <EVAIcon name="close-outline" size={24} fill="dark" />
        </button>
      </ModalHeader>
      <ModalBody className={styles.content}>{props.children}</ModalBody>
    </Modal>
  );
};

export default MobileModal;
