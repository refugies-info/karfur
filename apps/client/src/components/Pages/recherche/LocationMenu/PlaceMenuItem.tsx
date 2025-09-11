import React, { useMemo } from "react";
import Checkbox from "~/components/UI/Checkbox";
import { onEnterOrSpace } from "~/lib/onEnterOrSpace";
import { getPlaceName } from "./functions";
import styles from "./PlaceMenuItem.module.css";

interface Props {
  p: any;
  onSelectPrediction: (place: any) => void;
}

const PlaceMenuItem: React.FC<Props> = ({ p, onSelectPrediction }) => {
  const placeName = useMemo(() => getPlaceName(p), [p]);
  const deptNo = p.properties.context.split(",")[0];
  return (
    <Checkbox
      className={styles.item}
      onChange={() => onSelectPrediction(p)}
      onKeyDown={(e) => onEnterOrSpace(e, () => onSelectPrediction(p))}
    >
      <span>
        {placeName} {deptNo}
      </span>
    </Checkbox>
  );
};

export default PlaceMenuItem;
