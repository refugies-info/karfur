import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import FButton from "../../FigmaUI/FButton/FButton";
import { SearchBar } from "../../../containers/UI/SearchBar/SearchBar";
import "./AddMemberModal.scss";

const addMemberModal = (props) => {
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className="add-member-modal"
    >
      <ModalHeader toggle={props.toggle}>Ajouter un membre</ModalHeader>
      <ModalBody>
        <b>
          Recherchez un utilisateur ci-dessous. Attention, l’utilisateur doit
          avoir déjà créé un compte pour être ajouté en tant que membre.
        </b>
        <SearchBar
          isArray
          users
          loupe
          className="search-bar inner-addon right-addon mt-10"
          placeholder="Rechercher un utilisateur"
          array={props.users}
          selectItem={props.selectItem}
        />
      </ModalBody>
      <ModalFooter>
        <FButton
          type="validate"
          name="checkmark-circle-outline"
          onClick={props.addMember}
          disabled={!props.selected._id}
        >
          Ajouter
        </FButton>
      </ModalFooter>
    </Modal>
  );
};

export default addMemberModal;
