import { SimplifiedUser } from "../../../types/interface";
import React from "react";
import styled from "styled-components";
import marioProfile from "assets/mario-profile.jpg";
import { colors } from "../../../colors";
import EVAIcon from "../../../components/UI/EVAIcon/EVAIcon";

interface Props {
  user: SimplifiedUser;
  isSelected: boolean;
  onSelectItem: (data: SimplifiedUser) => void;
}

const UserDetailContainer = styled.div`
  width: 100%;
  height: 66px;
  margin-bottom: 10px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props) => (props.isSelected ? colors.focus : colors.noir)};
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  background: ${(props) => (props.isSelected ? colors.focus : "")};
  justify-content: space-between;

  &:hover {
    background: ${(props) => (props.isSelected ? colors.focus : colors.grey2)};
    border-color: ${(props) =>
      props.isSelected ? colors.focus : colors.grey2};
  }
`;

const Text = styled.div`
  font-size: 16px;
  line-height: 20px;
  color: ${(props) => (props.isSelected ? colors.blancSimple : colors.noir)};
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

export const UserDetail = (props: Props) => {
  const secureUrl =
    props.user && props.user.picture && props.user.picture.secure_url
      ? props.user.picture.secure_url
      : marioProfile;

  const getText = () => {
    if (props.user && props.user.email) {
      return `${props.user.username} - ${props.user.email}`;
    }
    return props.user.username;
  };
  return (
    <UserDetailContainer
      isSelected={props.isSelected}
      onClick={() => props.onSelectItem(props.user)}
    >
      <RowContainer>
        <img className="user-img mr-8" src={secureUrl} />
        <Text isSelected={props.isSelected}>{getText()}</Text>
      </RowContainer>
      <EVAIcon
        name={props.isSelected ? "radio-button-on" : "radio-button-off-outline"}
        fill={props.isSelected ? colors.blancSimple : colors.noir}
      />
    </UserDetailContainer>
  );
};
