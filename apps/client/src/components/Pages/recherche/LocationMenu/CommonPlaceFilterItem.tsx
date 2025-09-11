import React, { useCallback } from "react";
import { getDepartmentNameFromCode } from "~/lib/departments";
import CheckboxIcon from "~/components/UI/Checkbox/CheckboxIcon";
import styles from "./CommonPlaceFilterItem.module.css";

interface Props {
  placeName: string;
  deptNo: string;
  onSelectCommonPlace: (depName: string) => void;
}

const CommonPlaceFilterItem: React.FC<Props> = ({ deptNo, placeName, onSelectCommonPlace }) => {
  const handleClick = useCallback(
    (e: React.MouseEvent) => {
      e.preventDefault();
      onSelectCommonPlace(getDepartmentNameFromCode(deptNo));
    },
    [deptNo, onSelectCommonPlace],
  );

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        onSelectCommonPlace(getDepartmentNameFromCode(deptNo));
      }
    },
    [deptNo, onSelectCommonPlace],
  );

  return (
    <div
      className={styles.container}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      role="button"
      tabIndex={0}
      aria-label={`Ajouter le filtre ${placeName} (${deptNo})`}
    >
      <div className={styles.checkbox} aria-hidden="true">
        <CheckboxIcon />
      </div>
      <span className={styles.label}>
        {placeName} {deptNo}
      </span>
    </div>
  );
};

export default CommonPlaceFilterItem;
