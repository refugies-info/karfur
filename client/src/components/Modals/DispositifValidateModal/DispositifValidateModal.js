import React from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter, Input } from "reactstrap";
import styled from "styled-components";
import FButton from "../../FigmaUI/FButton/FButton";
import variables from "scss/colors.scss";

import "./DispositifValidateModal.scss";

const CheckContainer = styled.div`
  background: ${(props) => (props.missingElement ? "#FFE2B8" : "#def7c2")};
  border-radius: 12px;
  padding: 18px;
  margin-bottom: 16px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: ${(props) => (props.missingElement ? "#FF9800" : "#4caf50")};
`;

const getTitle = (section) =>
  section === "tags" ? "Choix des thèmes" : "Structure responsable";

const Check = (props) => (
  <CheckContainer missingElement={props.missingElement}>
    <Title missingElement={props.missingElement}>
      {getTitle(props.section)}
    </Title>
    <Title missingElement={props.missingElement}>
      {props.missingElement ? "Manquant !" : "Ok !"}
    </Title>
  </CheckContainer>
);

const dispositifValidateModal = (props) => {
  const validateAndClose = () => {
    props.validate();
    props.toggle();
  };
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className="dispositif-validate-modal"
    >
      <ModalHeader toggle={props.toggle}>Vous y êtes presque !</ModalHeader>
      <ModalBody>
        <Check section="tags" missingElement={props.tags.length === 0} />
        <Check
          section="structure"
          missingElement={props.sponsors.length === 0}
        />

        <p>
          <b>
            Dernière étape : ajoutez une phrase explicative décrivant votre
            fiche.
          </b>
          <br />
          Elle sera affichée dans les résultats de recherche.
        </p>
        <Input
          type="textarea"
          rows={5}
          value={props.abstract}
          onChange={props.onChange}
          id="abstract"
          placeholder="Résumez votre dispositif en une phrase"
        />
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-end",
          }}
        >
          <div
            className={
              "decompte" +
              ((props.abstract || "").length > 110 ? " text-danger" : "")
            }
          >
            {110 - (props.abstract || "").length} sur 110 caractères restants
          </div>
        </div>
      </ModalBody>
      <ModalFooter>
        <div>
          <FButton
            tag={"a"}
            href="https://help.refugies.info/fr/"
            target="_blank"
            rel="noopener noreferrer"
            type="help"
            name="question-mark-circle-outline"
            fill={variables.noir}
            className="mr-8"
          >
            Centre d'aide
          </FButton>
          <FButton
            type="tuto"
            name={"play-circle-outline"}
            onClick={() => props.toggleTutorielModal("Description")}
          >
            Tutoriel
          </FButton>
        </div>
        <div>
          <FButton
            type="white"
            name={"arrow-back"}
            className="mr-8"
            onClick={props.toggle}
          >
            Retour
          </FButton>
          <FButton
            name="checkmark"
            type="validate"
            onClick={validateAndClose}
            disabled={
              !props.abstract ||
              props.abstract === "" ||
              props.abstract.length > 110
            }
          >
            Valider
          </FButton>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default dispositifValidateModal;
