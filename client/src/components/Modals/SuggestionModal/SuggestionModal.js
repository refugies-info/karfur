import React from "react";
import {
  Input,
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "reactstrap";
import { NavLink } from "react-router-dom";

import marioProfile from "../../../assets/mario-profile.jpg";

import "./SuggestionModal.scss";

const suggestionModal = (props) => {
  let suggestion = props.suggestion || {};
  const jsUcfirst = (string) => {
    return (
      string &&
      string.length > 1 &&
      string.charAt(0).toUpperCase() + string.slice(1, string.length - 1)
    );
  };

  const imgSrc = (suggestion.picture || []).secure_url || marioProfile;
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className="modal-suggestion"
    >
      <ModalHeader toggle={props.toggle}>
        <span>{jsUcfirst(suggestion.action)}</span>
        <span className="align-right">
          de la part de <span className="text-dark">{suggestion.username}</span>{" "}
          &nbsp;
          <img className="img-circle size-40" src={imgSrc} alt="profile" />
        </span>
      </ModalHeader>
      <ModalBody>
        <div className="body-header">
          <span>
            <b>son message :</b>
          </span>
          <span className="align-right">
            <b>sur la page :</b>{" "}
            <NavLink
              to={"/dispositif/" + suggestion.dispositifId}
              className="link-to-page"
            >
              {suggestion.titre}
            </NavLink>
          </span>
        </div>
        <Input
          disabled
          type="textarea"
          placeholder="Aa"
          rows={5}
          value={suggestion.texte}
          id="suggestion"
        />
      </ModalBody>
      <ModalFooter>
        <Button color="dark" className="send-btn" onClick={props.toggle}>
          ok
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default suggestionModal;
