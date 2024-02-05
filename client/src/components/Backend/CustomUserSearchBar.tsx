import React, { useState } from "react";
import debounce from "lodash/debounce";
import FInput from "components/UI/FInput";
import { UserDetail } from "components/Backend/UserDetail";
import { removeAccents } from "lib";
import styles from "./CustomUserSearchBar.module.scss";
import { GetActiveUsersResponse, Id } from "@refugies-info/api-types";

interface Props {
  dataArray: GetActiveUsersResponse[];
  excludedUsers?: Id[];
  onSelectItem: (data: GetActiveUsersResponse | null) => void;
  selectedItemId: Id | null;
}

const filterUser = (data: GetActiveUsersResponse[], excludedUsers: Id[], search: string) => {
  const normalizedSearch = removeAccents(search.toLowerCase());
  return data.filter(
    (element) =>
      (!excludedUsers.includes(element._id) &&
        element.username &&
        removeAccents(element.username)
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(normalizedSearch)) ||
      (element.email &&
        element.email
          .normalize("NFD")
          .replace(/[\u0300-\u036f]/g, "")
          .toLowerCase()
          .includes(normalizedSearch)),
  );
};

const debouncedQuery = debounce(
  (
    data: GetActiveUsersResponse[],
    excludedUsers: Id[],
    search: string,
    callback: (res: GetActiveUsersResponse[]) => void,
  ) => {
    const res = filterUser(data, excludedUsers, search);
    callback(res);
  },
  500,
);

export const CustomUserSearchBar = (props: Props) => {
  const [value, setValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<GetActiveUsersResponse[]>([]);

  const onValueChange = (e: any) => {
    setValue(e.target.value);
    debouncedQuery(props.dataArray, props.excludedUsers || [], value, (res) => setFilteredUsers(res));
    props.onSelectItem(null);
  };

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
