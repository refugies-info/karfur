import React from "react";
import { ContentType, GetDispositifsResponse } from "api-types";
import DemarcheCard from "components/UI/DemarcheCard";
import DispositifCard from "components/UI/DispositifCard";
import ContentSlider from "components/UI/ContentSlider";
import styles from "./CardSlider.module.scss";

interface Props {
  cards: GetDispositifsResponse[];
  type: ContentType;
}

const DISP_GAP = 32;
const DEM_GAP = 24;

const CardSlider = (props: Props) => {
  return (
    <ContentSlider
      cards={props.cards.map((d) =>
        props.type === ContentType.DEMARCHE ? <DemarcheCard demarche={d} /> : <DispositifCard dispositif={d} />,
      )}
      gap={props.type === ContentType.DISPOSITIF ? DISP_GAP : DEM_GAP}
      className={props.type === ContentType.DEMARCHE ? styles.demarches : styles.dispositifs}
    />
  );
};

export default CardSlider;
