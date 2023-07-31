import React, { useState } from "react";
import { Event } from "types/interface";
import { SimpleUser, StructureStatus } from "@refugies-info/api-types";
import { Modal, Input, Spinner } from "reactstrap";
import Image from "next/image";
import FInput from "components/UI/FInput/FInput";
import moment from "moment";
import "moment/locale/fr";
import FButton from "components/UI/FButton/FButton";
import API from "utils/API";
import noStructure from "assets/noStructure.png";
import { RowContainer } from "../components/AdminStructureComponents";
import { correspondingStatus } from "../data";
import { statusCompare } from "lib/statusCompare";
import { StyledStatus } from "../../sharedComponents/SubComponents";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { allActiveUsersSelector } from "services/AllUsers/allUsers.selector";
import { ChooseResponsableComponent } from "./ChooseResponsableComponent";
import { fetchAllStructuresActionsCreator } from "services/AllStructures/allStructures.actions";
import { fetchAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import { fetchAllUsersActionsCreator } from "services/AllUsers/allUsers.actions";
import styles from "./NewStructureModal.module.scss";
import { GetActiveUsersResponse, GetAllUsersResponse, PostStructureRequest } from "@refugies-info/api-types";
import { handleApiDefaultError, handleApiError } from "lib/handleApiErrors";

moment.locale("fr");

interface Props {
  defaultStatus: StructureStatus;
  show: boolean;
  toggleModal: () => void;
}

const initialStructure: PostStructureRequest = {
  nom: "",
  responsable: null,
  picture: null,
  contact: "",
  phone_contact: "",
  mail_contact: "",
  status: StructureStatus.WAITING,
};

export const NewStructureModal = (props: Props) => {
  const [structure, setStructure] = useState<PostStructureRequest>(initialStructure);
  const [responsable, setResponsable] = useState<SimpleUser | null>(null);
  const [uploading, setUploading] = useState(false);

  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_USERS));

  const activeUsers = useSelector(allActiveUsersSelector);

  const toggle = () => {
    setStructure(initialStructure);
    props.toggleModal();
  };

  const dispatch = useDispatch();

  const updateData = () => {
    dispatch(fetchAllStructuresActionsCreator());
    dispatch(fetchAllDispositifsActionsCreator());
    dispatch(fetchAllUsersActionsCreator());
  };

  const onValidate = async () => {
    try {
      if (!structure.nom) return;
      await API.createStructure(structure);

      Swal.fire({
        title: "Yay...",
        text: "Structure créée",
        icon: "success",
        timer: 1500,
      });
      updateData();
      toggle();
    } catch (error) {
      handleApiError({ text: "Erreur lors de la modification" });
      updateData();
      toggle();
    }
  };

  const handleFileInputChange = (event: any) => {
    if (!structure) return;
    setUploading(true);
    const formData = new FormData();
    // @ts-ignore
    formData.append(0, event.target.files[0]);

    API.postImage(formData)
      .then((imgData) => {
        setStructure({
          ...structure,
          picture: {
            secure_url: imgData.secure_url,
            public_id: imgData.public_id,
            imgId: imgData.imgId,
          },
        });
        setUploading(false);
        return;
      })
      .catch(handleApiDefaultError);
  };

  const modifyStatus = (status: StructureStatus) => {
    if (!structure) return;
    const updatedStructure = { ...structure, status };
    return setStructure(updatedStructure);
  };

  const onChange = (e: Event) => {
    if (!structure) return;
    setStructure({ ...structure, [e.target.id]: e.target.value });
  };

  const onSelectItem = (data: GetAllUsersResponse | GetActiveUsersResponse) => {
    setStructure({
      ...structure,
      responsable: data._id.toString(),
    });
    const responsable: SimpleUser = !data.picture
      ? ({ ...data, picture: { secure_url: "", public_id: "", imgId: "" } } as SimpleUser)
      : (data as SimpleUser);
    setResponsable(responsable);
  };

  const secureUrl = structure && structure.picture && structure.picture.secure_url;

  return (
    <Modal isOpen={props.show} toggle={toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <h2 className={styles.title}>Création d'une nouvelle structure</h2>
      <div className={styles.input}>
        <FInput
          id="nom"
          value={structure.nom}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Nom de la structure"
        />
      </div>
      <div className={styles.logo}>
        <div className={styles.wrapper}>
          <Image
            className={styles.sponsor_img}
            src={secureUrl || noStructure}
            alt=""
            width={140}
            height={60}
            style={{ objectFit: "contain" }}
          />
        </div>
        <div className={styles.right}>
          <FButton className="position-relative" type="theme" name="upload-outline">
            <Input type="file" id="picture" name="structure" accept="image/*" onChange={handleFileInputChange} />
            {secureUrl ? <span>Choisir une autre image</span> : <span>Ajouter un logo</span>}

            {uploading && <Spinner color="success" className="ms-2" />}
          </FButton>
        </div>
      </div>
      <label className={styles.label}>Premier responsable</label>
      <div className={styles.responsable}>
        <ChooseResponsableComponent
          isLoading={isLoading}
          activeUsers={activeUsers}
          onSelectItem={onSelectItem}
          responsable={responsable}
          removeRespo={() => setStructure({ ...structure, responsable: null })}
        />
      </div>
      <label className={styles.label}>Coordonnées du contact unique</label>
      <div className={styles.input}>
        <FInput
          id="contact"
          value={structure.contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Coordonnées"
        />
      </div>
      <div className={styles.input}>
        <FInput
          id="mail_contact"
          value={structure.mail_contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Adresse email"
        />
      </div>
      <div className={styles.input}>
        <FInput
          id="phone_contact"
          value={structure.phone_contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Numéro de téléphone"
        />
      </div>
      <label className={styles.label}>Statut</label>
      <RowContainer>
        {correspondingStatus
          .sort(statusCompare)
          .filter((element) => element.storedStatus !== "Supprimé")
          .map((element) => {
            return (
              <div
                key={element.storedStatus}
                style={{
                  marginRight: "8px",
                  marginBottom: "8px",
                }}
                onClick={() => modifyStatus(element.storedStatus)}
              >
                <StyledStatus
                  text={element.storedStatus}
                  overrideColor={structure.status !== element.storedStatus}
                  textToDisplay={element.displayedStatus}
                  // color={element.color}
                  disabled={false}
                />
              </div>
            );
          })}
      </RowContainer>

      <div className={styles.row}>
        <FButton className="me-2" type="white" name="close-outline" onClick={toggle}>
          Annuler
        </FButton>
        <FButton
          className="me-2"
          type="validate"
          name="checkmark-outline"
          onClick={onValidate}
          disabled={!structure.nom}
        >
          Créer
        </FButton>
      </div>
    </Modal>
  );
};
