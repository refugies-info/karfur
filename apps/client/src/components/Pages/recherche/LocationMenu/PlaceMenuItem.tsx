import React, { useMemo } from "react";
import Checkbox from "~/components/UI/Checkbox";
import useStylesDisabled from "~/hooks/useStyleDisabled";
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
  const stylesDisabled = useStylesDisabled();
  const action = () => onSelectPrediction(p);

  return stylesDisabled ? (
    <div className={styles.item} onClick={action} onKeyDown={(e) => onEnterOrSpace(e, action)} role="button" tabIndex={0}>
      <span>
        {placeName} {deptNo}
      </span>
    </div>
  ) : (
    <Checkbox className={styles.item} onChange={action} onKeyDown={(e) => onEnterOrSpace(e, action)}>
      <span>
        {placeName} {deptNo}
      </span>
    </Checkbox>
  );
};

export default PlaceMenuItem;
