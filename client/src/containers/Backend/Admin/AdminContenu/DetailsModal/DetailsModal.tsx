import React, { useState, useEffect, useCallback } from "react";
import { Modal, Input, Spinner, Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import "moment/locale/fr";
import { ObjectId } from "mongodb";
import FButton from "components/UI/FButton/FButton";
import { correspondingStatus, progressionData, publicationData } from "../data";
import { statusCompare } from "lib/statusCompare";
import { Log, SimplifiedStructureForAdmin } from "types/interface";
import { colors } from "colors";
import {
  allDispositifsSelector,
  dispositifSelector,
} from "services/AllDispositifs/allDispositifs.selector";
import API from "utils/API";
import { setAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import styles from "./DetailsModal.module.scss";
import { structureSelector } from "services/AllStructures/allStructures.selector";
import { allUsersSelector } from "services/AllUsers/allUsers.selector";
import { UserButton } from "../../sharedComponents/UserButton";
import { findUser } from "./functions";
import { StructureButton } from "../../sharedComponents/StructureButton";
import {
  TypeContenu,
  StyledStatus,
  Date,
} from "../../sharedComponents/SubComponents";
import { LogList } from "../../Logs/LogList";

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
  const dispatch = useDispatch();

  const dispositif = useSelector(dispositifSelector(selectedDispositifId));
  const [adminComments, setAdminComments] = useState<string>(
    dispositif?.adminComments || ""
  );
  const [adminCommentsSaved, setAdminCommentsSaved] = useState(false);
  const [currentId, setCurrentId] = useState<ObjectId|null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  const structure = useSelector(
    structureSelector(dispositif?.mainSponsor?._id || null)
  );
  const allDispositifs = useSelector(allDispositifsSelector);
  const allUsers = useSelector(allUsersSelector);

  const updateLogs = useCallback(() => {
    if (selectedDispositifId) {
      API.logs(selectedDispositifId).then(res => {
        setLogs(res.data.data)
      });
    }
  }, [selectedDispositifId]);

  useEffect(() => {
    if (dispositif && currentId !== selectedDispositifId) {
      setAdminComments(dispositif.adminComments || "");
      setAdminCommentsSaved(false);
      setCurrentId(selectedDispositifId);
    }
    updateLogs();
  }, [dispositif, currentId, selectedDispositifId, updateLogs]);

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
    updateLogs();
  };

  const onNotesChange = (e: any) => {
    if (adminCommentsSaved) setAdminCommentsSaved(false);
    setAdminComments(e.target.value);
  };

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
        },
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

  const moreMembers = (structure?.membres || []).length > 3;

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
                    disabled={
                      status.storedStatus === dispositif.adminProgressionStatus
                    }
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
                    disabled={
                      status.storedStatus ===
                      dispositif.adminPercentageProgressionStatus
                    }
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
                <Date date={dispositif.lastModificationDate} author={dispositif.lastModificationAuthor} />
              </Col>
              <Col>
                <p className={styles.label}>Date de publication</p>
                <Date
                  date={
                    dispositif.status !== "Actif"
                      ? undefined
                      : dispositif.publishedAt
                  }
                  author={dispositif.publishedAtAuthor}
                />
              </Col>
            </Row>

            <div className="mb-5">
              <div className="d-flex justify-content-between">
                <p className={styles.label}>Création</p>
                <Date date={dispositif.created_at} />
              </div>
              <UserButton
                user={dispositif.creatorId}
                onClick={() => {
                  props.toggleModal();
                  props.setSelectedUserIdAndToggleModal(dispositif.creatorId);
                }}
              />
            </div>

            <div className="mb-5">
              <p className={styles.label}>Structure responsable</p>
              <div className="d-flex">
                <StructureButton
                  sponsor={dispositif.mainSponsor}
                  onClick={() => {
                    if (!dispositif.mainSponsor) return;
                    //@ts-ignore
                    props.setSelectedStructureIdAndToggleModal(dispositif.mainSponsor);
                    props.toggleModal();
                  }}
                />
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
            </div>

            {structure && (
              <>
                <div className="mb-5">
                  <p className={styles.label}>Premier responsable</p>
                  <UserButton
                    user={structure.responsable}
                    onClick={() => {
                      props.toggleModal();
                      props.setSelectedUserIdAndToggleModal(
                        structure.responsable
                      );
                    }}
                  />
                </div>

                <div>
                  <p className={styles.label}>Autres responsables</p>
                  <Row noGutters>
                    {structure.membres
                      .filter((m) => m.roles.includes("administrateur"))
                      .slice(0, moreMembers ? 2 : 3)
                      .map((user, index) => (
                        <Col key={index} className="mr-1">
                          <UserButton
                            user={findUser(user.userId, allUsers)}
                            onClick={() => {
                              props.toggleModal();
                              props.setSelectedUserIdAndToggleModal({
                                _id: user.userId,
                              });
                            }}
                            condensed={true}
                          />
                        </Col>
                      ))}
                    {moreMembers && (
                      <Col>
                        <UserButton
                          text={`+ ${
                            structure.membres.length - 2
                          } responsables`}
                          condensed={true}
                          noImage={true}
                        />
                      </Col>
                    )}
                  </Row>
                </div>
              </>
            )}
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

          <div className={styles.col_3}>
            <p className={styles.label}>Journal d'activité</p>
            <LogList logs={logs} />
          </div>
        </div>
      </Modal>
    );
  }
  return <div />;
};
