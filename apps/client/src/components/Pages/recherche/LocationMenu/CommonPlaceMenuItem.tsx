import React from "react";
import Checkbox from "~/components/UI/Checkbox";
import { getDepartmentNameFromCode } from "~/lib/departments";
import styles from "./CommonPlaceMenuItem.module.css";

interface Props {
  placeName: string;
  deptNo: string;
  onSelectCommonPlace: (depName: string) => void;
  count: number;
}

const CommonPlaceMenuItem: React.FC<Props> = ({ deptNo, placeName, onSelectCommonPlace, count }) => {
  return (
    <>
      <span className={styles.item}>
        <Checkbox className={styles.item} onChange={() => onSelectCommonPlace(getDepartmentNameFromCode(deptNo))}>
                    <span>
            {placeName} {deptNo} <span className={styles.count}>({count})</span>
          </span>
        </Checkbox>
      </span>{" "}
    </>
  );
};

export default CommonPlaceMenuItem;
