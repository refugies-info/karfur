import CheckboxIcon from "components/UI/CheckboxIcon";
import React from "react";
import styles from "./CommonPlaceMenuItem.module.css";

interface Props {
  placeName: string;
  deptNo: string;
}

const CommonPlaceMenuItem: React.FC<Props> = ({ deptNo, placeName }) => {
  return (
    <div className={styles.item}>
      <button className={styles.button}>
        <CheckboxIcon />
      </button>
      <span>
        {placeName} {deptNo}
      </span>
    </div>
  );
};

export default CommonPlaceMenuItem;
