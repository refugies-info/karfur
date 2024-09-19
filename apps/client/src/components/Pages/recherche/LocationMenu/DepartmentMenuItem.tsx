import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "~/components/UI/Checkbox";
import { getDepartmentCodeFromName } from "~/lib/departments";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
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
    <div className={styles.item} onClick={(e) => e.preventDefault()}>
      <Checkbox checked={true} onChange={removeDepartement}>
        {dep} {getDepartmentCodeFromName(dep)}
      </Checkbox>
    </div>
  );
};

export default DepartmentMenuItem;
