import CheckboxIcon from "components/UI/CheckboxIcon";
import { getDepartmentNameFromCode } from "lib/departments";
import React from "react";
import styles from "./CommonPlaceMenuItem.module.css";

interface Props {
  placeName: string;
  deptNo: string;
  onSelectCommonPlace: (depName: string) => void;
}

const CommonPlaceMenuItem: React.FC<Props> = ({ deptNo, placeName, onSelectCommonPlace }) => {
  return (
    <div className={styles.item}>
      <button className={styles.button} onClick={() => onSelectCommonPlace(getDepartmentNameFromCode(deptNo))}>
        <CheckboxIcon />
      </button>
      <span>
        {placeName} {deptNo}
      </span>
    </div>
  );
};

export default CommonPlaceMenuItem;
