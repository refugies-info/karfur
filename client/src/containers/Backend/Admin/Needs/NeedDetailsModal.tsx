import React from "react";
import { Modal } from "reactstrap";
import "./NeedDetailsModal.scss";
import { Need } from "../../../../types/interface";

interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedNeed: Need | null;
}

export const NeedDetailsModal = (props: Props) => {
  if (!props.selectedNeed) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        className="need-details-modal"
      >
        <div>Erreur</div>
      </Modal>
    );
  }
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className="need-details-modal"
    >
      <div>{props.selectedNeed.fr.text}</div>
    </Modal>
  );
};
