import { GetStructureResponse, Id, Picture, StructureMember } from "@refugies-info/api-types";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/router";
import { useState } from "react";
import { getPath } from "routes";
import styled from "styled-components";
import placeholder from "~/assets/no_results_alt.svg";
import TitleWithNumber from "~/components/Backend/TitleWithNumber";
import FButton from "~/components/UI/FButton/FButton";
import AddMemberModal from "./AddMemberModal";
import { MembresTable } from "./MembresTable";
import { MainContainer, StructureContainer, StructurePictureContainer } from "./SubComponents";
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
  membres: GetStructureResponse["membres"];
  userId: Id | null;
  structureId: Id;
  addUserInStructure: (arg: Id) => void;
  isAdmin: boolean;
  deleteUserFromStructure: (arg: Id) => void;
}

const checkIfUserIsAuthorizedToAddMembers = (isAdmin: boolean, userWithRole: GetStructureResponse["membres"]) => {
  return isAdmin || userWithRole.length > 0;
};

export const UserStructureDetails = (props: Props) => {
  const router = useRouter();
  const [showAddMemberModal, setShowAddMemberModal] = useState(false);
  const toggleAddMemberModal = () => setShowAddMemberModal(!showAddMemberModal);

  const [selectedUser, setSelectedUser] = useState<null | StructureMember>(null);

  const getSecureUrl = (picture: Picture | null) => {
    if (picture && picture.secure_url) return picture.secure_url;
    return placeholder;
  };

  const userWithRole = props.membres.filter((membre) => props.userId && membre.userId === props.userId);

  const isUserAuthorizedToAddMembers = checkIfUserIsAuthorizedToAddMembers(props.isAdmin, userWithRole);

  const { membres } = props;
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
                data-testid="test-add-member"
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
    </MainContainer>
  );
};
