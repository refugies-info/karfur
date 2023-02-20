import React, { useState } from "react";
import { Modal } from "reactstrap";
import FButton from "components/UI/FButton/FButton";
import Image from "next/image";
import styled from "styled-components";
import marioProfile from "assets/mario-profile.jpg";
import { Role } from "./Role";
import styles from "./MemberModal.module.scss";
import { Id, StructureMember } from "api-types";

const Title = styled.div`
  font-weight: normal;
  font-size: 32px;
  line-height: 40px;
  margin-right: 15px;
`;

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 12px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 16px;
`;

const UserName = styled.div`
  font-weight: bold;
  font-size: 18px;
  line-height: 23px;
`;

interface Props {
  show: boolean;
  toggle: () => void;
  modifyRole: (arg: Id, role: "contributeur" | "administrateur") => void;
  selectedUser: StructureMember | null;
}

const EditMemberModal = (props: Props) => {
  const [selectedRole, setSelectedRole] = useState("");

  const modifyRole = () => {
    if (!props.selectedUser || !selectedRole) return;
    const formattedRole = selectedRole === "Responsable" ? "administrateur" : "contributeur";
    props.modifyRole(props.selectedUser.userId, formattedRole);
  };

  const secureUrl =
    props.selectedUser && props.selectedUser.picture && props.selectedUser.picture.secure_url
      ? props.selectedUser.picture.secure_url
      : marioProfile;

  const getState = (role: "Rédacteur" | "Responsable") => {
    if (!props.selectedUser) return "none";

    const currentRole = props.selectedUser.mainRole;
    if (selectedRole) {
      if (selectedRole === role && selectedRole !== currentRole) return "selected";
      if (selectedRole === role && selectedRole === currentRole) return "current";
      return "none";
    }
    if (props.selectedUser.mainRole === role) return "current";
    return "none";
  };

  if (!props.selectedUser)
    return (
      <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
        <div>Erreur</div>;
      </Modal>
    );

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <RowContainer>
        <Title>Modifier le rôle de</Title>
        <Image
          className={styles.user_img + " me-2"}
          src={secureUrl}
          alt=""
          width={70}
          height={40}
          style={{ objectFit: "contain" }}
        />
        <UserName>{props.selectedUser.username}</UserName>
      </RowContainer>
      <Role role={"Rédacteur"} onRoleSelect={setSelectedRole} state={getState("Rédacteur")} />
      <Role role={"Responsable"} onRoleSelect={setSelectedRole} state={getState("Responsable")} />
      <ButtonContainer>
        <FButton type="outline-black" name="close-outline" onClick={props.toggle} className="me-2">
          Annuler
        </FButton>
        <FButton
          type="validate"
          name="checkmark-outline"
          onClick={modifyRole}
          disabled={!selectedRole || selectedRole === props.selectedUser.mainRole}
          data-test-id="test-validate-edit"
        >
          Valider
        </FButton>
      </ButtonContainer>
    </Modal>
  );
};

export default EditMemberModal;
