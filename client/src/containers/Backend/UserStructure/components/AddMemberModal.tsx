import React, { useEffect, useState } from "react";
import { Modal } from "reactstrap";

import "./MemberModal.scss";
import FButton from "../../../../components/FigmaUI/FButton/FButton";
import styled from "styled-components";
import { colors } from "../../../../colors";
import { useDispatch, useSelector } from "react-redux";
import { fetchAllUsersActionsCreator } from "../../../../services/AllUsers/allUsers.actions";
import { isLoadingSelector } from "../../../../services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "../../../../services/LoadingStatus/loadingStatus.actions";
import { activeUsersSelector } from "../../../../services/AllUsers/allUsers.selector";
import { SimplifiedUser } from "../../../../types/interface";
import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import { ObjectId } from "mongodb";
import { CustomUserSearchBar } from "../../../UI/CustomUserSearchBar/CustomUserSearchBar";

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

interface Props {
  show: boolean;
  toggle: () => void;
  addUserInStructure: (arg: ObjectId) => void;
}

export const AddMemberModal = (props: Props) => {
  const [selectedUser, setSelectedUser] = useState<SimplifiedUser | null>(null);

  const onSelectItem = (data: SimplifiedUser | null) => setSelectedUser(data);

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

      {!isLoading && (
        <CustomUserSearchBar
          dataArray={activeUsers}
          onSelectItem={onSelectItem}
          selectedItemId={selectedUser ? selectedUser._id : null}
        />
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
