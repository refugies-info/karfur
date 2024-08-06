import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import Checkbox from "components/UI/Checkbox";
import { cls } from "lib/classname";
import { getDepartmentCodeFromName } from "lib/departments";
import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import utilityStyles from "~css/utilities.module.css";
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
    <DropdownMenu.Item className={cls(styles.item, utilityStyles.noSelect)} onClick={(e) => e.preventDefault()}>
      <Checkbox checked={true} onChange={removeDepartement}>
        {dep} {getDepartmentCodeFromName(dep)}
      </Checkbox>
    </DropdownMenu.Item>
  );
};

export default DepartmentMenuItem;
