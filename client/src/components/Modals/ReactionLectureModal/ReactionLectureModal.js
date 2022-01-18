import React from "react";
import { Input, Modal } from "reactstrap";
import FButton from "../../FigmaUI/FButton/FButton";
import styled from "styled-components";
// import Icon from "react-eva-icons";

// import "./ReactionLectureModal.scss";

const ModalHeaderContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 40px;
  font-weight: 700;
  margin-bottom: 24px;
  justify-content: space-between;
`;
const ModalBodyContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  font-weight: 700;
  margin-bottom: 24px;
  justify-content: center;
`;

const IconContainer = styled.div`
  position: absolute;
  width: 20px;
  height: 20px;
  right: 15px;
  top: 15px;
  cursor: pointer;
`;

const SendByContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
  position: absolute;
  right: 40px;
`;
const AProposContainer = styled.div`
  display: flex;
  align-items: center;
  font-size: 18px;
`;

const UserNameContainer = styled.div`
  background-color: white;

  margin-left: 10px;
  padding: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: space-between;
`;

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
      <IconContainer onClick={props.toggle}>
        {/* <Icon name="close-outline" fill="#3D3D3D" size="large" /> */}
      </IconContainer>
      <ModalHeaderContainer toggle={props.toggle}>
        Réaction{" "}
        <SendByContainer>
          Envoyée par
          <UserNameContainer>
            {getUserName().length > 20
              ? getUserName().substr(0, 20) + "..."
              : getUserName()}
          </UserNameContainer>
        </SendByContainer>
      </ModalHeaderContainer>

      <ModalBodyContainer className="modal-body">
        <Input
          disabled
          type="textarea"
          placeholder="Aa"
          rows={5}
          value={suggestion.text}
          id="suggestion"
        />
        <AProposContainer>
          A propos de la fiche
          <UserNameContainer>{suggestion.title}</UserNameContainer>
        </AProposContainer>
      </ModalBodyContainer>

      <ButtonContainer>
        <FButton
          type="error"
          name="trash-2-outline"
          onClick={() => {
            props.delete(suggestion);
          }}
          className="mr-16"
        >
          Supprimer
        </FButton>

        <FButton
          href={"/" + suggestion.typeContenu + "/" + suggestion.dispositifId}
          type="dark"
          name="external-link-outline"
          target="_blank"
          className="mr-16"
        >
          Voir la fiche
        </FButton>

        <FButton
          type="validate"
          name="checkmark"
          onClick={() => props.read(suggestion)}
        >
          J'ai lu
        </FButton>
      </ButtonContainer>
    </Modal>
  );
};

export default ReactionLectureModal;
