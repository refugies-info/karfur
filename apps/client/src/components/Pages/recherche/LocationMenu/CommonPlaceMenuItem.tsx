import Checkbox from "@/components/UI/Checkbox";
import { getDepartmentNameFromCode } from "@/lib/departments";
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
      <Checkbox className={styles.item} onChange={() => onSelectCommonPlace(getDepartmentNameFromCode(deptNo))}>
        <span>
          {placeName} {deptNo}
        </span>
      </Checkbox>
    </div>
  );
};

export default CommonPlaceMenuItem;
