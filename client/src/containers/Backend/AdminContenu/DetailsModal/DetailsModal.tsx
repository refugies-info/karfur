import React, { useState } from "react";
import styled from "styled-components";
import { Modal, Input } from "reactstrap";
// @ts-ignore
import "./DetailsModal.scss";
import { Moment } from "moment";
import { TypeContenu, StyledStatus } from "../components/SubComponents";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import { ObjectId } from "mongodb";
import { correspondingStatus, progressionData } from "../data";
import { compare } from "../AdminContenu";
// @ts-ignore
import moment from "moment/min/moment-with-locales";
import { Picture } from "../../../../@types/interface";
// @ts-ignore
import variables from "scss/colors.scss";
import marioProfile from "../../../../assets/mario-profile.jpg";
import noStructure from "../../../../assets/noStructure.png";

interface SelectedDispositif {
  titreInformatif: string;
  titreMarque?: string;
  updatedAt: Moment;
  status: string;
  typeContenu: string;
  created_at: Moment;
  publishedAt?: Moment;
  _id: ObjectId;
  lastAdminModificationDate?: Moment;
  mainSponsor: null | {
    _id: ObjectId;
    nom: string;
    status: string;
    picture: Picture | undefined;
  };
  creatorId: {
    username: string;
    picture: Picture | undefined;
    _id: ObjectId;
  } | null;
}
interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedDispositif: SelectedDispositif;
  url: string;
  onDeleteClick: () => void;
  setShowChangeStructureModal: (arg: boolean) => void;
}

const LeftPart = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
`;

const RightPart = styled.div`
  display: flex;
  flex-direction: column;
  width: 350px;
`;

const TitreInformatif = styled.span`
  font-style: normal;
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
`;
const TitreMarque = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-right: 8px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  justify-content: space-between;
  margin-top: 16px;
  align-items: center;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin: 12px 0px 12px 0px;
`;

const StructureContainer = styled.div`
  background: ${(props) =>
    props.noStructure ? variables.erreur : variables.blancSimple};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  padding: 16px;
`;

const MainContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
`;

const ButtonsContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 16px;
`;

const CreatorContainer = styled.div`
  border-radius: 12px;
  padding: 8px;
  background: ${variables.blancSimple};
  display: flex;
  flex-direction: row;
  width: fit-content;
  align-items: center;
  cursor: pointer;
`;

moment.locale("fr");
export const DetailsModal = (props: Props) => {
  const selectedDispositif = props.selectedDispositif;

  const getCreatorImage = (selectedDispositif: SelectedDispositif) =>
    selectedDispositif.creatorId &&
    selectedDispositif.creatorId.picture &&
    selectedDispositif.creatorId.picture.secure_url
      ? selectedDispositif.creatorId.picture.secure_url
      : marioProfile;

  if (selectedDispositif) {
    const burl =
      props.url +
      (selectedDispositif.typeContenu || "dispositif") +
      "/" +
      selectedDispositif._id;
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        size="lg"
        className="details-modal"
      >
        <MainContainer>
          <RowContainer>
            <LeftPart>
              <TitreInformatif>
                {selectedDispositif.titreInformatif}
              </TitreInformatif>
              <RowContainer>
                {selectedDispositif.titreMarque && (
                  <TitreMarque>
                    <span style={{ color: variables.cardColor }}>avec </span>
                    {selectedDispositif.titreMarque}
                  </TitreMarque>
                )}
                <TypeContenu
                  type={selectedDispositif.typeContenu}
                  isDetailedVue={true}
                />
              </RowContainer>
              <Title>Statut</Title>
              <RowContainer>
                {correspondingStatus.sort(compare).map((status) => (
                  <div
                    key={status.storedStatus}
                    style={{
                      marginRight: "8px",
                      marginTop: "4px",
                      marginBottom: "4px",
                    }}
                  >
                    <StyledStatus
                      text={status.storedStatus}
                      overrideColor={
                        selectedDispositif.status !== status.storedStatus
                      }
                      textToDisplay={status.displayedStatus}
                      color={status.color}
                    />
                  </div>
                ))}
              </RowContainer>
              <Title>Dernière mise à jour</Title>
              {`${moment(selectedDispositif.updatedAt).format(
                "LLL"
              )} soit ${moment(selectedDispositif.updatedAt).fromNow()}`}
              <Title>Date de publication</Title>
              {selectedDispositif.publishedAt
                ? `${moment(selectedDispositif.publishedAt).format(
                    "LLL"
                  )} soit ${moment(selectedDispositif.publishedAt).fromNow()}`
                : "Non disponible"}
              <Title>Date de création</Title>
              {`${moment(selectedDispositif.created_at).format(
                "LLL"
              )} soit ${moment(selectedDispositif.created_at).fromNow()}`}
              <Title>Créateur</Title>
              <CreatorContainer>
                <img
                  className="creator-img"
                  src={getCreatorImage(selectedDispositif)}
                />

                {selectedDispositif.creatorId &&
                  selectedDispositif.creatorId.username}
              </CreatorContainer>
            </LeftPart>
            <RightPart>
              <Title>Progression</Title>
              <RowContainer>
                {progressionData.map((status) => (
                  <div
                    key={status.storedStatus}
                    style={{
                      marginRight: "8px",
                      marginTop: "4px",
                      marginBottom: "4px",
                    }}
                  >
                    <StyledStatus
                      text={status.storedStatus}
                      textToDisplay={status.displayedStatus}
                      color={status.color}
                      textColor={status.textColor}
                    />
                  </div>
                ))}
              </RowContainer>
              <Title>Notes</Title>
              <Input
                type="textarea"
                placeholder="Rédigez un court paragraphe sur votre structure"
                rows={5}
                value={""}
                // onChange={onChange}
                id="description"
              />
              <Title>Dernière action d'administrateur</Title>
              {selectedDispositif.lastAdminModificationDate
                ? `${moment(
                    selectedDispositif.lastAdminModificationDate
                  ).format("LLL")} soit ${moment(
                    selectedDispositif.lastAdminModificationDate
                  ).fromNow()}`
                : "Non disponible"}
              <Title>Structure responsable</Title>
              {selectedDispositif.mainSponsor && (
                <StructureContainer>
                  {selectedDispositif.mainSponsor.nom}
                  <LogoContainer spaceBetween={true}>
                    {selectedDispositif.mainSponsor &&
                      selectedDispositif.mainSponsor.picture &&
                      selectedDispositif.mainSponsor.picture.secure_url && (
                        <img
                          className="sponsor-img"
                          src={
                            (selectedDispositif.mainSponsor.picture || {})
                              .secure_url
                          }
                          alt={selectedDispositif.mainSponsor.nom}
                        />
                      )}
                    <div>
                      <FButton
                        name="edit-outline"
                        type="outline-black"
                        onClick={() => props.setShowChangeStructureModal(true)}
                      >
                        Modifier
                      </FButton>
                    </div>
                  </LogoContainer>
                </StructureContainer>
              )}
              {!selectedDispositif.mainSponsor && (
                <StructureContainer noStructure={true}>
                  Aucune structure définie !
                  <LogoContainer spaceBetween={true}>
                    <img className="sponsor-img" src={noStructure} />

                    <div>
                      <FButton name="edit-outline" type="outline-black">
                        Choisir
                      </FButton>
                    </div>
                  </LogoContainer>
                </StructureContainer>
              )}
            </RightPart>
          </RowContainer>
          <ButtonsContainer>
            <div>
              <FButton
                className="mr-8"
                type="dark"
                tag={"a"}
                href={burl}
                target="_blank"
                rel="noopener noreferrer"
                name="external-link"
              >
                Voir la fiche
              </FButton>
              <FButton
                type="error"
                onClick={props.onDeleteClick}
                name="trash-2"
              >
                Supprimer
              </FButton>
            </div>
            <div>
              <FButton
                className="mr-8"
                type="white"
                onClick={props.toggleModal}
                name="close-outline"
              >
                Annuler
              </FButton>
              <FButton type="validate" name="checkmark-outline">
                Enregistrer
              </FButton>
            </div>
          </ButtonsContainer>
        </MainContainer>
      </Modal>
    );
  }
  return <div />;
};
