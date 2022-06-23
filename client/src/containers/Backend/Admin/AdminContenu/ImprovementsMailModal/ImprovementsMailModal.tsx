import { ObjectId } from "mongodb";
import React, { useState, useCallback, useEffect } from "react";
import { Modal, Spinner, Row, Col, Input, Label } from "reactstrap";
import styled from "styled-components";
import { useSelector } from "react-redux";
import Image from "next/image";
import { dispositifSelector } from "services/AllDispositifs/allDispositifs.selector";
import { correspondingStatus } from "../data";
import { activeUsersSelector } from "services/AllUsers/allUsers.selector";
import { allStructuresSelector } from "services/AllStructures/allStructures.selector";
import { getUsersToSendMail } from "./functions";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { StyledStatus } from "../../sharedComponents/SubComponents";
import { SimplifiedCreator, Log } from "types/interface";
import marioProfile from "assets/mario-profile.jpg";
import { colors } from "colors";
import { Category } from "./Components";
import FButton from "components/UI/FButton/FButton";
import API from "utils/API";
import Swal from "sweetalert2";
import styles from "./ImprovementsMailModal.module.scss";
import { LogList } from "../../Logs/LogList";

interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedDispositifId: ObjectId | null;
}

const Header = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  margin: 0px 0px 12px 0px;
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 20px;
  margin-right: 10px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 20px;
`;

// const Title = styled.div`
//   font-weight: bold;
//   font-size: 16px;
//   line-height: 20px;
//   margin: 12px 0px 12px 0px;
// `;

// const UserContainer = styled.div`
//   display: flex;
//   align-items: center;
//   flex-grow: 1;
//   height: 52px;
//   padding: 12px;
//   border-radius: $radius;
//   background-color: $white;
//   margin-bottom: 8px;
// `;

const EmailText = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  color: ${(props: {hasEmail: boolean}) => (props.hasEmail ? colors.gray90 : colors.error)};
  margin-left: 5px;
`;

const CategoriesContainer = styled.div`
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
`;

const RecapContainer = styled.div`
  background: ${colors.erreur};
  width: 100%;
  padding: 8px;
  border-radius: 12px;
  margin-bottom: 12px;
  margin-top: 12px;
`;

const getFormattedStatus = (dispoStatus: string) => {
  const corresStatus = correspondingStatus.filter(
    (status) => status.storedStatus === dispoStatus
  );
  return corresStatus[0];
};
const getTitle = (
  titreInformatif: string,
  typeContenu: string,
  titreMarque: string | undefined
) => {
  if (typeContenu === "dispositif") {
    return titreInformatif + " avec " + titreMarque;
  }
  return titreInformatif;
};

export const ImprovementsMailModal = (props: Props) => {
  const { selectedDispositifId } = props
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [logs, setLogs] = useState<Log[]>([]);

  
  const dispositif = useSelector(
    dispositifSelector(selectedDispositifId)
    );

    const updateLogs = useCallback(() => {
      if (selectedDispositifId) {
        API.logs(selectedDispositifId).then((res) => {
          setLogs(res.data.data);
        });
      }
    }, [selectedDispositifId]);

    useEffect(() => {
      updateLogs();
    }, [updateLogs]);

  const users = useSelector(activeUsersSelector);
  const structures = useSelector(allStructuresSelector);

  const isLoadingDispositifs = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_DISPOSITIFS)
  );
  const isLoadingUsers = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_USERS)
  );
  const isLoadingStructures = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES)
  );
  const isLoading =
    isLoadingDispositifs || isLoadingUsers || isLoadingStructures;

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

  if (!props.selectedDispositifId || !dispositif) {
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        className={styles.modal}
        contentClassName={styles.modal_content}
        size="lg"
      >
        <Header>Erreur</Header>
      </Modal>
    );
  }

  // eslint-disable-next-line
  const usersToDisplay = getUsersToSendMail(
    dispositif.status,
    dispositif.creatorId,
    dispositif.mainSponsor,
    users,
    structures
  );

  const formattedStatus = getFormattedStatus(dispositif.status);

  const title = getTitle(
    dispositif.titreInformatif,
    dispositif.typeContenu,
    dispositif.titreMarque
  );

  const mainSponsorName =
    dispositif && dispositif.mainSponsor && dispositif.mainSponsor.nom
      ? dispositif.mainSponsor.nom
      : "";

  const getUserImage = (user: SimplifiedCreator) =>
    user.picture && user.picture.secure_url
      ? user.picture.secure_url
      : marioProfile;

  const dispositifCategories = [
    "C'est quoi ?",
    "C'est pour qui ?",
    "Pourquoi c'est intéressant ?",
    "Comment je m'engage ?",
    "Carte interactive",
  ];

  const onClickCategory = (categorie: string) => {
    const isCategorieSelected =
      selectedCategories.filter((cat) => cat === categorie).length > 0;
    if (isCategorieSelected) {
      setSelectedCategories(
        selectedCategories.filter((cat) => cat !== categorie)
      );
      return;
    }
    const newCategories = selectedCategories.concat([categorie]);
    setSelectedCategories(newCategories);
    return;
  };

  const sendMail = () => {
    const data = {
      dispositifId: dispositif._id,
      users: usersToDisplay
        .filter((user) => user.email)
        .map((user) => ({
          username: user.username,
          _id: user._id,
          email: user.email,
        })),
      titreInformatif: dispositif.titreInformatif,
      titreMarque: dispositif.titreMarque,
      sections: selectedCategories,
    };

    API.sendAdminImprovementsMail(data)
      .then(() => {
        Swal.fire({
          title: "Yay...",
          text: "Mail(s) envoyé(s)",
          type: "success",
          timer: 1500,
        });
        props.toggleModal();
      })
      .catch(() => {
        Swal.fire({
          title: "Oh non",
          text: "Erreur lors de l'envoi",
          type: "error",
          timer: 1500,
        });
        props.toggleModal();
      });
  };

  const nbUsersWithEmail = usersToDisplay.filter((user) => user.email).length;

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className={styles.modal}
      contentClassName={styles.modal_content}
      size="lg"
    >
      <Row>
        <Col lg="8">
      <Header>Demande d'informations complémentaires pour la fiche :</Header>
      <RowContainer>
        <Text>Fiche : <b>{title}</b></Text>
        <StyledStatus
          text={formattedStatus.displayedStatus}
          textToDisplay={formattedStatus.displayedStatus}
          color={formattedStatus.color}
          disabled={true}
          textColor={formattedStatus.textColor}
          />
      </RowContainer>

      <RowContainer>
        <Text>Structure : <b>{mainSponsorName}</b></Text>
        <StyledStatus
          text={formattedStatus.displayedStatus}
          textToDisplay={formattedStatus.displayedStatus}
          color={formattedStatus.color}
          disabled={true}
          textColor={formattedStatus.textColor}
          />
      </RowContainer>

      <Label>La demande sera envoyée à :</Label>

      {usersToDisplay.map((user, index) => {
        const hasEmail = !!user.email;
        const email = user.email || "pas d'email renseigné";
        return (
            <Row key={index}>
              <Col lg="10">
          <div className={styles.details_button}>
            <Image
              className={styles.user_img}
              src={getUserImage(user)}
              alt=""
              width={70}
              height={40}
              objectFit="contain"
            />
            {user.username + " - "}
            <EmailText style={{ marginRight: "5px" }} hasEmail={hasEmail}>{email}</EmailText>
            {user.roles?.map((role, i) => {
              return (
                <div style={{ marginRight: "5px" }} key={i}>
                <StyledStatus
                  text={role}
                  textToDisplay={role}
                  disabled
                />
                </div>
              )
            })}
          </div>
            </Col>
            </Row>
        );
      })}

      <Row className="mt-5">
        <Col lg="4">
      <Label>{"Sections à revoir (" + selectedCategories.length + ")"} </Label>
      <CategoriesContainer>
        {dispositifCategories.map((categorie, index) => (
          <Category
            categorieName={categorie}
            onClick={() => onClickCategory(categorie)}
            key={index}
            isSelected={selectedCategories.includes(categorie)}
          />
        ))}
      </CategoriesContainer>
      </Col>
      <Col lg="8">
      <Label>Ajouter un message</Label>
      <Input
        type="textarea"
        placeholder="Précisions sur les modifications attendues..."
        rows={10}
        maxLength={3000}
        // value={props.adminComments}
        // onChange={props.onNotesChange}
        id="message"
        className={styles.input}
      />
      </Col>
      </Row>

      <RecapContainer>
        Vous allez envoyer un mail à <b>{nbUsersWithEmail}</b> utilisateur(s)
        avec <b>{selectedCategories.length}</b> section(s) à revoir.
      </RecapContainer>

      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "end",
        }}
      >
        <FButton
          className="mr-8"
          type="white"
          onClick={props.toggleModal}
          name="close-outline"
        >
          Annuler
        </FButton>
        <FButton
          type="validate"
          name="checkmark-outline"
          onClick={sendMail}
          disabled={nbUsersWithEmail === 0 || selectedCategories.length === 0}
        >
          Envoyer
        </FButton>
      </div>
      </Col>
      <Col lg="4">
        <Header>Emails envoyés</Header>
        <LogList 
          logs={logs}
        />
      </Col>
      </Row>
    </Modal>
  );
};
