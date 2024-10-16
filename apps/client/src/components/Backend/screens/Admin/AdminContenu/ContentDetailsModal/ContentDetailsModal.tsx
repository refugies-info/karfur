import {
  AdminCommentsRequest,
  DispositifStatus,
  GetAllDispositifsResponse,
  GetLogResponse,
  Id,
} from "@refugies-info/api-types";
import cloneDeep from "lodash/cloneDeep";
import moment from "moment";
import "moment/locale/fr";
import { useCallback, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Col, Row } from "reactstrap";
import Swal from "sweetalert2";
import FButton from "~/components/UI/FButton/FButton";
import { useLanguages } from "~/hooks";
import useRouterLocale from "~/hooks/useRouterLocale";
import { setAllDispositifsActionsCreator } from "~/services/AllDispositifs/allDispositifs.actions";
import { allDispositifsSelector, dispositifSelector } from "~/services/AllDispositifs/allDispositifs.selector";
import { structureSelector } from "~/services/AllStructures/allStructures.selector";
import { allUsersSelector } from "~/services/AllUsers/allUsers.selector";
import { LoadingStatusKey } from "~/services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "~/services/LoadingStatus/loadingStatus.selectors";
import API from "~/utils/API";
import { colors } from "~/utils/colors";
import { LogList } from "../../Logs/LogList";
import { DetailsModal } from "../../sharedComponents/DetailsModal";
import { NotesInput } from "../../sharedComponents/NotesInput";
import { StatusRow } from "../../sharedComponents/StatusRow";
import { StructureButton } from "../../sharedComponents/StructureButton";
import { Date, Label, TypeContenu } from "../../sharedComponents/SubComponents";
import { UserButton } from "../../sharedComponents/UserButton";
import { correspondingStatus, progressionData, publicationData } from "../data";
import styles from "./ContentDetailsModal.module.scss";
import { findUser } from "./functions";

interface Props {
  show: boolean;
  toggleModal: () => void;
  toggleRespoModal: (structureId: Id) => void;
  selectedDispositifId: Id | null;
  onDeleteClick: () => Promise<void>;
  setShowChangeStructureModal: (arg: boolean) => void;
  toggleImprovementsMailModal: () => void;
  toggleNeedsChoiceModal: () => void;
  setSelectedUserIdAndToggleModal: (userId: Id | null) => void;
  setSelectedStructureIdAndToggleModal: (structureId: Id | null) => void;
}
moment.locale("fr");

const SITE_URL = process.env.NEXT_PUBLIC_REACT_APP_SITE_URL;

export const ContentDetailsModal = (props: Props) => {
  const selectedDispositifId = props.selectedDispositifId;
  const dispatch = useDispatch();
  const routerLocale = useRouterLocale();
  const { langues } = useLanguages();

  const dispositif = useSelector(dispositifSelector(selectedDispositifId));
  const [adminComments, setAdminComments] = useState<string>(dispositif?.adminComments || "");
  const [adminCommentsSaved, setAdminCommentsSaved] = useState(false);
  const [currentId, setCurrentId] = useState<Id | null>(null);
  const [logs, setLogs] = useState<GetLogResponse[]>([]);

  const structure = useSelector(structureSelector(dispositif?.mainSponsor?._id || null));
  const allDispositifs = useSelector(allDispositifsSelector);
  const allUsers = useSelector(allUsersSelector);

  const updateLogs = useCallback(() => {
    if (selectedDispositifId) {
      API.logs(selectedDispositifId).then((res) => {
        setLogs(res);
      });
    }
  }, [selectedDispositifId]);

  useEffect(() => {
    if (dispositif && currentId !== selectedDispositifId) {
      setAdminComments(dispositif.adminComments || "");
      setAdminCommentsSaved(false);
      setCurrentId(selectedDispositifId);
      updateLogs();
    }
  }, [dispositif, currentId, selectedDispositifId, updateLogs]);

  const updateDispositifsStore = (dispositifId: Id, data: Partial<GetAllDispositifsResponse>) => {
    const dispositifs = cloneDeep(allDispositifs);
    const newDispositifs = dispositifs.map((d) => (d._id === dispositifId ? { ...d, ...data } : d));
    dispatch(setAllDispositifsActionsCreator(newDispositifs));
    updateLogs();
  };

  const onNotesChange = (e: any) => {
    if (adminCommentsSaved) setAdminCommentsSaved(false);
    setAdminComments(e.target.value);
  };

  const modifyStatus = async (
    newStatus: DispositifStatus | string,
    property: "status" | "adminProgressionStatus" | "adminPercentageProgressionStatus",
  ) => {
    if (dispositif && newStatus !== dispositif[property]) {
      if (property === "status" && newStatus === "Supprimé") {
        await props.onDeleteClick();
        updateLogs();
        return;
      }

      if (property === "status") {
        await API.updateDispositifStatus(dispositif._id, { status: newStatus as DispositifStatus });
      } else {
        const body: AdminCommentsRequest = {
          [property]: newStatus,
        };
        await API.updateDispositifAdminComments(dispositif._id.toString(), body);
      }
      updateDispositifsStore(dispositif._id, { [property]: newStatus });
    }
  };
  const saveAdminComments = async () => {
    if (!dispositif) return;
    await API.updateDispositifAdminComments(dispositif._id.toString(), { adminComments });
    setAdminCommentsSaved(true);
    updateDispositifsStore(dispositif._id, { adminComments: adminComments });
  };

  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));

  const hiddenStatus = ["Rejeté structure", "Accepté structure"];

  const sendPushNotification = async () => {
    const res = await Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous allez envoyer une notification push à tous les utilisateurs de l'application mobile abonnés à ce thème.",

      icon: "question",
      showCancelButton: true,
      confirmButtonColor: colors.rouge,
      cancelButtonColor: colors.vert,
      confirmButtonText: "Oui, envoyer",
      cancelButtonText: "Annuler",
    });

    if (!res.value || !dispositif) return;
    await API.sendNotification({ demarcheId: dispositif._id.toString() });
    updateLogs();
  };

  const toggleWebOnly = async () => {
    if (!dispositif?._id) return;
    await API.updateDispositifProperties(dispositif._id, { webOnly: !dispositif.webOnly });
    updateDispositifsStore(dispositif._id, { webOnly: !dispositif.webOnly });
  };

  const openTrad = () => {
    if (!dispositif) return;
    const path = `${SITE_URL}/fr/${dispositif.typeContenu}/${dispositif._id}/translate?language=`;
    for (const ln of langues.filter((ln) => ln.i18nCode !== "fr")) {
      window.open(`${path}${ln.i18nCode}`);
    }
  };

  const members = (structure?.membres || []).filter((m) => m.userId !== structure?.responsable?._id);

  const moreMembers = members.length > 3;

  if (dispositif) {
    const burl = "/" + (dispositif.typeContenu || "dispositif") + "/" + dispositif._id;
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
              {dispositif.typeContenu === "dispositif" && <span style={{ color: colors.gray70 }}> avec </span>}
              {dispositif.titreMarque}
            </h2>
          </>
        }
        rightHead={
          <div className="d-flex flex-nowrap justify-content-end">
            <FButton
              className="me-2"
              type={!dispositif.webOnly ? "default" : "validate"}
              name={!dispositif.webOnly ? "square-outline" : "checkmark-square-2-outline"}
              onClick={toggleWebOnly}
            >
              Web only
            </FButton>
            {dispositif.status === "Actif" && dispositif.typeContenu === "demarche" && (
              <FButton className="me-2" type="dark" name="alert-triangle-outline" onClick={sendPushNotification}>
                Push
              </FButton>
            )}
            {["En attente admin", "En attente", "Accepté structure"].includes(dispositif.status) &&
              dispositif.typeContenu === "dispositif" && (
                <FButton className="me-2" type="dark" name="email-outline" onClick={props.toggleImprovementsMailModal}>
                  Demande
                </FButton>
              )}
            <FButton className="me-2" type="dark" name="options-2-outline" onClick={props.toggleNeedsChoiceModal}>
              Catégories
            </FButton>
            {dispositif.status === DispositifStatus.ACTIVE && (
              <FButton className="me-2" type="dark" onClick={openTrad} name="globe-outline">
                Trad
              </FButton>
            )}
            <FButton
              className="me-2"
              type="dark"
              tag={"a"}
              href={burl}
              target="_blank"
              rel="noopener noreferrer"
              name="eye-outline"
            ></FButton>
            <FButton className="me-2" type="white" onClick={props.toggleModal} name="close-outline"></FButton>
          </div>
        }
      >
        <>
          <StatusRow
            title="Statut de la fiche"
            type="content"
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
                  <Date date={dispositif.lastModificationDate} author={dispositif.lastModificationAuthor} />
                </Col>
                <Col>
                  <Label>Date de publication</Label>
                  <Date
                    date={dispositif.status !== "Actif" ? undefined : dispositif.publishedAt}
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
                      props.setSelectedStructureIdAndToggleModal(dispositif.mainSponsor?._id || null);
                      props.toggleModal();
                    }}
                    additionnalProp="status"
                  />
                  <FButton
                    className="ms-1 mb-2"
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
                      text={!structure.responsable ? "Choisir un responsable" : undefined}
                      noImage={!structure.responsable}
                      onClick={() => {
                        if (structure.responsable) {
                          props.toggleModal();
                          props.setSelectedUserIdAndToggleModal(structure.responsable?._id || null);
                        } else {
                          props.toggleRespoModal(structure._id);
                        }
                      }}
                    />
                  </div>

                  {members.length > 0 && (
                    <div>
                      <Label>Autres responsables</Label>
                      <Row className="g-0">
                        {members.slice(0, moreMembers ? 2 : 3).map((user, index) => (
                          <Col key={index} className="me-1">
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
                              text={`+ ${members.length - 2} responsables`}
                              condensed={true}
                              noImage={true}
                              link={`${routerLocale}/backend/user-dash-structure-selected?id=${structure._id}`}
                            />
                          </Col>
                        )}
                      </Row>
                    </div>
                  )}
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
