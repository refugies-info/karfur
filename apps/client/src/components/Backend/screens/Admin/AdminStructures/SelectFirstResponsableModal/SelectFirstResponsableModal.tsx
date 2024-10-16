import { Id, PatchStructureRolesRequest, SimpleUser } from "@refugies-info/api-types";
import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Modal, Spinner } from "reactstrap";
import styled from "styled-components";
import Swal from "sweetalert2";
import FButton from "~/components/UI/FButton/FButton";
import SearchBar from "~/components/UI/SearchBar/SearchBar";
import { handleApiError } from "~/lib/handleApiErrors";
import { fetchAllStructuresActionsCreator } from "~/services/AllStructures/allStructures.actions";
import { structureSelector } from "~/services/AllStructures/allStructures.selector";
import { fetchAllUsersActionsCreator } from "~/services/AllUsers/allUsers.actions";
import { allActiveUsersSelector } from "~/services/AllUsers/allUsers.selector";
import { LoadingStatusKey } from "~/services/LoadingStatus/loadingStatus.actions";
import { isLoadingSelector } from "~/services/LoadingStatus/loadingStatus.selectors";
import API from "~/utils/API";
import { colors } from "~/utils/colors";
import styles from "./SelectFirstResponsableModal.module.scss";

const ModifyLink = styled.div`
  font-weight: bold;
  margin-top: 12px;
  cursor: pointer;
`;
const SelectedUser = styled.div`
  background: ${colors.white};
  width: 100%;
  padding: 8px;
  border-radius: 12px;
`;
const Header = styled.div`
  font-weight: 600;
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
  selectedStructureId: Id | null;
}
export const SelectFirstResponsableModal = (props: Props) => {
  const [selectedUser, setSelectedUser] = useState<SimpleUser | null>(null);

  const dispatch = useDispatch();
  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_ALL_STRUCTURES));

  const structureFromStore = useSelector(structureSelector(props.selectedStructureId));

  const activeUsers = useSelector(allActiveUsersSelector);

  const onValidate = async () => {
    try {
      if (!selectedUser || !structureFromStore || !props.selectedStructureId) return;

      const structure: PatchStructureRolesRequest = {
        membreId: selectedUser._id.toString(),
        action: "create",
      };

      await API.updateStructureMembers(props.selectedStructureId, structure);

      Swal.fire({
        title: "Yay...",
        text: "Responsable modifié",
        icon: "success",
        timer: 1500,
      });
      props.toggleModal();
      dispatch(fetchAllStructuresActionsCreator());
      dispatch(fetchAllUsersActionsCreator());
    } catch (error) {
      handleApiError({ text: "Erreur lors de la modification" });
      props.toggleModal();
    }
  };

  const onSelectItem = (data: SimpleUser) => setSelectedUser(data);

  if (isLoading || !props.selectedStructureId)
    return (
      <Modal
        isOpen={props.show}
        toggle={props.toggleModal}
        size="lg"
        className={styles.modal}
        contentClassName={styles.modal_content}
      >
        <Spinner />
      </Modal>
    );

  return (
    <Modal
      isOpen={props.show}
      toggle={props.toggleModal}
      size="lg"
      className={styles.modal}
      contentClassName={styles.modal_content}
    >
      <div>
        <Header>Choix d'un utilisateur</Header>
        {!selectedUser && (
          <SearchBar
            users
            className="search-bar inner-addon right-addon"
            placeholder="Rechercher un utilisateur"
            array={activeUsers}
            //@ts-ignore
            selectItem={onSelectItem}
          />
        )}
        {selectedUser && (
          <div>
            <SelectedUser>{selectedUser.username || selectedUser.email}</SelectedUser>
            <ModifyLink onClick={() => setSelectedUser(null)}>
              <u>Modifier</u>
            </ModifyLink>
          </div>
        )}
      </div>
      <div>
        <Warning>Au clic sur Valider, la structure sera modifiée avec le responsable choisi.</Warning>
        <RowContainer>
          <FButton type="white" name="close-outline" className="me-2" onClick={props.toggleModal}>
            Annuler
          </FButton>
          <FButton type="validate" name="checkmark-outline" onClick={onValidate} disabled={!selectedUser}>
            Valider
          </FButton>
        </RowContainer>
      </div>
    </Modal>
  );
};
