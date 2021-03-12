import React from "react";
import { Input, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import FButton from "../../FigmaUI/FButton/FButton";

import "./ReactionLectureModal.scss";

const ReactionLectureModal = (props) => {
  let suggestion = props.suggestion || {};

  const getUserName = () =>
    suggestion.username ? suggestion.username : "Utilisateur non connecté";
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className="modal-suggestion"
    >
      <ModalHeader toggle={props.toggle}>Réaction</ModalHeader>
      <ModalBody>
        <div style={{ marginBottom: "8px" }}>
          Envoyé par : <b>{getUserName()}</b>
        </div>

        <Input
          disabled
          type="textarea"
          placeholder="Aa"
          rows={5}
          value={suggestion.text}
          id="suggestion"
        />
      </ModalBody>
      <ModalFooter>
        <div>
          <FButton
            type="outline-black"
            name="trash-2-outline"
            onClick={() => {
              props.delete(suggestion);
            }}
            className="mr-16"
          >
            Supprimer
          </FButton>
          <FButton
            type="validate"
            name="checkmark"
            onClick={() => props.read(suggestion)}
          >
            J'ai lu
          </FButton>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default ReactionLectureModal;
