import React, { useState } from "react";
import { SimplifiedUser } from "types/interface";
import styled from "styled-components";
import { ObjectId } from "mongodb";
import FInput from "components/FigmaUI/FInput/FInput";
import { UserDetail } from "components/Backend/UserDetail";
import { removeAccents } from "lib";

interface Props {
  dataArray: SimplifiedUser[];
  onSelectItem: (data: SimplifiedUser | null) => void;
  selectedItemId: ObjectId | null;
}

const UsersContainer = styled.div`
  max-height: 255px;
  overflow-y: auto;
`;

const filterUser = (data: SimplifiedUser[], search: string) => {
  return data.filter(
    (element) =>
      element.username &&
      element.username &&
      removeAccents(element.username)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(removeAccents(search.toLowerCase()))
  );
};
export const CustomUserSearchBar = (props: Props) => {
  const [value, setValue] = useState("");

  const onValueChange = (e: any) => {
    setValue(e.target.value);
    props.onSelectItem(null);
  };

  const filteredUsers = filterUser(props.dataArray, value);
  return (
    <div>
      <FInput
        id="value"
        value={value}
        onChange={onValueChange}
        newSize={true}
        autoFocus={true}
        append
        appendName="search-outline"
      />
      {value && (
        <UsersContainer>
          {filteredUsers.map((user, index) => (
            <UserDetail
              key={index}
              user={user}
              isSelected={props.selectedItemId === user._id}
              onSelectItem={props.onSelectItem}
            />
          ))}
        </UsersContainer>
      )}
    </div>
  );
};
