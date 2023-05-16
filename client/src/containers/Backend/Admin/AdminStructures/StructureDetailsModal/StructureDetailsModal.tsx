import React, { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { withRouter, RouteComponentProps, Link } from "react-router-dom";
import moment from "moment";
import "moment/locale/fr";
import FButton from "components/UI/FButton/FButton";
import API from "utils/API";
import noStructure from "assets/noStructure.png";
import { correspondingStatus, publicationStatus, progressionStatus } from "../data";
import { allDispositifsSelector } from "services/AllDispositifs/allDispositifs.selector";
import { Date, Label } from "../../sharedComponents/SubComponents";
import { useSelector, useDispatch } from "react-redux";
import { allStructuresSelector, structureSelector } from "services/AllStructures/allStructures.selector";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { setAllStructuresActionCreator } from "services/AllStructures/allStructures.actions";
import { DetailsModal } from "../../sharedComponents/DetailsModal";
import useRouterLocale from "hooks/useRouterLocale";
import { UserButton } from "../../sharedComponents/UserButton";
import { LogList } from "../../Logs/LogList";
import { StatusRow } from "../../sharedComponents/StatusRow";
import { NotesInput } from "../../sharedComponents/NotesInput";
import { SmallDispositif } from "../../sharedComponents/SmallDispositif";
import { getDispositifsWithAllInformationRequired } from "./functions";
import styles from "./StructureDetailsModal.module.scss";
import Swal from "sweetalert2";
import { colors } from "colors";
import { useRouter } from "next/router";
import { fetchActiveStructuresActionCreator } from "services/ActiveStructures/activeStructures.actions";
import { useToggle } from "react-use";
import { GetLogResponse, Id, PatchStructureRequest, StructureStatus } from "api-types";
import { allThemesSelector } from "services/Themes/themes.selectors";

moment.locale("fr");

interface EditableH2Props {
  onValidate: (value: string) => Promise<any>;
  title: string;
}

const EditableH2 = ({ title, onValidate }: EditableH2Props) => {
  const [edition, toggleEdition] = useToggle(false);
  const [value, setValue] = useState(title);
  const _onValidate = (value: string) => onValidate(value).then(() => toggleEdition(false));
  return edition ? (
    <>
      <input onChange={(e) => setValue(e.target.value)} className="form-control" type="text" value={value} />
      <FButton disabled={value === ""} name="save-outline" onClick={() => _onValidate(value)} type="fill-dark" />
    </>
  ) : (
    <>
      <h2>{title}</h2>
      <FButton name="edit-outline" onClick={toggleEdition} type="fill-dark" />
    </>
  );
};

interface Props extends RouteComponentProps {
  show: boolean;
  toggleModal: () => void;
  toggleRespoModal: () => void;
  selectedStructureId: Id | null;
  setSelectedUserIdAndToggleModal: (userId: Id | null) => void;
  setSelectedContentIdAndToggleModal: (element: Id | null, status: string | null) => void;
}

const StructureDetailsModalComponent: React.FunctionComponent<Props> = (props: Props) => {
  const routerLocale = useRouterLocale();
  const router = useRouter();
  const selectedStructureId = props.selectedStructureId;
  const dispatch = useDispatch();

  const structure = useSelector(structureSelector(props.selectedStructureId));
  const [adminComments, setAdminComments] = useState<string>(structure?.adminComments || "");
  const [adminCommentsSaved, setAdminCommentsSaved] = useState(false);
  const [currentId, setCurrentId] = useState<Id | null>(null);
  const [logs, setLogs] = useState<GetLogResponse[]>([]);

  const allStructures = useSelector(allStructuresSelector);
  const allDispositifs = useSelector(allDispositifsSelector);
  const allThemes = useSelector(allThemesSelector);

  const updateLogs = useCallback(() => {
    if (selectedStructureId) {
      API.logs(selectedStructureId).then((res) => {
        setLogs(res);
      });
    }
  }, [selectedStructureId]);

  useEffect(() => {
    if (structure && currentId !== selectedStructureId) {
      setAdminComments(structure.adminComments || "");
      setAdminCommentsSaved(false);
      setCurrentId(selectedStructureId);
      updateLogs();
    }
  }, [structure, currentId, selectedStructureId, updateLogs]);

  const updateStructuresStore = (
    structureId: Id,
    property: "adminComments" | "status" | "adminProgressionStatus" | "adminPercentageProgressionStatus" | "nom",
    value: string,
  ) => {
    const structures = [...allStructures];
    const newStructure = structures.find((s) => s._id === structureId);
    //@ts-ignore
    if (newStructure) newStructure[property] = value;
    dispatch(setAllStructuresActionCreator(structures));
    updateLogs();
  };

  const changeNom = (nom: string) =>
    structure
      ? API.updateStructure(structure._id, { nom }).then(() => updateStructuresStore(structure._id, "nom", nom))
      : Promise.reject("No structure");

  const onNotesChange = (e: any) => {
    if (adminCommentsSaved) setAdminCommentsSaved(false);
    setAdminComments(e.target.value);
  };

  const modifyStatus = async (
    newStatus: string,
    property: "status" | "adminProgressionStatus" | "adminPercentageProgressionStatus" | "adminComments",
  ) => {
    if (structure && newStatus !== structure[property]) {
      if (property === "status" && newStatus === "Supprimé") {
        const res = await Swal.fire({
          title: "Êtes-vous sûr ?",
          text: "Souhaitez-vous supprimer cette structure",
          icon: "question",
          showCancelButton: true,
          confirmButtonColor: colors.rouge,
          cancelButtonColor: colors.vert,
          confirmButtonText: "Oui, la supprimer",
          cancelButtonText: "Annuler",
        });
        if (!res.value) return;
      }

      const queryStructure: PatchStructureRequest = {
        [property]: newStatus,
      };

      await API.updateStructure(structure._id, queryStructure);
      updateStructuresStore(structure._id, property, newStatus);

      if (property === "status") {
        // if we publish a structure, fetch active structures
        dispatch(fetchActiveStructuresActionCreator());
      }

      if (property === "adminComments") setAdminCommentsSaved(true);
    }
  };

  const isLoadingStructures = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES));
  const isLoadingDispositifs = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS));

  const isLoading = isLoadingDispositifs || isLoadingStructures;
  const secureUrl = structure?.picture?.secure_url;
  const dispositifsWithAllInformation = getDispositifsWithAllInformationRequired(
    structure?.dispositifsIds || [],
    allDispositifs,
    allThemes,
  );

  if (structure) {
    return (
      <DetailsModal
        show={props.show}
        toggleModal={props.toggleModal}
        isLoading={isLoading}
        leftHead={
          <>
            <Image src={secureUrl || noStructure} alt="" width={140} height={60} style={{ objectFit: "contain" }} />
            <EditableH2
              onValidate={changeNom}
              title={`${structure.acronyme ? structure.acronyme + " - " : ""}${structure.nom}`}
            />
          </>
        }
        rightHead={
          <>
            <FButton
              className="me-2"
              type="dark"
              name="person-outline"
              tag={Link}
              to={{
                pathname: routerLocale + "/backend/user-dash-structure-selected",
                search: `?id=${structure._id}`,
              }}
            >
              Membres
            </FButton>
            {structure && structure.status === "Actif" && (
              <FButton
                className="me-2"
                type="dark"
                name="eye-outline"
                tag={"a"}
                href={`/annuaire/${structure._id}`}
                target="_blank"
              >
                Annuaire
              </FButton>
            )}
            <FButton className="me-2" type="white" onClick={props.toggleModal} name="close-outline"></FButton>
          </>
        }
      >
        <StatusRow
          element={structure}
          status={correspondingStatus}
          publicationStatus={publicationStatus}
          progressionStatus={progressionStatus}
          modifyStatus={modifyStatus}
        />

        <div className={styles.details_row}>
          <div className={styles.col_1}>
            <div className="mb-5">
              <div className="d-flex justify-content-between">
                <Label>Création</Label>
                <Date date={structure.created_at} />
              </div>
              <UserButton
                user={structure.createur}
                onClick={() => {
                  props.toggleModal();
                  props.setSelectedUserIdAndToggleModal(structure.createur?._id || null);
                }}
              />
            </div>
            <div className="mb-5">
              <Label>Premier responsable</Label>
              <UserButton
                user={structure.responsable}
                text={!structure.responsable ? "Choisir un responsable" : ""}
                noImage={!structure.responsable}
                onClick={() => {
                  if (structure.responsable) {
                    props.toggleModal();
                    props.setSelectedUserIdAndToggleModal(structure.responsable?._id || null);
                  } else {
                    props.toggleRespoModal();
                  }
                }}
              />
            </div>

            <Label>Notes sur la structure</Label>
            <NotesInput
              adminComments={adminComments}
              onNotesChange={onNotesChange}
              saveAdminComments={() => modifyStatus(adminComments, "adminComments")}
              adminCommentsSaved={adminCommentsSaved}
              edited={(structure?.adminComments || "") !== adminComments}
            />
          </div>

          <div className={styles.col_2}>
            <Label>Fiche(s) de la structure</Label>
            <div className={styles.scrollable}>
              {dispositifsWithAllInformation?.length ? (
                dispositifsWithAllInformation.map((dispositif, index) => {
                  return (
                    <SmallDispositif
                      key={index}
                      dispositif={dispositif}
                      onClick={() => {
                        props.toggleModal();
                        props.setSelectedContentIdAndToggleModal(dispositif._id, dispositif.status);
                      }}
                    />
                  );
                })
              ) : (
                <p>Aucune fiche n'est connectée à cette structure</p>
              )}
            </div>
          </div>

          <div className={styles.col_3}>
            <Label>Journal d'activité</Label>
            <LogList
              logs={logs}
              openUserModal={props.setSelectedUserIdAndToggleModal}
              openContentModal={props.setSelectedContentIdAndToggleModal}
              openAnnuaire={(id) => router.push(`/annuaire/${id}`)}
            />
          </div>
        </div>
      </DetailsModal>
    );
  }
  return <div />;
};

export const StructureDetailsModal = withRouter(StructureDetailsModalComponent);
