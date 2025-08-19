import React from "react";
import Checkbox from "~/components/UI/Checkbox";
import useStylesDisabled from "~/hooks/useStyleDisabled";
import { getDepartmentNameFromCode } from "~/lib/departments";
import { onEnterOrSpace } from "~/lib/onEnterOrSpace";
import styles from "./CommonPlaceMenuItem.module.css";

interface Props {
  placeName: string;
  deptNo: string;
  onSelectCommonPlace: (depName: string) => void;
}

const CommonPlaceMenuItem: React.FC<Props> = ({ deptNo, placeName, onSelectCommonPlace }) => {
  const stylesDisabled = useStylesDisabled();
  const action = () => onSelectCommonPlace(getDepartmentNameFromCode(deptNo));

  return (
    <>
      <span className={styles.item}>
        {stylesDisabled ? (
          <span onClick={action} onKeyDown={(e) => onEnterOrSpace(e, action)} role="button" tabIndex={0}>
            {placeName} {deptNo}
          </span>
        ) : (
          <Checkbox className={styles.item} onChange={action}>
            <span>
              {placeName} {deptNo}
            </span>
          </Checkbox>
        )}
      </span>{" "}
    </>
  );
};

export default CommonPlaceMenuItem;
