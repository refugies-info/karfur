import { Spinner } from "reactstrap";
import SearchBar from "components/UI/SearchBar/SearchBar";
import React from "react";
import styled from "styled-components";
import { colors } from "colors";
import { GetActiveUsersResponse, GetAllStructuresResponse, GetAllUsersResponse } from "@refugies-info/api-types";

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

interface Props {
  isLoading: boolean;
  activeUsers: GetAllUsersResponse[];
  onSelectItem: (data: GetAllUsersResponse | GetActiveUsersResponse) => void;
  responsable: GetAllStructuresResponse["responsable"] | null;
  removeRespo: () => void;
}
export const ChooseResponsableComponent = (props: Props) => {
  if (props.isLoading) return <Spinner />;

  if (!props.responsable)
    return (
      <SearchBar
        users
        className="search-bar inner-addon right-addon"
        placeholder="Rechercher un utilisateur"
        array={props.activeUsers}
        selectItem={props.onSelectItem}
      />
    );

  return (
    <div>
      <SelectedUser>{props.responsable.username || props.responsable.email}</SelectedUser>
      <ModifyLink onClick={props.removeRespo}>
        <u>Modifier</u>
      </ModifyLink>
    </div>
  );
};
