/* eslint-disable no-console */
import { ObjectId } from "mongodb";
import React from "react";
import { Modal, Spinner } from "reactstrap";
import "./ImprovementsMailModal.scss";
import styled from "styled-components";
import { useSelector } from "react-redux";
import { dispositifSelector } from "../../../../../services/AllDispositifs/allDispositifs.selector";
import { correspondingStatus } from "../data";
import { activeUsersSelector } from "../../../../../services/AllUsers/allUsers.selector";
import { allStructuresSelector } from "../../../../../services/AllStructures/allStructures.selector";
import { getUsersToSendMail } from "./functions";
import { LoadingStatusKey } from "../../../../../services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "../../../../../services/LoadingStatus/loadingStatus.selectors";
import { StyledStatus } from "../../sharedComponents/SubComponents";
import { SimplifiedCreator } from "../../../../../types/interface";
import marioProfile from "../../../../../assets/mario-profile.jpg";

interface Props {
  show: boolean;
  toggleModal: () => void;
  selectedDispositifId: ObjectId | null;
}

const Header = styled.div`
  font-style: normal;
  font-weight: bold;
  font-size: 24px;
  margin: 12px 0px 12px 0px;
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
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin: 12px 0px 12px 0px;
`;

const UserContainer = styled.div`
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: row;
  width: fit-content;
  align-items: center;
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
  const dispositif = useSelector(
    dispositifSelector(props.selectedDispositifId)
  );

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
        className="improvements-modal"
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
        className="improvements-modal"
      >
        <Header>Erreur</Header>
      </Modal>
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  const usersToDisplay = getUsersToSendMail(
    dispositif.status,
    dispositif.creatorId,
    dispositif.mainSponsor,
    users,
    structures
  );
  console.log("usersToDisplay", usersToDisplay);

  const formattedStatus = getFormattedStatus(dispositif.status);
  console.log("formattedStatus", formattedStatus);

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

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className="improvements-modal"
    >
      <Header>Demande d'informations complémentaires pour la fiche :</Header>
      <RowContainer>
        <Text>{title}</Text>
        <StyledStatus
          text={formattedStatus.displayedStatus}
          overrideColor={false}
          textToDisplay={formattedStatus.displayedStatus}
          color={formattedStatus.color}
          disabled={true}
          textColor={formattedStatus.textColor}
        />
      </RowContainer>
      {["En attente admin", "Accepté structure"].includes(
        dispositif.status
      ) && <Title>{"Membres de la structure " + mainSponsorName}</Title>}
      {dispositif.status === "En attente" && (
        <Title>Créateur de la fiche</Title>
      )}

      {usersToDisplay.map((user) => {
        const email = user.email || "pas d'email renseigné";
        return (
          <UserContainer key={user._id}>
            <img className="user-img" src={getUserImage(user)} />
            {user.username + " - " + email}
          </UserContainer>
        );
      })}
    </Modal>
  );
};
