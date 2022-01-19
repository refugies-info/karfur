import { Spinner } from "reactstrap";
import SearchBar from "components/UI/SearchBar/SearchBar";
import React from "react";
import styled from "styled-components";
import { colors } from "colors";
import { Responsable, SimplifiedUser } from "types/interface";

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
  isLoading: boolean;
  activeUsers: SimplifiedUser[];
  onSelectItem: (data: SimplifiedUser) => void;
  responsable: Responsable | null;
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
        //@ts-ignore
        selectItem={props.onSelectItem}
      />
    );

  return (
    <div>
      <SelectedUser>{props.responsable.username}</SelectedUser>
      <ModifyLink onClick={props.removeRespo}>
        <u>Modifier</u>
      </ModifyLink>
    </div>
  );
};
