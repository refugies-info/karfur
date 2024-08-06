import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Checkbox from "components/UI/Checkbox";
import { getDepartmentCodeFromName } from "lib/departments";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import styles from "./DepartmentMenuItem.module.css";

interface Props {
  dep: string;
}

const DepartmentMenuItem: React.FC<Props> = ({ dep }) => {
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);

  const removeDepartement = useCallback(() => {
    const departments = query.departments.filter((d) => d !== dep);
    dispatch(
      addToQueryActionCreator({
        departments,
        sort: departments.length === 0 ? "date" : "location",
      }),
    );
  }, [dispatch, query.departments, dep]);

  return (
    <DropdownMenu.Item className={styles.item}>
      <Checkbox checked={true} onChange={removeDepartement}>
        {dep} {getDepartmentCodeFromName(dep)}
      </Checkbox>
    </DropdownMenu.Item>
  );
};

export default DepartmentMenuItem;
