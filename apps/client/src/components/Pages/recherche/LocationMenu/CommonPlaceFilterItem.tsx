import React, { useCallback } from "react";
import Checkbox from "~/components/UI/Checkbox";
import { onEnterOrSpace } from "~/lib/onEnterOrSpace";
import { getDepartmentNameFromCode } from "~/lib/departments";
import styles from "./CommonPlaceFilterItem.module.css";

interface Props {
  placeName: string;
  deptNo: string;
  onSelectCommonPlace: (depName: string) => void;
}

const CommonPlaceFilterItem: React.FC<Props> = ({ deptNo, placeName, onSelectCommonPlace }) => {
  const handleChange = useCallback(() => {
    onSelectCommonPlace(getDepartmentNameFromCode(deptNo));
  }, [deptNo, onSelectCommonPlace]);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLButtonElement | HTMLDivElement>) => {
      onEnterOrSpace(e, () => onSelectCommonPlace(getDepartmentNameFromCode(deptNo)));
    },
    [deptNo, onSelectCommonPlace],
  );

  return (
    <Checkbox
      className={styles.container}
      checked={false}
      onChange={handleChange}
      onKeyDown={handleKeyDown}
      aria-label={`Ajouter le filtre ${placeName} (${deptNo})`}
    >
      <span className={styles.label}>
        {placeName} {deptNo}
      </span>
    </Checkbox>
  );
};

export default CommonPlaceFilterItem;
