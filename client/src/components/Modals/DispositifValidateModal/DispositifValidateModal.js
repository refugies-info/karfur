import React from "react";
import { Modal, ModalHeader, ModalFooter } from "reactstrap";
import styled from "styled-components";
import FButton from "../../FigmaUI/FButton/FButton";
import FInput from "../../FigmaUI/FInput/FInput";
import EVAIcon from "../../UI/EVAIcon/EVAIcon";
import { colors } from "../../../colors";
import { filtres } from "../../../containers/Dispositif/data";
import Streamline from "../../../assets/streamline/index";

// import "./DispositifValidateModal.scss";

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

const TitleMockup = styled.div`
  font-weight: bold;
  font-size: 22px;
  margin-bottom: 11px;
  line-height: 27px;
  color: ${(props) =>
    props.typeContenu === "demarche" && props.color ? props.color : "black"};
`;

const TextMockup = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${(props) =>
    props.textlength > 110
      ? "red"
      : props.typeContenu === "demarche" && props.color
      ? props.color
      : ""};
`;

const TagNameContainer = styled.div`
  font-size: 16px;
  color: ${colors.blancSimple};
`;

const CardContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  padding: 16px;
  height: ${(props) =>
    props.typeContenu === "dispositif" ? "198px" : "248px"};
  min-width: 252px;
  max-width: 252px;
  overflow: auto;
`;

const TagContainer = styled.div`
  background-color: ${(props) => props.color};
  height: 50px;
  min-width: 248px;
  border-radius: 0 0 12px 12px;
  padding: 13px 15px;
`;

const TagContainerContent = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;
const EmptyTextContainer = styled.div`
  width: 216px;
  height: 80px;
  background-color: ${colors.orangeLight};
  border-radius: 12px;
  border: ${colors.orange} dashed 2px;
`;

const MockupCardContainer = styled.div`
  height: 248px;
  width: 252px;
  min-width: 248px;
  background-color: ${(props) =>
    props.typeContenu === "dispositif" ? colors.blancSimple : props.lightColor};
  border-radius: 12px;
  border: ${(props) =>
    props.typeContenu === "demarche" && props.color
      ? props.color + " solid 2px"
      : props.typeContenu === "demarche"
      ? "black solid 2px"
      : ""};
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

const getTagElement = (tag) => {
  return tag ? filtres.tags.filter((item) => item.name === tag.name)[0] : null;
};

const Check = (props) => {
  const tag = getTagElement(props.tags?.[0] || null);

  return (
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
          <div style={{ display: "flex" }}>
            <FInput
              type="textarea"
              rows={5}
              value={props.abstract}
              onChange={props.onChange}
              id="abstract"
              height="250px"
              padding="15px"
              placeholder="Résumez ici votre dispositif..."
            />
            <div style={{ marginTop: "100px" }}>
              <EVAIcon
                name={"chevron-right-outline"}
                size="xlarge"
                fill={colors.noir}
              />
            </div>
            <MockupCardContainer
              color={tag ? tag.darkColor : "#000"}
              lightColor={tag ? tag.lightColor : props.lightColor}
              typeContenu={props.typeContenu}
            >
              <CardContainer typeContenu={props.typeContenu}>
                <TitleMockup
                  color={tag ? tag.darkColor : "#000"}
                  typeContenu={props.typeContenu}
                >
                  {props.titreInformatif}
                </TitleMockup>
                <TextMockup
                  color={tag ? tag.darkColor : "#000"}
                  typeContenu={props.typeContenu}
                  textlength={props.abstract.length}
                >
                  {props.abstract.length === 0 && (
                    <EmptyTextContainer
                      typeContenu={props.typeContenu}
                    ></EmptyTextContainer>
                  )}
                  {props.abstract.length > 0 ? props.abstract : ""}
                </TextMockup>
              </CardContainer>
              {props.tags && props.typeContenu === "dispositif" && (
                <TagContainer color={tag ? tag.darkColor : "#000"}>
                  <TagContainerContent>
                    <Streamline
                      name={tag ? tag.icon : ""}
                      stroke={"white"}
                      width={22}
                      height={22}
                    />
                    <TagNameContainer> {props.titreMarque}</TagNameContainer>
                  </TagContainerContent>
                </TagContainer>
              )}
            </MockupCardContainer>
          </div>
          <div
            style={{
              display: "flex",
              flexDirection: "row",
            }}
          >
            <div
              className={
                "decompte" +
                ((props.abstract || "").length > 110 ? " text-danger" : "")
              }
            >
              {(props.abstract || "").length < 110
                ? 110 - (props.abstract || "").length
                : "110"}{" "}
              sur 110 caractères restants
            </div>
          </div>
        </>
      ) : null}
    </CheckContainer>
  );
}
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
      <ModalHeader toggle={props.toggle}>Dernières vérifications</ModalHeader>
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
          titreInformatif={props.titreInformatif}
          titreMarque={props.titreMarque}
          tags={props.tags}
          typeContenu={props.typeContenu}
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
            type={
              "validate-mockup" +
              (!props.abstract ||
              props.abstract === "" ||
              props.abstract.length > 110 ||
              (!geoloc && props.typeContenu !== "demarche") ||
              props.tags.length === 0
                ? " disabled"
                : "")
            }
            disabled={
              !props.abstract ||
              props.abstract === "" ||
              props.abstract.length > 110 ||
              (!geoloc && props.typeContenu !== "demarche") ||
              props.tags.length === 0
            }
            onClick={validateAndClose}
          >
            Valider
          </FButton>
        </div>
      </ModalFooter>
    </Modal>
  );
};

export default dispositifValidateModal;
