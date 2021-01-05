import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Modal, Spinner } from "reactstrap";
import "./SelectFirstResponsableModal.scss";
import { SearchBar } from "containers/UI/SearchBar/SearchBar";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsersActionsCreator } from "services/AllUsers/allUsers.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { activeUsersSelector } from "services/AllUsers/allUsers.selector";
import FButton from "components/FigmaUI/FButton/FButton";
import { SimplifiedUser } from "types/interface";

const Header = styled.div`
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  margin-bottom: 40px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: flex-end;
`;
interface Props {
  show: boolean;
  toggleModal: () => void;
}
export const SelectFirstResponsableModal = (props: Props) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars-experimental
  const [selectedUser, setSelectedUser] = useState<SimplifiedUser | null>(null);

  const dispatch = useDispatch();
  const isLoading = useSelector(
    isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES)
  );
  useEffect(() => {
    const loadUsers = async () => {
      await dispatch(fetchAllUsersActionsCreator());
    };
    loadUsers();
  }, [dispatch]);
  const activeUsers = useSelector(activeUsersSelector);

  const onSelectItem = (data: SimplifiedUser) => setSelectedUser(data);

  if (isLoading)
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        size="lg"
        className="select-respo-modal"
      >
        <Spinner />
      </Modal>
    );
  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      size="lg"
      className="select-respo-modal"
    >
      <div>
        <Header>Choix d'un utilisateur</Header>
        <SearchBar
          isArray
          users
          className="search-bar inner-addon right-addon"
          placeholder="Rechercher un utilisateur"
          array={activeUsers}
          selectItem={onSelectItem}
        />
      </div>
      <RowContainer>
        <FButton
          type="white"
          name="close-outline"
          className="mr-8"
          onClick={props.toggleModal}
        >
          Annuler
        </FButton>
        <FButton type="validate" name="checkmark-outline">
          Valider
        </FButton>
      </RowContainer>
    </Modal>
  );
};
