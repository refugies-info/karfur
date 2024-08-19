import { cls } from "lib/classname";
import React from "react";
import { Modal, ModalHeader } from "reactstrap";

interface Props {
  show: boolean
  toggle?: any
  modalHeader?: any
  className?: string
  modalRef?: any
  children: any
}

const modal = (props: Props) => {
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className={cls("custom-modal", props.className || "")}
      ref={props.modalRef}
    >
      {props.modalHeader && <ModalHeader toggle={props.toggle}>{props.modalHeader}</ModalHeader>}

      {props.children}
    </Modal>
  );
};

export default modal;
