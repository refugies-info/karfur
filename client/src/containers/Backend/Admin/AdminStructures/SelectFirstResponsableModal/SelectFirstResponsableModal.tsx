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
import { ObjectId } from "mongodb";
import API from "../../../../../utils/API";
import Swal from "sweetalert2";
import { fetchAllStructuresActionsCreator } from "services/AllStructures/allStructures.actions";

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
  selectedStructureId: ObjectId | null;
}
export const SelectFirstResponsableModal = (props: Props) => {
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

  const onValidate = async () => {
    try {
      if (!selectedUser) return;

      const structure = {
        _id: props.selectedStructureId,
        membreId: selectedUser._id,
        $addToSet: {
          membres: {
            userId: selectedUser._id,
            roles: ["administrateur"],
            added_at: new Date(),
          },
        },
      };

      await API.create_structure(structure);

      Swal.fire({
        title: "Yay...",
        text: "Responsable modifié",
        type: "success",
        timer: 1500,
      });
      props.toggleModal();
      dispatch(fetchAllStructuresActionsCreator());
    } catch (error) {
      Swal.fire({
        title: "Oh non",
        text: "Erreur lors de la modification",
        type: "error",
        timer: 1500,
      });
      props.toggleModal();
    }
  };

  const onSelectItem = (data: SimplifiedUser) => setSelectedUser(data);

  if (isLoading || !props.selectedStructureId)
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
        <FButton type="validate" name="checkmark-outline" onClick={onValidate}>
          Valider
        </FButton>
      </RowContainer>
    </Modal>
  );
};
