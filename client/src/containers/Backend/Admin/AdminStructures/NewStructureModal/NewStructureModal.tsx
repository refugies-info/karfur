import React, { useState } from "react";
import styled from "styled-components";
import { Event } from "types/interface";
import { Picture } from "api-types";
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
import { colors } from "colors";
import { fetchAllStructuresActionsCreator } from "services/AllStructures/allStructures.actions";
import { fetchAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import { fetchAllUsersActionsCreator } from "services/AllUsers/allUsers.actions";
import styles from "./NewStructureModal.module.scss";
import { GetActiveUsersResponse, GetAllStructuresResponse, GetAllUsersResponse, PostStructureRequest } from "api-types";
import { handleApiDefaultError, handleApiError } from "lib/handleApiErrors";

moment.locale("fr");

const Header = styled.div`
  font-weight: 600;
  font-size: 32px;
  line-height: 40px;
  margin-bottom: 16px;
`;
const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin: 0px 0px 8px 0px;
`;

const InputContainer = styled.div`
  margin-bottom: 8px;
  width: 440px;
`;
const BottomRowContainer = styled.div`
  display: flex;
  flex-direction: row;
  margin-top: 16px;
  justify-content: flex-end;
`;

const LogoContainer = styled.div`
  display: flex;
  flex-direction: row;
`;
const LogoWrapper = styled.div`
  width: 160px;
  max-height: 200px;
`;
const RightLogoContainer = styled.div`
  margin-left: 32px;
  margin-bottom: 24px;
`;

const ResponsableContainer = styled.div`
  border: 2px solid;
  border-radius: 16px;
  padding: 8px;
  margin-bottom: 8px;
  border-color: ${colors.gray70};
`;

interface InitialStructure {
  picture: Picture | null;
  status: string;
  contact: string;
  phone_contact: string;
  mail_contact: string;
  responsable?: null | GetAllStructuresResponse["responsable"];
  nom: string;
}

interface Props {
  defaults: Partial<InitialStructure>;
  show: boolean;
  toggleModal: () => void;
}

export const NewStructureModal: React.FunctionComponent<Props> = (props: Props) => {
  const initialStructure = {
    nom: "",
    responsable: null,
    picture: null,
    status: "En attente",
    contact: "",
    phone_contact: "",
    mail_contact: "",
    ...props.defaults,
  };
  const [structure, setStructure] = useState<InitialStructure>(initialStructure);
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
      const structureToSave: PostStructureRequest = {
        ...structure,
        responsable: structure.responsable?._id.toString() || null,
      };
      await API.createStructure(structureToSave);

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

  const modifyStatus = (status: string) => {
    if (!structure) return;
    const updatedStructure = { ...structure, status };
    return setStructure(updatedStructure);
  };

  const onChange = (e: Event) => {
    if (!structure) return;
    setStructure({ ...structure, [e.target.id]: e.target.value });
  };

  const onSelectItem = (data: GetAllUsersResponse | GetActiveUsersResponse) =>
    setStructure({
      ...structure,
      responsable: {
        _id: data._id,
        picture: data.picture,
        username: data.username,
        email: data.email,
      },
    });

  const secureUrl = structure && structure.picture && structure.picture.secure_url;

  return (
    <Modal isOpen={props.show} toggle={toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <Header>Création d'une nouvelle structure</Header>
      <InputContainer>
        <FInput
          id="nom"
          value={structure.nom}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Nom de la structure"
        />
      </InputContainer>
      <LogoContainer>
        <LogoWrapper>
          <Image
            className={styles.sponsor_img}
            src={secureUrl || noStructure}
            alt=""
            width={140}
            height={60}
            style={{ objectFit: "contain" }}
          />
        </LogoWrapper>
        <RightLogoContainer>
          <FButton className="position-relative" type="theme" name="upload-outline">
            <Input type="file" id="picture" name="structure" accept="image/*" onChange={handleFileInputChange} />
            {secureUrl ? <span>Choisir une autre image</span> : <span>Ajouter un logo</span>}

            {uploading && <Spinner color="success" className="ms-2" />}
          </FButton>
        </RightLogoContainer>
      </LogoContainer>
      <Title>Premier responsable</Title>
      <ResponsableContainer>
        <ChooseResponsableComponent
          isLoading={isLoading}
          activeUsers={activeUsers}
          onSelectItem={onSelectItem}
          responsable={structure.responsable || null}
          removeRespo={() => setStructure({ ...structure, responsable: null })}
        />
      </ResponsableContainer>
      <Title>Coordonnées du contact unique</Title>
      <InputContainer>
        <FInput
          id="contact"
          value={structure.contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Coordonnées"
        />
      </InputContainer>
      <InputContainer>
        <FInput
          id="mail_contact"
          value={structure.mail_contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Adresse email"
        />
      </InputContainer>
      <InputContainer>
        <FInput
          id="phone_contact"
          value={structure.phone_contact}
          onChange={onChange}
          newSize={true}
          autoFocus={false}
          placeholder="Numéro de téléphone"
        />
      </InputContainer>
      <Title>Statut</Title>
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

      <BottomRowContainer>
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
      </BottomRowContainer>
    </Modal>
  );
};
