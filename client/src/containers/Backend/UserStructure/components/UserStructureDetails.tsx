import React, { useState } from "react";
import {
  MainContainer,
  StructurePictureContainer,
  StructureContainer,
} from "./SubComponents";
import Image from "next/image";
import { TitleWithNumber } from "../../middleOfficeSharedComponents";
import { Picture, UserStructureMembre } from "types/interface";
import placeholder from "assets/annuaire/placeholder_logo_annuaire.svg";
import styled from "styled-components";
import FButton from "components/FigmaUI/FButton/FButton";
import { NavLink } from "react-router-dom";
import { MembresTable } from "./MembresTable";
import { ObjectId } from "mongodb";
import { AddMemberModal } from "./AddMemberModal";
import { EditMemberModal } from "./EditMemberModal";
import styles from "./UserStructureDetails.module.scss";

const StructureName = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
  margin-top: 30px;
  margin-bottom: 30px;
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
`;
interface Props {
  picture: Picture | null;
  acronyme: string;
  name: string;
  membres: UserStructureMembre[];
  userId: ObjectId;
  structureId: ObjectId;
  addUserInStructure: (arg: ObjectId) => void;
  isAdmin: boolean;
  modifyRole: (arg: ObjectId, role: "contributeur" | "administrateur") => void;
  deleteUserFromStructure: (arg: ObjectId) => void;
}

const checkIfUserIsAuthorizedToAddMembers = (
  isAdmin: boolean,
  userWithRole: UserStructureMembre[]
) => {
  if (isAdmin) return true;

  if (
    userWithRole.length > 0 &&
    userWithRole[0].roles &&
    userWithRole[0].roles.length > 0
  )
    return userWithRole[0].roles.includes("administrateur");
  return false;
};

const formatRoles = (membres: UserStructureMembre[]) =>
  membres.map((membre) => {
    if (membre.roles.includes("administrateur"))
      return { ...membre, mainRole: "Responsable" };
    if (membre.roles.includes("contributeur"))
      return { ...membre, mainRole: "Rédacteur" };
    return { ...membre, mainRole: "Exclus" };
  });
export const UserStructureDetails = (props: Props) => {
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const toggleAddMemberModal = () => setShowAddMemberModal(!showAddMemberModal);

  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const toggleEditMemberModal = () =>
    setShowEditMemberModal(!showEditMemberModal);

  const [selectedUser, setSelectedUser] =
    useState<null | UserStructureMembre>(null);

  const getSecureUrl = (picture: Picture | null) => {
    if (picture && picture.secure_url) return picture.secure_url;
    return placeholder;
  };

  const userWithRole = props.membres.filter(
    (membre) => membre._id === props.userId
  );

  const isUserAuthorizedToAddMembers = checkIfUserIsAuthorizedToAddMembers(
    props.isAdmin,
    userWithRole
  );

  const formattedMembres = formatRoles(props.membres);
  const membres = formattedMembres.filter(
    (membre) => membre.mainRole !== "Exclus"
  );
  const isMember = props.membres.find((el) => el._id === props.userId)
    ? true
    : false;

  return (
    <MainContainer className={styles.container}>
      <StructurePictureContainer>
        <Image
          className={styles.sponsor_img}
          src={getSecureUrl(props.picture)}
          alt={props.acronyme}
          width={235}
          height={115}
          objectFit="contain"
        />
        <StructureName>{props.name}</StructureName>
        {isMember && (
          <FButton
            type="dark"
            name="book-outline"
            tag={NavLink}
            to={"/annuaire/" + props.structureId}
          >
            Voir dans l'annuaire
          </FButton>
        )}
      </StructurePictureContainer>
      <StructureContainer>
        <TitleContainer>
          <TitleWithNumber
            isLoading={false}
            textBefore={"Membres"}
            textPlural=""
            textSingular=""
            amount={membres.length}
          />
          {isUserAuthorizedToAddMembers && (
            <div>
              <FButton
                type="dark"
                name="person-add-outline"
                onClick={toggleAddMemberModal}
                testID="test-add-member"
              >
                Ajouter un membre
              </FButton>
            </div>
          )}
        </TitleContainer>
        <MembresTable
          membres={membres}
          userId={props.userId}
          isUserAuthorizedToAddMembers={isUserAuthorizedToAddMembers}
          toggleEditMemberModal={toggleEditMemberModal}
          setSelectedUser={setSelectedUser}
          deleteUserFromStructure={props.deleteUserFromStructure}
        />
      </StructureContainer>
      {isUserAuthorizedToAddMembers && (
        <AddMemberModal
          toggle={toggleAddMemberModal}
          show={showAddMemberModal}
          addUserInStructure={props.addUserInStructure}
        />
      )}
      {isUserAuthorizedToAddMembers && (
        <EditMemberModal
          toggle={toggleEditMemberModal}
          show={showEditMemberModal}
          modifyRole={props.modifyRole}
          selectedUser={selectedUser}
        />
      )}
    </MainContainer>
  );
};
