import { GetActiveUsersResponse } from "@refugies-info/api-types";
import Image from "next/image";
import styled from "styled-components";
import marioProfile from "~/assets/mario-profile.jpg";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import { colors } from "~/utils/colors";

interface Props {
  user: GetActiveUsersResponse;
  isSelected: boolean;
  onSelectItem: (data: GetActiveUsersResponse) => void;
}

const UserDetailContainer = styled.div<{ isSelected: boolean }>`
  width: 100%;
  height: 66px;
  margin-bottom: 10px;
  border-width: 1px;
  border-style: solid;
  border-color: ${(props: { isSelected: boolean }) => (props.isSelected ? colors.focus : colors.gray90)};
  border-radius: 12px;
  padding: 8px;
  display: flex;
  flex-direction: row;
  align-items: center;
  cursor: pointer;
  background: ${(props: { isSelected: boolean }) => (props.isSelected ? colors.focus : "")};
  justify-content: space-between;

  &:hover {
    background: ${(props: { isSelected: boolean }) => (props.isSelected ? colors.focus : colors.grey2)};
    border-color: ${(props: { isSelected: boolean }) => (props.isSelected ? colors.focus : colors.grey2)};
  }
`;

const Text = styled.div<{ isSelected: boolean }>`
  font-size: 16px;
  line-height: 20px;
  color: ${(props: { isSelected: boolean }) => (props.isSelected ? colors.white : colors.gray90)};
`;

const RowContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
`;

const UserDetail = (props: Props) => {
  const secureUrl =
    props.user && props.user.picture && props.user.picture.secure_url ? props.user.picture.secure_url : marioProfile;

  const getText = () => {
    if (props.user?.username) return `${props.user.username} - ${props.user.email}`;
    return props.user.email;
  };
  return (
    <UserDetailContainer isSelected={props.isSelected} onClick={() => props.onSelectItem(props.user)}>
      <RowContainer>
        <Image
          className="user-img me-2"
          src={secureUrl}
          alt="user picture"
          width={70}
          height={40}
          style={{ objectFit: "contain" }}
        />
        <Text isSelected={props.isSelected}>{getText()}</Text>
      </RowContainer>
      <EVAIcon
        name={props.isSelected ? "radio-button-on" : "radio-button-off-outline"}
        fill={props.isSelected ? colors.white : colors.gray90}
      />
    </UserDetailContainer>
  );
};

export default UserDetail;
