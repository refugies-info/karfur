// @ts-nocheck
import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { SimplifiedUser } from "types/interface";
import { Modal } from "reactstrap";
import "./UserDetailsModal.scss";
import moment from "moment/min/moment-with-locales";
import { useSelector } from "react-redux";
import marioProfile from "assets/mario-profile.jpg";
import { userSelector } from "../../../../../services/AllUsers/allUsers.selector";
import FInput from "../../../../../components/FigmaUI/FInput/FInput";
import { RowContainer } from "../../AdminStructures/components/AdminStructureComponents";
import { Structure } from "../ components/AdminUsersComponents";

moment.locale("fr");

const StructureName = styled.div`
  font-weight: bold;
  font-size: 22px;
  line-height: 28px;
`;

const Title = styled.div`
  font-weight: bold;
  font-size: 16px;
  line-height: 20px;
  margin: 0px 0px 8px 0px;
`;
interface Props {
  show: boolean;
  toggleModal: () => void;
  fetchUsers: () => void;
  selectedUserId: ObjectId | null;
}

export const UserDetailsModal: React.FunctionComponent<Props> = (
  props: Props
) => {
  const [user, setUser] = useState<SimplifiedUser | null>(null);

  const userFromStore = useSelector(userSelector(props.selectedUserId));
  useEffect(() => {
    setUser(userFromStore);
  }, [userFromStore]);

  const onChange = (e: Event) => {
    if (!user) return;
    setUser({ ...user, [e.target.id]: e.target.value });
  };

  // eslint-disable-next-line no-console
  console.log("user", user);

  //   const onSave = async () => {
  //     try {
  //       await API.updateStructure({ query: structure });
  //       Swal.fire({
  //         title: "Yay...",
  //         text: "Structure modifiée",
  //         type: "success",
  //         timer: 1500,
  //       });
  //       props.fetchStructures();
  //       props.toggleModal();
  //     } catch (error) {
  //       Swal.fire({
  //         title: "Oh non",
  //         text: "Erreur lors de la modification",
  //         type: "error",
  //         timer: 1500,
  //       });
  //       props.fetchStructures();
  //       props.toggleModal();
  //     }
  //   };

  const secureUrl =
    user && user.picture && user.picture.secure_url
      ? user.picture.secure_url
      : marioProfile;

  if (!user)
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        className="user-details-modal"
        size="large"
      >
        Erreur
      </Modal>
    );
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      className="user-details-modal"
      size="large"
    >
      <RowContainer>
        <img className="user-img mr-8" src={secureUrl} />
        <StructureName>{user.username}</StructureName>
      </RowContainer>
      <Title>Email</Title>
      <FInput
        id="email"
        value={user.email}
        onChange={onChange}
        newSize={true}
        autoFocus={false}
      />
      <Title>Structure</Title>
      {user.structures.map((structure) => (
        <Structure
          key={structure._id}
          nom={structure.nom}
          picture={structure.picture}
          role="Responsable"
        />
      ))}
      <Title>Rôles</Title>
      <Title>Langues</Title>
      <Title>Date de création</Title>
      <Title>Temps passé</Title>
    </Modal>
  );
};
