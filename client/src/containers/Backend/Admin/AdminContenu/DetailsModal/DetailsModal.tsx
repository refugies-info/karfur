import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Modal, Input, Spinner, Row, Col } from "reactstrap";
import Image from "next/image";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import "moment/locale/fr";
import { ObjectId } from "mongodb";
import {
  TypeContenu,
  StyledStatus,
} from "../../sharedComponents/SubComponents";
import FButton from "components/UI/FButton/FButton";
import { correspondingStatus, progressionData, publicationData } from "../data";
import { statusCompare } from "lib/statusCompare";
import {
  SimplifiedStructureForAdmin,
} from "types/interface";
import { colors } from "colors";
import {
  allDispositifsSelector,
  dispositifSelector,
} from "services/AllDispositifs/allDispositifs.selector";
import API from "utils/API";
import { setAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import marioProfile from "assets/mario-profile.jpg";
import noStructure from "assets/noStructure.png";
import styles from "./DetailsModal.module.scss";
import { cls } from "lib/classname";

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
moment.locale("fr");

export const DetailsModal = (props: Props) => {
  const selectedDispositifId = props.selectedDispositifId;

  const [adminComments, setAdminComments] = useState<string>("");
  const [adminCommentsSaved, setAdminCommentsSaved] = useState(false);
  const [currentId, setCurrentId] = useState(props.selectedDispositifId);
  const dispatch = useDispatch();

  const dispositif = useSelector(dispositifSelector(selectedDispositifId));
  const allDispositifs = useSelector(allDispositifsSelector);
  useEffect(() => {
    if (dispositif && currentId !== selectedDispositifId) {
      setAdminComments(dispositif.adminComments || "");
      setAdminCommentsSaved(false);
      setCurrentId(selectedDispositifId);
    }
  }, [dispositif, currentId, selectedDispositifId]);

  const updateDispositifsStore = (
    dispositifId: ObjectId,
    property:
      | "adminComments"
      | "status"
      | "adminProgressionStatus"
      | "adminPercentageProgressionStatus",
    value: string
  ) => {
    const dispositifs = [...allDispositifs];
    const newDispositif = dispositifs.find((d) => d._id === dispositifId);
    if (newDispositif) newDispositif[property] = value;
    dispatch(setAllDispositifsActionsCreator(dispositifs));
  };
  const onNotesChange = (e: any) => {
    if (adminCommentsSaved) setAdminCommentsSaved(false);
    setAdminComments(e.target.value);
  }

  const modifyStatus = async (
    newStatus: string,
    property:
      | "status"
      | "adminProgressionStatus"
      | "adminPercentageProgressionStatus"
  ) => {
    if (dispositif && newStatus !== dispositif[property]) {
      if (property === "status" && newStatus === "Supprimé") {
        props.onDeleteClick();
        return;
      }

      const queryDispositif = {
        query: {
          dispositifId: dispositif._id,
          [property]: newStatus,
        }
      };

      if (property === "status") {
        await API.updateDispositifStatus(queryDispositif);
      } else {
        await API.updateDispositifAdminComments(queryDispositif);
      }
      updateDispositifsStore(dispositif._id, property, newStatus);
    }
  };
  const saveAdminComments = async () => {
    if (!dispositif) return;
    await API.updateDispositifAdminComments({
      query: {
        dispositifId: dispositif._id,
        adminComments,
      },
    });
    setAdminCommentsSaved(true);
    updateDispositifsStore(dispositif._id, "adminComments", adminComments);
  };

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS)
  );

  const getButtonColor = () => {
    if (adminCommentsSaved) return "saved";
    const oldComments = dispositif?.adminComments || "";
    if (oldComments !== adminComments) return "modified";
    return "dark";
  };

  const hiddenStatus = [
    "En attente non prioritaire",
    "Rejeté structure",
    "Accepté structure",
  ];

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
        toggle={props.toggleModal}
        size="xl"
        className={styles.modal}
        contentClassName={styles.modal_content}
      >
        <Row>
          <Col className={styles.title}>
            <TypeContenu type={dispositif.typeContenu} isDetailedVue={true} />
            <h2 className={styles.title}>
              {dispositif.titreInformatif}
              <span style={{ color: colors.gray70 }}> avec </span>
              {dispositif.titreMarque}
            </h2>
          </Col>

          <Col className="text-right">
            {["En attente admin", "En attente", "Accepté structure"].includes(
              dispositif.status
            ) &&
              dispositif.typeContenu === "dispositif" && (
                <FButton
                  className="mr-2"
                  type="dark"
                  name="email-outline"
                  onClick={props.toggleImprovementsMailModal}
                >
                  Demande
                </FButton>
              )}
            <FButton
              className="mr-2"
              type="dark"
              name="options-2-outline"
              onClick={props.toggleNeedsChoiceModal}
            >
              Catégories
            </FButton>
            <FButton
              className="mr-2"
              type="dark"
              tag={"a"}
              href={burl}
              target="_blank"
              rel="noopener noreferrer"
              name="eye-outline"
            >
              Voir
            </FButton>
            <FButton
              className="mr-8"
              type="white"
              onClick={props.toggleModal}
              name="close-outline"
            ></FButton>
          </Col>
        </Row>

        <div className={styles.status_row}>
          <div>
            <p className={styles.label}>Statut de la fiche</p>
            <div className="d-flex">
              {correspondingStatus.sort(statusCompare).map((status) => {
                if (
                  hiddenStatus.includes(status.storedStatus) && // hide some status
                  status.storedStatus !== dispositif.status
                )
                  return null;

                return (
                  <div
                    className="mr-2"
                    key={status.storedStatus}
                    onClick={() => modifyStatus(status.storedStatus, "status")}
                  >
                    <StyledStatus
                      text={status.storedStatus}
                      overrideColor={status.storedStatus !== dispositif.status}
                      textToDisplay={status.displayedStatus}
                      color={status.color}
                      disabled={status.storedStatus === dispositif.status}
                    />
                  </div>
                );
              })}
            </div>
          </div>

          <div>
            <p className={styles.label}>Statut de publication</p>
            <div className="d-flex">
              {publicationData.map((status) => (
                <div
                  key={status.storedStatus}
                  className="mr-2"
                  onClick={() =>
                    modifyStatus(status.storedStatus, "adminProgressionStatus")
                  }
                >
                  <StyledStatus
                    text={status.storedStatus}
                    textToDisplay={status.displayedStatus}
                    color={status.color}
                    textColor={status.textColor}
                    overrideColor={
                      status.storedStatus !== dispositif.adminProgressionStatus
                    }
                    disabled={status.storedStatus === dispositif.adminProgressionStatus}
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <p className={styles.label}>Progression</p>
            <div className="d-flex">
              {progressionData.map((status) => (
                <div
                  key={status.storedStatus}
                  className="mr-2"
                  onClick={() =>
                    modifyStatus(
                      status.storedStatus,
                      "adminPercentageProgressionStatus"
                    )
                  }
                >
                  <StyledStatus
                    text={status.storedStatus}
                    textToDisplay={status.displayedStatus}
                    color={status.color}
                    textColor={status.textColor}
                    overrideColor={
                      status.storedStatus !==
                      dispositif.adminPercentageProgressionStatus
                    }
                    disabled={status.storedStatus === dispositif.adminPercentageProgressionStatus}
                  />
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className={styles.details_row}>
          <div className={styles.col_1}>
            <Row className="mb-5">
              <Col>
                <p className={styles.label}>Dernière mise à jour</p>
                <p className={styles.text}>
                  {dispositif.lastModificationDate
                    ? `${moment(dispositif.lastModificationDate).format(
                        "LLL"
                      )} soit ${moment(
                        dispositif.lastModificationDate
                      ).fromNow()}`
                    : "Non disponible"}
                </p>
              </Col>
              <Col>
                <p className={styles.label}>Date de publication</p>
                <p className={styles.text}>
                  {dispositif.publishedAt && dispositif.status === "Actif"
                    ? `${moment(dispositif.publishedAt).format(
                        "LLL"
                      )} soit ${moment(dispositif.publishedAt).fromNow()}`
                    : "Non disponible"}
                </p>
              </Col>
            </Row>

            <div className="mb-5">
              <div className="d-flex justify-content-between">
                <p className={styles.label}>Création</p>
                <p className={styles.text}>
                  {`${moment(dispositif.created_at).format(
                    "LLL"
                  )} soit ${moment(dispositif.created_at).fromNow()}`}
                </p>
              </div>
              <div
                className={styles.white_container}
                onClick={() => {
                  props.toggleModal();
                  props.setSelectedUserIdAndToggleModal(dispositif.creatorId);
                }}
              >
                <Image
                  className={styles.creator_img}
                  src={
                    dispositif.creatorId?.picture?.secure_url || marioProfile
                  }
                  alt="creator image"
                  width={20}
                  height={20}
                  objectFit="contain"
                />
                {dispositif.creatorId && (
                  <p className={styles.text}>
                    <strong className="mx-1">
                      {dispositif.creatorId.username}
                    </strong>
                    {"| "}
                    {dispositif.creatorId.email}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-5">
              <p className={styles.label}>Structure responsable</p>
              {dispositif.mainSponsor && (
                <div className="d-flex">
                  <div
                    className={styles.white_container}
                    onClick={() => {
                      props.setSelectedStructureIdAndToggleModal(
                        //@ts-ignore
                        dispositif.mainSponsor
                      );
                      props.toggleModal();
                    }}
                  >
                    {dispositif?.mainSponsor?.picture?.secure_url && (
                      <Image
                        className={styles.sponsor_img}
                        src={(dispositif.mainSponsor.picture || {}).secure_url}
                        alt={dispositif.mainSponsor.nom}
                        width={95}
                        height={30}
                        objectFit="contain"
                      />
                    )}
                    <p className={cls(styles.text, "ml-1 ")}>
                      {dispositif.mainSponsor.nom}
                    </p>
                    <span className="ml-auto">
                      <StyledStatus
                        text={dispositif.mainSponsor.status}
                        textToDisplay={dispositif.mainSponsor.status}
                        disabled={true}
                      />
                    </span>
                  </div>
                  <FButton
                    className="ml-1"
                    name="edit-outline"
                    type="dark"
                    onClick={(e: any) => {
                      e.stopPropagation();
                      props.setShowChangeStructureModal(true);
                    }}
                  ></FButton>
                </div>
              )}
              {!dispositif.mainSponsor && (
                <div className="d-flex">
                  <div className={styles.white_container}>
                    <Image
                      className={styles.sponsor_img}
                      src={noStructure}
                      alt="no structure"
                    />

                    <p className={cls(styles.text, "ml-1")}>
                      Aucune structure définie !
                    </p>
                  </div>
                  <FButton
                    className="ml-1"
                    name="edit-outline"
                    type="dark"
                    onClick={() => props.setShowChangeStructureModal(true)}
                  ></FButton>
                </div>
              )}
            </div>
          </div>
          <div className={styles.col_2}>
            <p className={styles.label}>Notes internes sur la fiche</p>
            <Input
              type="textarea"
              placeholder="Note sur la fiche ..."
              rows={5}
              maxLength={3000}
              value={adminComments}
              onChange={onNotesChange}
              id="note"
              className={styles.input}
            />
            <FButton
              name="save-outline"
              type={getButtonColor()}
              onClick={saveAdminComments}
              className="mt-1 w-100"
            >
              {!adminCommentsSaved ? "Enregistrer" : "Enregistré !"}
            </FButton>
          </div>
          <div>
            <p className={styles.label}>Journal d'activité</p>
          </div>
        </div>
      </Modal>
    );
  }
  return <div />;
};
