import React, { useState, useEffect, useCallback } from "react";
import { Row, Col } from "reactstrap";
import { useSelector, useDispatch } from "react-redux";
import moment from "moment";
import "moment/locale/fr";
import { ObjectId } from "mongodb";
import FButton from "components/UI/FButton/FButton";
import { correspondingStatus, progressionData, publicationData } from "../data";
import { Log } from "types/interface";
import { colors } from "colors";
import {
  allDispositifsSelector,
  dispositifSelector,
} from "services/AllDispositifs/allDispositifs.selector";
import API from "utils/API";
import { setAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { structureSelector } from "services/AllStructures/allStructures.selector";
import { allUsersSelector } from "services/AllUsers/allUsers.selector";
import { UserButton } from "../../sharedComponents/UserButton";
import { findUser } from "./functions";
import { StructureButton } from "../../sharedComponents/StructureButton";
import { DetailsModal } from "../../sharedComponents/DetailsModal";
import {
  TypeContenu,
  Date,
  Label,
} from "../../sharedComponents/SubComponents";
import { LogList } from "../../Logs/LogList";
import styles from "./ContentDetailsModal.module.scss";
import { StatusRow } from "../../sharedComponents/StatusRow";
import { NotesInput } from "../../sharedComponents/NotesInput";

interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedDispositifId: ObjectId | null;
  onDeleteClick: () => void;
  setShowChangeStructureModal: (arg: boolean) => void;
  toggleImprovementsMailModal: () => void;
  toggleNeedsChoiceModal: () => void;
  setSelectedUserIdAndToggleModal: (userId: ObjectId | null) => void;
  setSelectedStructureIdAndToggleModal: (
    structureId: ObjectId | null
  ) => void;
}
moment.locale("fr");

export const ContentDetailsModal = (props: Props) => {
  const selectedDispositifId = props.selectedDispositifId;
  const dispatch = useDispatch();

  const dispositif = useSelector(dispositifSelector(selectedDispositifId));
  const [adminComments, setAdminComments] = useState<string>(
    dispositif?.adminComments || ""
  );
  const [adminCommentsSaved, setAdminCommentsSaved] = useState(false);
  const [currentId, setCurrentId] = useState<ObjectId | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  const structure = useSelector(
    structureSelector(dispositif?.mainSponsor?._id || null)
  );
  const allDispositifs = useSelector(allDispositifsSelector);
  const allUsers = useSelector(allUsersSelector);

  const updateLogs = useCallback(() => {
    if (selectedDispositifId) {
      API.logs(selectedDispositifId).then((res) => {
        setLogs(res.data.data);
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

  const hiddenStatus = [
    "En attente non prioritaire",
    "Rejeté structure",
    "Accepté structure",
  ];


  const members = (structure?.membres || [])
    .filter((m) => m.roles.includes("administrateur"))
    .filter((m) => m.userId !== structure?.responsable?._id);

  const moreMembers = members.length > 3;

  if (dispositif) {
    const burl =
      "/" + (dispositif.typeContenu || "dispositif") + "/" + dispositif._id;
    return (
      <DetailsModal
        show={props.show}
        toggleModal={props.toggleModal}
        isLoading={isLoading}
        leftHead={
          <>
            <TypeContenu type={dispositif.typeContenu} isDetailedVue={true} />
            <h2>
              {dispositif.titreInformatif}
              <span style={{ color: colors.gray70 }}> avec </span>
              {dispositif.titreMarque}
            </h2>
          </>
        }
        rightHead={
          <>
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
          </>
        }
      >
        <>
          <StatusRow
            element={dispositif}
            status={correspondingStatus}
            publicationStatus={publicationData}
            progressionStatus={progressionData}
            modifyStatus={modifyStatus}
            hiddenStatus={hiddenStatus}
          />

          <div className={styles.details_row}>
            <div className={styles.col_1}>
              <Row className="mb-5">
                <Col>
                  <Label>Dernière mise à jour</Label>
                  <Date
                    date={dispositif.lastModificationDate}
                    author={dispositif.lastModificationAuthor}
                  />
                </Col>
                <Col>
                  <Label>Date de publication</Label>
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
                  <Label>Création</Label>
                  <Date date={dispositif.created_at} />
                </div>
                <UserButton
                  user={dispositif.creatorId}
                  onClick={() => {
                    props.toggleModal();
                    props.setSelectedUserIdAndToggleModal(dispositif.creatorId?._id || null);
                  }}
                />
              </div>

              <div className="mb-5">
                <Label>Structure responsable</Label>
                <div className="d-flex">
                  <StructureButton
                    sponsor={dispositif.mainSponsor}
                    onClick={() => {
                      if (!dispositif.mainSponsor) return;
                      props.setSelectedStructureIdAndToggleModal(
                        dispositif.mainSponsor?._id || null
                      );
                      props.toggleModal();
                    }}
                    additionnalProp="status"
                  />
                  <FButton
                    className="ml-1 mb-2"
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
                    <Label>Premier responsable</Label>
                    <UserButton
                      user={structure.responsable}
                      onClick={() => {
                        props.toggleModal();
                        props.setSelectedUserIdAndToggleModal(
                          structure.responsable?._id || null
                        );
                      }}
                    />
                  </div>

                  {members.length > 0 &&
                    <div>
                      <Label>Autres responsables</Label>
                      <Row noGutters>
                        {members
                          .slice(0, moreMembers ? 2 : 3)
                          .map((user, index) => (
                            <Col key={index} className="mr-1">
                              <UserButton
                                user={findUser(user.userId, allUsers)}
                                onClick={() => {
                                  props.toggleModal();
                                  props.setSelectedUserIdAndToggleModal(user.userId);
                                }}
                                condensed={true}
                              />
                            </Col>
                          ))}
                        {moreMembers && (
                          <Col>
                            <UserButton
                              text={`+ ${
                                members.length - 2
                              } responsables`}
                              condensed={true}
                              noImage={true}
                            />
                          </Col>
                        )}
                      </Row>
                    </div>
                  }
                </>
              )}
            </div>

            <div className={styles.col_2}>
              <Label>Notes internes sur la fiche</Label>
              <NotesInput
                adminComments={adminComments}
                onNotesChange={onNotesChange}
                saveAdminComments={saveAdminComments}
                adminCommentsSaved={adminCommentsSaved}
                edited={(dispositif?.adminComments || "") !== adminComments}
              />
            </div>

            <div className={styles.col_3}>
              <Label>Journal d'activité</Label>
              <LogList
                logs={logs}
                openUserModal={props.setSelectedUserIdAndToggleModal}
                openStructureModal={props.setSelectedStructureIdAndToggleModal}
                openImprovementsModal={props.toggleImprovementsMailModal}
                openNeedsModal={props.toggleNeedsChoiceModal}
              />
            </div>
          </div>
        </>
      </DetailsModal>
    );
  }
  return <div />;
};
