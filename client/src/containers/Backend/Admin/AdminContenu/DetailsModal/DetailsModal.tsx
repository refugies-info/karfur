import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal, Input, Spinner } from "reactstrap";
import "./DetailsModal.scss";
import {
  TypeContenu,
  StyledStatus,
} from "../../sharedComponents/SubComponents";
import FButton from "../../../../../components/FigmaUI/FButton/FButton";
import { correspondingStatus, progressionData } from "../data";
import { compare } from "../AdminContenu";
import moment from "moment/min/moment-with-locales";
import {
  SimplifiedDispositif,
  SimplifiedStructureForAdmin,
} from "../../../../../types/interface";
import { colors } from "colors";
import marioProfile from "../../../../../assets/mario-profile.jpg";
import noStructure from "../../../../../assets/noStructure.png";
import { useSelector, useDispatch } from "react-redux";
import { dispositifSelector } from "../../../../../services/AllDispositifs/allDispositifs.selector";
import API from "../../../../../utils/API";
import { fetchAllDispositifsActionsCreator } from "../../../../../services/AllDispositifs/allDispositifs.actions";
import { ObjectId } from "mongodb";
import { LoadingStatusKey } from "../../../../../services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "../../../../../services/LoadingStatus/loadingStatus.selectors";

interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedDispositifId: ObjectId | null;
  onDeleteClick: () => void;
  setShowChangeStructureModal: (arg: boolean) => void;
  toggleImprovementsMailModal: () => void;
  toggleNeedsChoiceModal: () => void;
  setSelectedUserIdAndToggleModal: (element: any) => void;
  setSelectedStructureIdAndToggleModal: (
    element: SimplifiedStructureForAdmin | null
  ) => void;
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
    props.noStructure ? colors.erreur : colors.blancSimple};
  border-radius: 12px;
  display: flex;
  flex-direction: column;
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  padding: 16px;
  cursor: pointer;
`;
const TitleSponsorContainer = styled.div`
  text-decoration: underline;
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
  background: ${colors.blancSimple};
  display: flex;
  flex-direction: row;
  width: fit-content;
  align-items: center;
  cursor: pointer;
`;

moment.locale("fr");
const statusModifiable = ["En attente", "En attente admin", "Brouillon"];

export const DetailsModal = (props: Props) => {
  const selectedDispositifId = props.selectedDispositifId;

  const [modifiedStatus, setModifiedStatus] = useState<string | null>(null);
  const [adminComments, setAdminComments] = useState<string>("");
  const [adminProgressionStatusGroup1, setAdminProgressionStatusGroup1] =
    useState<string | null>(null);
  const [adminProgressionStatusGroup2, setAdminProgressionStatusGroup2] =
    useState<string | null>(null);

  const dispatch = useDispatch();

  const dispositif = useSelector(dispositifSelector(selectedDispositifId));
  useEffect(() => {
    if (dispositif) {
      if (dispositif.adminComments) {
        setAdminComments(dispositif.adminComments);
      } else {
        setAdminComments("");
      }

      if (dispositif.adminProgressionStatus) {
        setAdminProgressionStatusGroup1(dispositif.adminProgressionStatus);
      } else {
        setAdminProgressionStatusGroup1("Nouveau !");
      }
      if (dispositif.adminPercentageProgressionStatus) {
        setAdminProgressionStatusGroup2(
          dispositif.adminPercentageProgressionStatus
        );
      } else {
        setAdminProgressionStatusGroup2(null);
      }
    }
  }, [dispositif]);

  const getCreatorImage = (selectedDispositif: SimplifiedDispositif) =>
    selectedDispositif &&
    selectedDispositif.creatorId &&
    selectedDispositif.creatorId.picture &&
    selectedDispositif.creatorId.picture.secure_url
      ? selectedDispositif.creatorId.picture.secure_url
      : marioProfile;

  const modifyStatus = (newStatus: string) => {
    if (statusModifiable.includes(newStatus)) {
      return setModifiedStatus(newStatus);
    }
  };
  const onNotesChange = (e: any) => setAdminComments(e.target.value);

  const modifyProgressionStatus = (status: any) => {
    if (status.group === 1) {
      return setAdminProgressionStatusGroup1(status.storedStatus);
    }
    return setAdminProgressionStatusGroup2(status.storedStatus);
  };
  const toggle = () => {
    setModifiedStatus(null);
    props.toggleModal();
  };
  const onSaveClick = async (dispositif: SimplifiedDispositif) => {
    if (modifiedStatus && modifiedStatus !== dispositif.status) {
      const newDispositif = {
        dispositifId: dispositif._id,
        status: modifiedStatus,
      };
      await API.updateDispositifStatus({ query: newDispositif });
    }
    await API.updateDispositifAdminComments({
      query: {
        dispositifId: dispositif._id,
        adminComments,
        adminProgressionStatus: adminProgressionStatusGroup1,
        adminPercentageProgressionStatus: adminProgressionStatusGroup2,
      },
    });
    dispatch(fetchAllDispositifsActionsCreator());
    toggle();
  };

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS)
  );

  if (isLoading) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        className="details-modal"
      >
        <Spinner />
      </Modal>
    );
  }

  if (dispositif) {
    const burl =
      "/" + (dispositif.typeContenu || "dispositif") + "/" + dispositif._id;
    return (
      <Modal
        isOpen={props.show}
        toggle={toggle}
        size="lg"
        className="details-modal"
      >
        <MainContainer>
          <RowContainer>
            <LeftPart>
              <TitreInformatif>{dispositif.titreInformatif}</TitreInformatif>
              <RowContainer>
                {dispositif.titreMarque && (
                  <TitreMarque>
                    <span style={{ color: colors.cardColor }}>avec </span>
                    {dispositif.titreMarque}
                  </TitreMarque>
                )}
                <TypeContenu
                  type={dispositif.typeContenu}
                  isDetailedVue={true}
                />
              </RowContainer>
              <Title>Statut</Title>
              <RowContainer>
                {correspondingStatus.sort(compare).map((status) => {
                  const newStatus = modifiedStatus || dispositif.status;

                  return (
                    <div
                      key={status.storedStatus}
                      style={{
                        marginRight: "8px",
                        marginTop: "4px",
                        marginBottom: "4px",
                      }}
                      onClick={() => modifyStatus(status.storedStatus)}
                    >
                      <StyledStatus
                        text={status.storedStatus}
                        overrideColor={newStatus !== status.storedStatus}
                        textToDisplay={status.displayedStatus}
                        color={status.color}
                        disabled={
                          !statusModifiable.includes(status.storedStatus)
                        }
                      />
                    </div>
                  );
                })}
              </RowContainer>
              <Title>Dernière mise à jour</Title>
              {dispositif.lastModificationDate
                ? `${moment(dispositif.lastModificationDate).format(
                    "LLL"
                  )} soit ${moment(dispositif.lastModificationDate).fromNow()}`
                : "Non disponible"}
              <Title>Date de publication</Title>
              {dispositif.publishedAt && dispositif.status === "Actif"
                ? `${moment(dispositif.publishedAt).format(
                    "LLL"
                  )} soit ${moment(dispositif.publishedAt).fromNow()}`
                : "Non disponible"}
              <Title>Date de création</Title>
              {`${moment(dispositif.created_at).format("LLL")} soit ${moment(
                dispositif.created_at
              ).fromNow()}`}
              {dispositif.status === "Actif" && (
                <>
                  {" "}
                  <Title>Envoi relance mise à jour</Title>
                  {dispositif.lastReminderMailSentToUpdateContentDate
                    ? moment(
                        dispositif.lastReminderMailSentToUpdateContentDate
                      ).format("LLL") +
                      " soit " +
                      moment(
                        dispositif.lastReminderMailSentToUpdateContentDate
                      ).fromNow()
                    : "Non envoyé"}
                </>
              )}
              <Title>Créateur</Title>
              <CreatorContainer
                onClick={() => {
                  props.toggleModal();
                  props.setSelectedUserIdAndToggleModal(dispositif.creatorId);
                }}
              >
                <img
                  className="creator-img"
                  src={getCreatorImage(dispositif)}
                />
                {dispositif.creatorId && dispositif.creatorId.username}
              </CreatorContainer>
              {dispositif.status === "Brouillon" && (
                <>
                  <Title>Envoi relance brouillon</Title>
                  {dispositif.draftReminderMailSentDate
                    ? `Envoyé le : ${moment(
                        dispositif.draftReminderMailSentDate
                      ).format("LLL")}`
                    : !dispositif.creatorId || !dispositif.creatorId.email
                    ? "Non envoyé (pas de mail renseigné)"
                    : "Non envoyé"}
                </>
              )}
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
                    onClick={() => modifyProgressionStatus(status)}
                  >
                    <StyledStatus
                      text={status.storedStatus}
                      textToDisplay={status.displayedStatus}
                      color={status.color}
                      textColor={status.textColor}
                      overrideColor={
                        status.storedStatus !== adminProgressionStatusGroup1 &&
                        status.storedStatus !== adminProgressionStatusGroup2
                      }
                    />
                  </div>
                ))}
              </RowContainer>
              <Title>Notes</Title>
              <Input
                type="textarea"
                placeholder="Rédigez un court paragraphe sur votre structure"
                rows={5}
                value={adminComments}
                onChange={onNotesChange}
                id="note"
              />
              <Title>Dernière action d'administrateur</Title>
              {dispositif.lastAdminUpdate
                ? `${moment(dispositif.lastAdminUpdate).format(
                    "LLL"
                  )} soit ${moment(dispositif.lastAdminUpdate).fromNow()}`
                : "Non disponible"}
              <Title>Structure responsable</Title>
              {dispositif.mainSponsor && (
                <StructureContainer
                  onClick={() => {
                    props.setSelectedStructureIdAndToggleModal(
                      //@ts-ignore
                      dispositif.mainSponsor
                    );
                    props.toggleModal();
                  }}
                >
                  <TitleSponsorContainer>
                    {dispositif.mainSponsor.nom}
                  </TitleSponsorContainer>

                  <LogoContainer spaceBetween={true}>
                    {dispositif.mainSponsor &&
                      dispositif.mainSponsor.picture &&
                      dispositif.mainSponsor.picture.secure_url && (
                        <img
                          className="sponsor-img"
                          src={
                            (dispositif.mainSponsor.picture || {}).secure_url
                          }
                          alt={dispositif.mainSponsor.nom}
                        />
                      )}
                    <div>
                      <FButton
                        name="edit-outline"
                        type="outline-black"
                        onClick={(e: any) => {
                          e.stopPropagation();
                          props.setShowChangeStructureModal(true);
                        }}
                      >
                        Modifier
                      </FButton>
                    </div>
                  </LogoContainer>
                </StructureContainer>
              )}
              {!dispositif.mainSponsor && (
                <StructureContainer noStructure={true}>
                  Aucune structure définie !
                  <LogoContainer spaceBetween={true}>
                    <img className="sponsor-img" src={noStructure} />

                    <div>
                      <FButton
                        name="edit-outline"
                        type="outline-black"
                        onClick={() => props.setShowChangeStructureModal(true)}
                      >
                        Choisir
                      </FButton>
                    </div>
                  </LogoContainer>
                </StructureContainer>
              )}
              {["En attente admin", "En attente", "Accepté structure"].includes(
                dispositif.status
              ) &&
                dispositif.typeContenu === "dispositif" && (
                  <>
                    <Title>Mail d'amélioration</Title>
                    <FButton
                      type="dark"
                      name="email-outline"
                      onClick={props.toggleImprovementsMailModal}
                    >
                      Demander des changements
                    </FButton>
                  </>
                )}
              <div style={{ marginTop: 12 }}>
                <FButton type="dark" onClick={props.toggleNeedsChoiceModal}>
                  Gérer les besoins
                </FButton>
              </div>
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
                onClick={toggle}
                name="close-outline"
              >
                Annuler
              </FButton>
              <FButton
                type="validate"
                name="checkmark-outline"
                onClick={() => onSaveClick(dispositif)}
              >
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
