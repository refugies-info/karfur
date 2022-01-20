import React from "react";
import {
  Modal,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import styles from "./Sponsors.module.scss";

interface Props {
  showModals: any
  modal: any
  title: string
  keyValue: string
  lowerLeftBtn: any
  lowerRightBtn: any
  children: any
  toggleModal: any
}

const CustomModal = (props: Props) => (
  <Modal
    isOpen={props.showModals[props.keyValue].show}
    toggle={() => props.toggleModal(props.modal.name)}
    className={styles.custom_modal}
    key={props.keyValue}
  >
    <ModalBody className={styles.modal_content}>
      <h3>{props.title}</h3>
      {props.children}
    </ModalBody>
    <ModalFooter className={styles.modal_footer}>
      {props.lowerLeftBtn}
      {props.lowerRightBtn}
    </ModalFooter>
  </Modal>
);

export default CustomModal;
