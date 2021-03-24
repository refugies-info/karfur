/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-unused-vars-experimental */
import React, { useEffect, useState } from "react";
import { Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

import "./AddMemberModal.scss";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import styled from "styled-components";
import { colors } from "../../../../colors";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsersActionsCreator } from "../../../../services/AllUsers/allUsers.actions";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { activeUsersSelector } from "../../../../services/AllUsers/allUsers.selector";
import { SearchBar } from "containers/UI/SearchBar/SearchBar";
import { SimplifiedUser } from "../../../../types/interface";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ObjectId } from "mongodb";

const Title = styled.div`
  font-weight: normal;
  font-size: 32px;
  line-height: 40px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
  margin-top: 8px;
`;

const InformationContainer = styled.div`
  background: ${colors.focus};
  border-radius: 12px;
  padding: 16px;
  margin-top: 15px;
  font-style: normal;

  font-size: 16px;
  line-height: 20px;
  color: ${colors.blancSimple};
  margin-bottom: 15px;
`;

const ModifyLink = styled.div`
  font-weight: bold;
  margin-top: 12px;
  cursor: pointer;
`;
const SelectedUser = styled.div`
  background: ${colors.blancSimple};
  width: 100%;
  padding: 8px;
  border-radius: 12px;
`;
interface Props {
  show: boolean;
  toggle: () => void;
  addUserInStructure: (arg: ObjectId) => void;
}

export const AddMemberModal = (props: Props) => {
  const [selectedUser, setSelectedUser] = useState<SimplifiedUser | null>(null);

  const onSelectItem = (data: SimplifiedUser) => setSelectedUser(data);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchAllUsersActionsCreator());
  }, []);

  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_USERS)
  );

  const activeUsers = useSelector(activeUsersSelector);

  const addUserInStructure = () => {
    if (!selectedUser) return;
    props.addUserInStructure(selectedUser._id);
  };

  console.log("user", selectedUser);

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className="member-modal">
      <Title>Ajouter un membre</Title>
      <InformationContainer>
        <b>Attention :</b> assurez-vous que la personne que vous souhaitez
        ajouter a déjà créé un compte sur réfugiés.info.
      </InformationContainer>
      {isLoading && (
        <SkeletonTheme color={colors.blancSimple}>
          <Skeleton count={1} height={50} />
        </SkeletonTheme>
      )}
      {!isLoading && !selectedUser && (
        <SearchBar
          isArray
          users
          className="search-bar inner-addon right-addon"
          placeholder="Rechercher un utilisateur"
          array={activeUsers}
          selectItem={onSelectItem}
          // selectItem={() => {}}
        />
      )}
      {!isLoading && selectedUser && (
        <div>
          <SelectedUser>{selectedUser.username}</SelectedUser>
          <ModifyLink onClick={() => setSelectedUser(null)}>
            <u>Modifier</u>
          </ModifyLink>
        </div>
      )}
      <RowContainer>
        <FButton
          type="outline-black"
          name="close-outline"
          onClick={props.toggle}
          className="mr-8"
        >
          Annuler
        </FButton>
        <FButton
          type="validate"
          name="checkmark-outline"
          onClick={addUserInStructure}
          disabled={isLoading || !selectedUser}
        >
          Ajouter
        </FButton>
      </RowContainer>
    </Modal>
  );
};
