import React, { useEffect, useState } from "react";
import { Modal } from "reactstrap";
import FButton from "components/UI/FButton/FButton";
import styled from "styled-components";
import { colors } from "colors";
import { useDispatch, useSelector } from "react-redux";
import { fetchActiveUsersActionCreator } from "services/ActiveUsers/activeUsers.actions";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { activeUsersSelector } from "services/ActiveUsers/activeUsers.selector";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { CustomUserSearchBar } from "components/Backend/CustomUserSearchBar";
import styles from "./MemberModal.module.scss";
import { GetActiveUsersResponse, Id, StructureMember } from "@refugies-info/api-types";

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
  color: ${colors.white};
  margin-bottom: 15px;
`;

interface Props {
  show: boolean;
  toggle: () => void;
  addUserInStructure: (arg: Id) => void;
  membres: StructureMember[];
}

const AddMemberModal = (props: Props) => {
  const [selectedUser, setSelectedUser] = useState<GetActiveUsersResponse | null>(null);

  const onSelectItem = (data: GetActiveUsersResponse | null) => setSelectedUser(data);

  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(fetchActiveUsersActionCreator());
  }, [dispatch]);

  const isLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USERS));

  const activeUsers = useSelector(activeUsersSelector);

  const addUserInStructure = () => {
    if (!selectedUser) return;
    props.addUserInStructure(selectedUser._id);
  };

  return (
    <Modal isOpen={props.show} toggle={props.toggle} className={styles.modal} contentClassName={styles.modal_content}>
      <Title>Ajouter un membre</Title>
      <InformationContainer>
        <b>Attention :</b> assurez-vous que la personne que vous souhaitez ajouter a déjà créé un compte sur
        réfugiés.info.
      </InformationContainer>
      {isLoading && (
        <SkeletonTheme baseColor={colors.white}>
          <Skeleton count={1} height={50} />
        </SkeletonTheme>
      )}

      {!isLoading && (
        <CustomUserSearchBar
          dataArray={activeUsers}
          excludedUsers={props.membres.map((m) => m.userId)}
          onSelectItem={onSelectItem}
          selectedItemId={selectedUser ? selectedUser._id : null}
        />
      )}

      <RowContainer>
        <FButton type="outline-black" name="close-outline" onClick={props.toggle} className="me-2">
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

export default AddMemberModal;
