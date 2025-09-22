import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import Checkbox from "~/components/UI/Checkbox";
import { getDepartmentCodeFromName } from "~/lib/departments";
import { onEnterOrSpace } from "~/lib/onEnterOrSpace";
import { addToQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "~/services/SearchResults/searchResults.selector";
import styles from "./DepartmentFilterItem.module.css";

interface Props {
  dep: string;
}

const DepartmentFilterItem: React.FC<Props> = ({ dep }) => {
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);

  const removeDepartement = useCallback(() => {
    const departments = query.departments.filter((d) => d !== dep);
    dispatch(
      addToQueryActionCreator({
        departments,
        sort: departments.length === 0 ? "default" : "location",
      }),
    );
  }, [dispatch, query.departments, dep]);

  const handleChange = useCallback(() => {
    removeDepartement();
  }, [removeDepartement]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
      onEnterOrSpace(e, removeDepartement);
    },
    [removeDepartement],
  );

  return (
    <Checkbox className={styles.container} checked={true} onChange={handleChange} onKeyDown={handleKeyDown}>
      <span className={styles.label}>
        {dep} {getDepartmentCodeFromName(dep)}
      </span>
    </Checkbox>
  );
};

export default DepartmentFilterItem;
