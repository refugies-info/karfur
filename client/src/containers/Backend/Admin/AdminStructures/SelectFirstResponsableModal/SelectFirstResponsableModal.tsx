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
import { structureSelector } from "services/AllStructures/allStructures.selector";
import { colors } from "colors";

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
const Header = styled.div`
  font-weight: 500;
  font-size: 32px;
  line-height: 40px;
  margin-bottom: 40px;
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  margin-top: 8px;
`;

const Warning = styled.div`
  background: ${colors.erreur};
  width: 100%;
  padding: 8px;
  border-radius: 12px;
  margin-bottom: 8px;
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

  const structureFromStore = useSelector(
    structureSelector(props.selectedStructureId)
  );

  const activeUsers = useSelector(activeUsersSelector);

  const getMembres = () => {
    if (!selectedUser || !structureFromStore) return [];

    if (!structureFromStore.membres || structureFromStore.membres.length === 0)
      return [
        {
          userId: selectedUser._id,
          roles: ["administrateur"],
          added_at: new Date(),
        },
      ];

    // in order not to have 2 times the same id in the members
    const membresWithoutRespo = structureFromStore.membres.filter(
      (membre) => membre.userId !== selectedUser._id
    );

    return [
      ...membresWithoutRespo,
      {
        userId: selectedUser._id,
        roles: ["administrateur"],
        added_at: new Date(),
      },
    ];
  };
  const onValidate = async () => {
    try {
      if (!selectedUser || !structureFromStore) return;

      const structure = {
        _id: props.selectedStructureId,
        membres: getMembres(),
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
        {!selectedUser && (
          <SearchBar
            isArray
            users
            className="search-bar inner-addon right-addon"
            placeholder="Rechercher un utilisateur"
            array={activeUsers}
            selectItem={onSelectItem}
          />
        )}
        {selectedUser && (
          <div>
            <SelectedUser>{selectedUser.username}</SelectedUser>
            <ModifyLink onClick={() => setSelectedUser(null)}>
              <u>Modifier</u>
            </ModifyLink>
          </div>
        )}
      </div>
      <div>
        <Warning>
          Au clic sur Valider, la structure sera modifiée avec le responsable
          choisi.
        </Warning>
        <RowContainer>
          <FButton
            type="white"
            name="close-outline"
            className="mr-8"
            onClick={props.toggleModal}
          >
            Annuler
          </FButton>
          <FButton
            type="validate"
            name="checkmark-outline"
            onClick={onValidate}
            disabled={!selectedUser}
          >
            Valider
          </FButton>
        </RowContainer>
      </div>
    </Modal>
  );
};
