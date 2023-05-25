import React, { useState } from "react";
import FInput from "components/UI/FInput";
import { UserDetail } from "components/Backend/UserDetail";
import { removeAccents } from "lib";
import styles from "./CustomUserSearchBar.module.scss";
import { GetActiveUsersResponse, Id } from "@refugies-info/api-types";

interface Props {
  dataArray: GetActiveUsersResponse[];
  onSelectItem: (data: GetActiveUsersResponse | null) => void;
  selectedItemId: Id | null;
}

const filterUser = (data: GetActiveUsersResponse[], search: string) => {
  return data.filter(
    (element) =>
      element.username &&
      element.username &&
      removeAccents(element.username)
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .toLowerCase()
        .includes(removeAccents(search.toLowerCase())),
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
        <div className={styles.container}>
          {filteredUsers.map((user, index) => (
            <UserDetail
              key={index}
              user={user}
              isSelected={props.selectedItemId === user._id}
              onSelectItem={props.onSelectItem}
            />
          ))}
        </div>
      )}
    </div>
  );
};
