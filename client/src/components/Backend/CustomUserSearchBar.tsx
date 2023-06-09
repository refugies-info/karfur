import React, { useEffect, useState } from "react";
import debounce from "lodash/debounce";
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

const debouncedQuery = debounce(
  (data: GetActiveUsersResponse[], search: string, callback: (res: GetActiveUsersResponse[]) => void) => {
    const res = filterUser(data, search);
    callback(res);
  },
  500,
);

export const CustomUserSearchBar = (props: Props) => {
  const [value, setValue] = useState("");
  const [filteredUsers, setFilteredUsers] = useState<GetActiveUsersResponse[]>([]);

  const onValueChange = (e: any) => {
    setValue(e.target.value);
    props.onSelectItem(null);
  };

  useEffect(() => {
    debouncedQuery(props.dataArray, value, (res) => setFilteredUsers(res));
  }, [props.dataArray, value]);

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
