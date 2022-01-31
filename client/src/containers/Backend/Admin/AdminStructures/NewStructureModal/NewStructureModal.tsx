import React, { useState } from "react";
import styled from "styled-components";
import { Event, Picture, Responsable, SimplifiedUser } from "types/interface";
import { Modal, Input, Spinner } from "reactstrap";
import Image from "next/image";
import FInput from "components/FigmaUI/FInput/FInput";
import moment from "moment/min/moment-with-locales";
import FButton from "components/FigmaUI/FButton/FButton";
import API from "utils/API";
import noStructure from "assets/noStructure.png";
import { ObjectId } from "mongodb";
import { RowContainer } from "../components/AdminStructureComponents";
import { correspondingStatus } from "../data";
import { compare } from "../../AdminContenu/AdminContenu";
import { StyledStatus } from "../../sharedComponents/SubComponents";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { activeUsersSelector } from "services/AllUsers/allUsers.selector";
import { ChooseResponsableComponent } from "./ChooseResponsableComponent";
import { colors } from "colors";
import { fetchAllStructuresActionsCreator } from "services/AllStructures/allStructures.actions";
import { fetchAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import { fetchAllUsersActionsCreator } from "services/AllUsers/allUsers.actions";
import styles from "./NewStructureModal.module.scss";

moment.locale("fr");

const Header = styled.div`
  font-weight: 500;
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
  border-color: ${colors.cardColor};
`;
interface Props {
  show: boolean;
  toggleModal: () => void;
}

interface InitialStructure {
  picture: Picture | null;
  status: string;
  contact: string;
  phone_contact: string;
  mail_contact: string;
  responsable?: null | Responsable;
  nom: string;
}

export const NewStructureModal: React.FunctionComponent<Props> = (
  props: Props
) => {
  const initialStructure = {
    nom: "",
    responsable: null,
    picture: null,
    status: "En attente",
    contact: "",
    phone_contact: "",
    mail_contact: "",
  };
  const [structure, setStructure] = useState<InitialStructure>(
    initialStructure
  );
  const [uploading, setUploading] = useState(false);

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_USERS)
  );

  const activeUsers = useSelector(activeUsersSelector);

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

      const membres = structure.responsable
        ? [
            {
              userId: structure.responsable._id,
              roles: ["administrateur"],
              added_at: new Date(),
            },
          ]
        : [];
      const structureToSave = {
        ...structure,
        membres: membres,
      };
      delete structureToSave.responsable;

      await API.createStructure({ query: structureToSave });

      Swal.fire({
        title: "Yay...",
        text: "Structure créée",
        type: "success",
        timer: 1500,
      });
      updateData();
      toggle();
    } catch (error) {
      Swal.fire({
        title: "Oh non",
        text: "Erreur lors de la modification",
        type: "error",
        timer: 1500,
      });
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

    API.set_image(formData).then(
      (data_res: {
        data: {
          data: { secure_url: string; public_id: string; imgId: ObjectId };
        };
      }) => {
        const imgData = data_res.data.data;
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
      }
    );
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

  const onSelectItem = (data: SimplifiedUser) =>
    setStructure({ ...structure, responsable: data });

  const secureUrl =
    structure && structure.picture && structure.picture.secure_url;

  return (
    <Modal
      isOpen={props.show}
      toggle={toggle}
      className={styles.modal}
      contentClassName={styles.modal_content}

    >
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
            objectFit="contain"
          />
        </LogoWrapper>
        <RightLogoContainer>
          <FButton className="upload-btn" type="theme" name="upload-outline">
            <Input
              className="file-input"
              type="file"
              id="picture"
              name="structure"
              accept="image/*"
              onChange={handleFileInputChange}
            />
            {secureUrl ? (
              <span>Choisir une autre image</span>
            ) : (
              <span>Ajouter un logo</span>
            )}

            {uploading && <Spinner color="success" className="ml-10" />}
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
          .sort(compare)
          .filter((element) => element.status !== "Supprimé")
          .map((element) => {
            return (
              <div
                key={element.status}
                style={{
                  marginRight: "8px",
                  marginBottom: "8px",
                }}
                onClick={() => modifyStatus(element.status)}
              >
                <StyledStatus
                  text={element.status}
                  overrideColor={structure.status !== element.status}
                  textToDisplay={element.status}
                  // color={element.color}
                  disabled={false}
                />
              </div>
            );
          })}
      </RowContainer>

      <BottomRowContainer>
        <FButton
          className="mr-8"
          type="white"
          name="close-outline"
          onClick={toggle}
        >
          Annuler
        </FButton>
        <FButton
          className="mr-8"
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
