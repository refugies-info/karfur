import React, { useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import CheckboxIcon from "~/components/UI/Checkbox/CheckboxIcon";
import { getDepartmentCodeFromName } from "~/lib/departments";
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

  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      removeDepartement();
    },
    [removeDepartement],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        removeDepartement();
      }
    },
    [removeDepartement],
  );

  return (
    <div
      className={styles.container}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Retirer le filtre ${dep}`}
    >
      <div className={styles.checkbox} aria-hidden="true">
        <CheckboxIcon />
      </div>
      <span className={styles.label}>
        {dep} {getDepartmentCodeFromName(dep)}
      </span>
    </div>
  );
};

export default DepartmentFilterItem;
