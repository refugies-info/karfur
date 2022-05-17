import React, { useState, useEffect, useCallback } from "react";
import {
  Responsable,
  Log,
} from "types/interface";
import Image from "next/image";
import { withRouter, RouteComponentProps } from "react-router-dom";
import moment from "moment";
import "moment/locale/fr";
import FButton from "components/UI/FButton/FButton";
import API from "utils/API";
import noStructure from "assets/noStructure.png";
import { ObjectId } from "mongodb";
import {
  correspondingStatus,
  publicationStatus,
  progressionStatus,
} from "../data";
import { allDispositifsSelector } from "services/AllDispositifs/allDispositifs.selector";
import {
  Date,
  Label,
} from "../../sharedComponents/SubComponents";
import { useSelector, useDispatch } from "react-redux";
import {
  allStructuresSelector,
  structureSelector,
} from "services/AllStructures/allStructures.selector";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import {
  setAllStructuresActionCreator,
} from "services/AllStructures/allStructures.actions";
import { DetailsModal } from "../../sharedComponents/DetailsModal";
import useRouterLocale from "hooks/useRouterLocale";
import { UserButton } from "../../sharedComponents/UserButton";
import { LogList } from "../../Logs/LogList";
import { StatusRow } from "../../sharedComponents/StatusRow";
import { NotesInput } from "../../sharedComponents/NotesInput";
import { SmallDispositif } from "../../sharedComponents/SmallDispositif";
import { getStructureWithAllInformationRequired } from "./functions";
import styles from "./StructureDetailsModal.module.scss";
import Swal from "sweetalert2";
import { colors } from "colors";

moment.locale("fr");
interface Props extends RouteComponentProps {
  show: boolean;
  toggleModal: () => void;
  toggleRespoModal: () => void;
  selectedStructureId: ObjectId | null;
  setSelectedUserIdAndToggleModal: (element: Responsable | null) => void;
  setSelectedContentIdAndToggleModal: (
    element: ObjectId | null,
    status: string | null
  ) => void;
}

const StructureDetailsModalComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const routerLocale = useRouterLocale();
  const selectedStructureId = props.selectedStructureId;
  const dispatch = useDispatch();

  const structure = useSelector(structureSelector(props.selectedStructureId));
  const [adminComments, setAdminComments] = useState<string>(
    structure?.adminComments || ""
  );
  const [adminCommentsSaved, setAdminCommentsSaved] = useState(false);
  const [currentId, setCurrentId] = useState<ObjectId | null>(null);
  const [logs, setLogs] = useState<Log[]>([]);

  const allStructures = useSelector(allStructuresSelector);
  const allDispositifs = useSelector(allDispositifsSelector);

  const updateLogs = useCallback(() => {
    if (selectedStructureId) {
      API.logs(selectedStructureId).then((res) => {
        setLogs(res.data.data);
      });
    }
  }, [selectedStructureId]);

  useEffect(() => {
    if (structure && currentId !== selectedStructureId) {
      setAdminComments(structure.adminComments || "");
      setAdminCommentsSaved(false);
      setCurrentId(selectedStructureId);
    }
    updateLogs();
  }, [structure, currentId, selectedStructureId, updateLogs]);

  const updateStructuresStore = (
    structureId: ObjectId,
    property:
      | "adminComments"
      | "status"
      | "adminProgressionStatus"
      | "adminPercentageProgressionStatus",
    value: string
  ) => {
    const structures = [...allStructures];
    const newStructure = structures.find((s) => s._id === structureId);
    if (newStructure) newStructure[property] = value;
    dispatch(setAllStructuresActionCreator(structures));
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
      | "adminComments"
  ) => {
    if (structure && newStatus !== structure[property]) {
      if (property === "status" && newStatus === "Supprimé") {
        const res = await Swal.fire({
          title: "Êtes-vous sûr ?",
          text: "Souhaitez-vous supprimer cette structure",
          type: "question",
          showCancelButton: true,
          confirmButtonColor: colors.rouge,
          cancelButtonColor: colors.vert,
          confirmButtonText: "Oui, la supprimer",
          cancelButtonText: "Annuler",
        });
        if (!res.value) return;
      }

      const queryStructure = {
        query: {
          _id: structure._id,
          [property]: newStatus,
        },
      };

      await API.updateStructure(queryStructure);
      updateStructuresStore(structure._id, property, newStatus);
    }
  };

  const isLoadingStructures = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES)
  );
  const isLoadingDispositifs = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS)
  );

  const isLoading = isLoadingDispositifs || isLoadingStructures;
  const secureUrl = structure?.picture?.secure_url;
  const dispositifsWithAllInformation = getStructureWithAllInformationRequired(
    structure?.dispositifsIds || [],
    allDispositifs
  );

  if (structure) {
    return (
      <DetailsModal
        show={props.show}
        toggleModal={props.toggleModal}
        isLoading={isLoading}
        leftHead={
          <>
            <Image
              src={secureUrl || noStructure}
              alt=""
              width={140}
              height={60}
              objectFit="contain"
            />
            <h2>{`${structure.acronyme ? structure.acronyme + " - " : ""}${structure.nom}`}</h2>
          </>
        }
        rightHead={
          <>
            <FButton
              className="mr-8"
              type="dark"
              name="person-outline"
              onClick={() => {
                props.history.push({
                  pathname:
                    routerLocale + "/backend/user-dash-structure-selected",
                  search: `?id=${structure._id}`,
                });
              }}
            >
              Membres
            </FButton>
            {structure && structure.status === "Actif" && (
              <FButton
                className="mr-8"
                type="dark"
                name="eye-outline"
                tag={"a"}
                href={`/annuaire/${structure._id}`}
                target="_blank"
              >
                Annuaire
              </FButton>
            )}
            <FButton
              className="mr-8"
              type="white"
              onClick={props.toggleModal}
              name="close-outline"
            ></FButton>
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
                  props.setSelectedUserIdAndToggleModal(structure.createur);
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
                    props.setSelectedUserIdAndToggleModal(structure.responsable);
                  } else {
                    props.toggleRespoModal();
                  }
                }}
              />
            </div>

            <Label>Notes internes</Label>
            <NotesInput
              adminComments={adminComments}
              onNotesChange={onNotesChange}
              saveAdminComments={() =>
                modifyStatus(adminComments, "adminComments")
              }
              adminCommentsSaved={adminCommentsSaved}
              oldComments={structure?.adminComments || ""}
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
                      props.setSelectedContentIdAndToggleModal(
                        dispositif._id,
                        dispositif.status
                      );
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
            <LogList logs={logs} />
          </div>
        </div>
      </DetailsModal>
    );
  }
  return <div />;
};

export const StructureDetailsModal = withRouter(StructureDetailsModalComponent);
