import React from "react";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import styled from "styled-components";
import FButton from "../../FigmaUI/FButton/FButton";
import FInput from "../../FigmaUI/FInput/FInput";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";

import "./DispositifValidateModal.scss";

const CheckContainer = styled.div`
  background: ${(props) => (props.missingElement ? "#FFE2B8" : "#def7c2")};
  border-radius: 12px;
  padding: 18px;
  justify-content: space-between;
  flex-direction: column;
  margin-bottom: 16px;
  display: flex;
  cursor: ${(props) => (props.missingElement ? "pointer" : "default")};
`;

const Row = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  width: 100%;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  color: ${(props) => (props.missingElement ? "#FF9800" : "#4caf50")};
`;

const getTitle = (section) =>
  section === "tags"
    ? "Choix des thèmes"
    : section === "geoloc"
    ? "Géolocalisation"
    : section === "sentence"
    ? "Phrase explicative"
    : "Structure responsable";

const onCheckContainerClick = (section, toggleModal, missingElement) => {
  if (!missingElement || section === "sentence") {
    return;
  }
  return toggleModal(true);
};
const Check = (props) => (
  <CheckContainer
    missingElement={props.missingElement}
    onClick={() => {
      if (!props.geolocInfoCard && props.section === "geoloc") {
        props.addItem(1, "card", "Zone d'action");
      }
      onCheckContainerClick(
        props.section,
        props.toggleModal,
        props.missingElement
      );
    }}
  >
    <Row>
      <Title missingElement={props.missingElement}>
        {getTitle(props.section)}
      </Title>
      <Title missingElement={props.missingElement}>
        {props.missingElement ? "Manquant" : "Ok"}
        <EVAIcon
          className={"ml-8"}
          name={props.missingElement ? "alert-triangle" : "checkmark-circle-2"}
          fill={props.missingElement ? "#FF9800" : "#4caf50"}
        />
      </Title>
    </Row>
    {props.section === "sentence" ? (
      <>
        <p style={{ fontSize: 16, marginTop: 8 }}>
          Rédigez une dernière phrase, visible dans les résultats de recherche
        </p>
        <FInput
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
      </>
    ) : null}
  </CheckContainer>
);

const dispositifValidateModal = (props) => {
  const validateAndClose = () => {
    props.validate();
    props.toggle();
  };
  let geoloc = false;
  let geolocInfoCard = null;
  if (
    props.menu &&
    props.menu[1] &&
    props.menu[1].children &&
    props.menu[1].children.length > 0
  ) {
    geolocInfoCard = props.menu[1].children.find(
      (elem) => elem.title === "Zone d'action"
    );
    if (
      geolocInfoCard &&
      geolocInfoCard.departments &&
      geolocInfoCard.departments.length > 0
    ) {
      geoloc = true;
    }
  }
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggle}
      className="dispositif-validate-modal"
    >
      <ModalHeader toggle={props.toggle}>Vous y êtes presque !</ModalHeader>
      <div>
        {props.typeContenu !== "demarche" ? (
          <Check
            geolocInfoCard={geolocInfoCard}
            section="geoloc"
            missingElement={!geoloc}
            toggleModal={props.toggleGeolocModal}
            addItem={props.addItem}
          />
        ) : null}

        <Check
          section="structure"
          missingElement={!props.mainSponsor._id}
          toggleModal={props.toggleSponsorModal}
        />

        <Check
          section="tags"
          missingElement={props.tags.length === 0}
          toggleModal={props.toggleTagsModal}
        />

        <Check
          section="sentence"
          abstract={props.abstract}
          onChange={props.onChange}
          missingElement={
            (props.abstract || "").length > 110 || !props.abstract
          }
          toggleTagsModal={props.toggleTagsModal}
          toggleSponsorModal={props.toggleSponsorModal}
        />
      </div>
      <ModalFooter>
        <div>
          {/*           <FButton
            tag={"a"}
            href="https://help.refugies.info/fr/"
            target="_blank"
            rel="noopener noreferrer"
            type="help"
            name="question-mark-circle-outline"
            fill={colors.noir}
            className="mr-8"
          >
            Centre d'aide
          </FButton> */}
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
            type="outline-black"
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
              props.abstract.length > 110 ||
              (!geoloc && props.typeContenu !== "demarche") ||
              props.tags.length === 0
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
