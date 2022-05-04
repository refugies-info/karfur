import React, { useState, useEffect } from "react";
import styled from "styled-components";
import {
  SimplifiedStructureForAdmin,
  Event,
  Responsable,
  SimplifiedDispositif,
} from "types/interface";
import { Modal, Input, Spinner } from "reactstrap";
import Image from "next/image";
import { withRouter, RouteComponentProps } from "react-router-dom";
import FInput from "components/UI/FInput/FInput";
import moment from "moment";
import "moment/locale/fr";
import FButton from "components/UI/FButton/FButton";
import API from "utils/API";
import noStructure from "assets/noStructure.png";
import { ObjectId } from "mongodb";
import {
  ResponsableComponent,
  RowContainer,
} from "../components/AdminStructureComponents";
import { correspondingStatus } from "../data";
import { allDispositifsSelector } from "services/AllDispositifs/allDispositifs.selector";
import { statusCompare } from "lib/statusCompare";
import { StyledStatus } from "../../sharedComponents/SubComponents";
import Swal from "sweetalert2";
import { useSelector, useDispatch } from "react-redux";
import { structureSelector } from "services/AllStructures/allStructures.selector";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { fetchAllStructuresActionsCreator } from "services/AllStructures/allStructures.actions";
import { fetchAllDispositifsActionsCreator } from "services/AllDispositifs/allDispositifs.actions";
import { fetchAllUsersActionsCreator } from "services/AllUsers/allUsers.actions";
import { colors } from "colors";
import styles from "./StructureDetailsModal.module.scss";
import useRouterLocale from "hooks/useRouterLocale";

moment.locale("fr");

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
  justify-content: space-between;
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

const ColumnContainer = styled.div`
  display: flex;
  flex-direction: row;
`;

const FichesColumnContainer = styled.div`
  padding-left: 32px;
  font-weight: bold;
  font-size: 16px;
  padding-bottom: 8px;
`;
const TitleFichesContainer = styled.div`
  padding-left: 32px;
  font-weight: bold;
  font-size: 18px;
  text-decoration: underline;
  padding-bottom: 5px;
  max-width: 450px;
  cursor: pointer;
  color: ${(props: {color: string}) => props.color};
`;
const TextInfoFichesContainer = styled.div`
  padding-left: 32px;
  font-size: 12px;
`;

const TextNoFicheContainer = styled.div`
  padding-left: 32px;
  font-weight: bold;
color:${colors.gray70}
  font-size: 22px;
`;

const DetailsFichesContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
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

const getStructureWithAllInformationRequired = (
  dispositifsIds: ObjectId[],
  allDispositifs: SimplifiedDispositif[]
) => {
  let dispositifsWithAllInformation: any = [];
  dispositifsIds.forEach((dispositifId) => {
    let simplifiedDispositif = allDispositifs.find(
      (dispositif) => dispositif._id === dispositifId
    );
    if (simplifiedDispositif) {
      let element = {
        titreInformatif: simplifiedDispositif.titreInformatif,
        creator: simplifiedDispositif.creatorId,
        created_at: simplifiedDispositif.created_at,
        _id: simplifiedDispositif._id,
        status: simplifiedDispositif.status,
        color: simplifiedDispositif.tags.length
          ? simplifiedDispositif.tags[0].darkColor
          : "#000000",
      };
      dispositifsWithAllInformation.push(element);
    }
  });
  return dispositifsWithAllInformation;
};

const StructureDetailsModalComponent: React.FunctionComponent<Props> = (
  props: Props
) => {
  const [
    structure,
    setStructure,
  ] = useState<SimplifiedStructureForAdmin | null>(null);
  const [uploading, setUploading] = useState(false);
  const routerLocale = useRouterLocale();

  const isLoadingStructures = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES)
  );

  const isLoadingDispositifs = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS)
  );

  const isLoading = isLoadingDispositifs || isLoadingStructures;

  const structureFromStore = useSelector(
    structureSelector(props.selectedStructureId)
  );

  useEffect(() => {
    setStructure(structureFromStore);
  }, [structureFromStore]);

  const dispatch = useDispatch();

  const allDispositifs = useSelector(allDispositifsSelector);

  const updateData = () => {
    dispatch(fetchAllStructuresActionsCreator());
    dispatch(fetchAllDispositifsActionsCreator());
    dispatch(fetchAllUsersActionsCreator());
  };

  const onSave = async () => {
    try {
      await API.updateStructure({ query: structure });
      Swal.fire({
        title: "Yay...",
        text: "Structure modifiée",
        type: "success",
        timer: 1500,
      });
      updateData();
      props.toggleModal();
    } catch (error) {
      Swal.fire({
        title: "Oh non",
        text: "Erreur lors de la modification",
        type: "error",
        timer: 1500,
      });
      updateData();
      props.toggleModal();
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
  const secureUrl =
    structure && structure.picture && structure.picture.secure_url;

  if (structure) {
    const dispositifsWithAllInformation = getStructureWithAllInformationRequired(
      structure.dispositifsIds,
      allDispositifs
    );
    structure.dispositifsSimplified = dispositifsWithAllInformation;
  }

  if (isLoading) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        className={styles.modal}
        contentClassName={styles.modal_content}
      >
        <Spinner />
      </Modal>
    );
  }

  if (!structure)
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        className={styles.modal}
        contentClassName={styles.modal_content}
      >
        Erreur
      </Modal>
    );
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className={styles.modal}
      contentClassName={styles.modal_content}
      style={{ maxWidth: "950px" }}
    >
      <ColumnContainer>
        <div>
          <InputContainer>
            <FInput
              id="nom"
              value={structure.nom}
              onChange={onChange}
              newSize={true}
              autoFocus={false}
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
              <FButton
                className="position-relative"
                type="theme"
                name="upload-outline"
              >
                <Input
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
          {!isLoading && (
            <ResponsableComponent
              responsable={structure.responsable}
              canClickOnRespo={true}
              toggleModal={props.toggleModal}
              onUserNameClick={() =>
                props.setSelectedUserIdAndToggleModal(structure.responsable)
              }
              onNewRespoClick={props.toggleRespoModal}
            />
          )}

          {isLoading && (
            <div style={{ marginBottom: "8px" }}>
              <Spinner />
            </div>
          )}

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
            {correspondingStatus.sort(statusCompare).map((element) => {
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
          <Title>Date de création</Title>
          {structure.created_at
            ? moment(structure.created_at).format("LLL")
            : "Non connue"}
        </div>
        <div>
          <FichesColumnContainer>Fiche(s) de la structure</FichesColumnContainer>
          {structure.dispositifsSimplified &&
          structure.dispositifsSimplified.length ? (
            structure.dispositifsSimplified.map((dispositif, index) => {
              return (
                <div key={index}>
                  <TitleFichesContainer
                    color={dispositif.color}
                    key={index}
                    onClick={() => {
                      props.toggleModal();
                      props.setSelectedContentIdAndToggleModal(
                        dispositif._id,
                        dispositif.status
                      );
                    }}
                  >
                    {
                      //@ts-ignore
                      dispositif.titreInformatif.fr
                        ? //@ts-ignore
                          dispositif.titreInformatif.fr
                        : dispositif.titreInformatif
                    }
                  </TitleFichesContainer>
                  <DetailsFichesContainer>
                    <TextInfoFichesContainer>
                      {index === 0 && (
                        <div style={{ fontWeight: "bold" }}>
                          Fiche ayant créé la structure
                        </div>
                      )}
                      <div>
                        {" "}
                        Créé le {moment(dispositif.created_at).format(
                          "LLL"
                        )} - {dispositif.status}
                      </div>
                    </TextInfoFichesContainer>

                    <div
                      style={{
                        marginBottom: "8px",
                        cursor: "pointer",
                        textDecoration: "underline",
                      }}
                      onClick={() => {
                        props.toggleModal();
                        props.setSelectedUserIdAndToggleModal(
                          dispositif.creator
                        );
                      }}
                    >
                      <ResponsableComponent
                        responsable={dispositif.creator}
                        canClickOnRespo={false}
                      />
                    </div>
                  </DetailsFichesContainer>
                </div>
              );
            })
          ) : (
            <TextNoFicheContainer>
              Aucune fiche n'est connectée à cette structure
            </TextNoFicheContainer>
          )}
        </div>
      </ColumnContainer>
      <BottomRowContainer>
        <div>
          <FButton
            className="mr-8"
            type="dark"
            name="external-link"
            onClick={() => {
              props.history.push({
                pathname: routerLocale + "/backend/user-dash-structure-selected",
                search: `?id=${structure._id}`,
              });
            }}
          >
            Page
          </FButton>
          {structure && structure.status === "Actif" && (
            <FButton
              className="mr-8"
              type="dark"
              name="paper-plane"
              tag={"a"}
              href={`/annuaire/${structure._id}`}
              target="_blank"
            >
              Annuaire
            </FButton>
          )}
        </div>
        <div>
          <FButton
            className="mr-8"
            type="white"
            name="close-outline"
            onClick={props.toggleModal}
          >
            Annuler
          </FButton>
          <FButton
            className="mr-8"
            type="validate"
            name="checkmark-outline"
            onClick={onSave}
          >
            Enregistrer
          </FButton>
        </div>
      </BottomRowContainer>
    </Modal>
  );
};

export const StructureDetailsModal = withRouter(StructureDetailsModalComponent);
