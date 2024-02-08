import React, { useState } from "react";
import { MainContainer, StructurePictureContainer, StructureContainer } from "./SubComponents";
import Image from "next/image";
import TitleWithNumber from "components/Backend/TitleWithNumber";
import { Picture, StructureMemberRole } from "@refugies-info/api-types";
import placeholder from "assets/no_results_alt.svg";
import styled from "styled-components";
import FButton from "components/UI/FButton/FButton";
import { MembresTable } from "./MembresTable";
import AddMemberModal from "./AddMemberModal";
import EditMemberModal from "./EditMemberModal";
import styles from "./UserStructureDetails.module.scss";
import Link from "next/link";
import { getPath } from "routes";
import { useRouter } from "next/router";
import { GetStructureResponse, Id, StructureMember } from "@refugies-info/api-types";

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
  membres: GetStructureResponse["membres"];
  userId: Id | null;
  structureId: Id;
  addUserInStructure: (arg: Id) => void;
  isAdmin: boolean;
  modifyRole: (arg: Id, role: StructureMemberRole) => void;
  deleteUserFromStructure: (arg: Id) => void;
}

const checkIfUserIsAuthorizedToAddMembers = (isAdmin: boolean, userWithRole: GetStructureResponse["membres"]) => {
  if (isAdmin) return true;

  if (userWithRole.length > 0 && userWithRole[0].roles && userWithRole[0].roles.length > 0)
    return userWithRole[0].roles.includes(StructureMemberRole.ADMIN);
  return false;
};

export const UserStructureDetails = (props: Props) => {
  const router = useRouter();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const toggleAddMemberModal = () => setShowAddMemberModal(!showAddMemberModal);

  const [showEditMemberModal, setShowEditMemberModal] = useState(false);
  const toggleEditMemberModal = () => setShowEditMemberModal(!showEditMemberModal);

  const [selectedUser, setSelectedUser] = useState<null | StructureMember>(null);

  const getSecureUrl = (picture: Picture | null) => {
    if (picture && picture.secure_url) return picture.secure_url;
    return placeholder;
  };

  const userWithRole = props.membres.filter((membre) => props.userId && membre.userId === props.userId);

  const isUserAuthorizedToAddMembers = checkIfUserIsAuthorizedToAddMembers(props.isAdmin, userWithRole);

  const membres = props.membres.filter((membre) => membre.mainRole !== "Exclu");
  const isMember = props.membres.find((el) => props.userId && el.userId === props.userId) ? true : false;

  return (
    <MainContainer className={styles.container}>
      <StructurePictureContainer>
        <Image
          className={styles.sponsor_img}
          src={getSecureUrl(props.picture)}
          alt={props.acronyme}
          width={235}
          height={115}
          style={{ objectFit: "contain" }}
        />
        <StructureName>{props.name}</StructureName>
        {isMember && (
          <Link
            legacyBehavior
            href={{
              pathname: getPath("/annuaire/[id]", router.locale),
              query: { id: props.structureId.toString() },
            }}
            passHref
            prefetch={false}
          >
            <FButton type="dark" name="book-outline" tag="a">
              Voir dans l'annuaire
            </FButton>
          </Link>
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
                data-test-id="test-add-member"
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
          membres={membres}
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
