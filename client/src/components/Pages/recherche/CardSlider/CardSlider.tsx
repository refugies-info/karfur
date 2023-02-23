import React, { useEffect, useRef, useState } from "react";
import { cls } from "lib/classname";
import { Button } from "reactstrap";
import useRTL from "hooks/useRTL";
import DemarcheCard from "components/UI/DemarcheCard";
import DispositifCard from "components/UI/DispositifCard";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./CardSlider.module.scss";
import { ContentType, GetDispositifsResponse } from "api-types";

interface Props {
  cards: GetDispositifsResponse[];
  type: ContentType;
}

const DISP_GAP = 32;
const DEM_GAP = 24;
const NEGATIVE_MARGINS_LG = 160 * 2;
const NEGATIVE_MARGINS_MD = 50 * 2;
const RESPONSIVE_WIDTH_LIMIT = 1400;

const CardSlider = (props: Props) => {
  const isRTL = useRTL();
  const slider = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(2);
  const gap = props.type === ContentType.DISPOSITIF ? DISP_GAP : DEM_GAP;

  const slide = (direction: "prev" | "next") => {
    let newPage = page;
    if (direction === "next" && page + 1 <= maxPage) {
      newPage = page + 1;
    } else if (direction === "prev" && page - 1 >= 0) {
      newPage = page - 1;
    }
    setPage(newPage);
  };

  const margins =
    (slider.current?.clientWidth || 0) > RESPONSIVE_WIDTH_LIMIT ? NEGATIVE_MARGINS_LG : NEGATIVE_MARGINS_MD;

  useEffect(() => {
    setTimeout(() => {
      const newMaxPage = slider.current
        ? (slider.current.scrollWidth - margins) / (slider.current.clientWidth - margins)
        : 0;
      setMaxPage(newMaxPage);
    }, 200); // fix because scrollWidth seems not accurate for demarches
  }, [margins, props.cards]);

  useEffect(() => {
    if (!slider.current) return;
    const pageWidth = slider.current.clientWidth - margins + gap;
    slider.current.scroll({
      left: page * pageWidth * (isRTL ? -1 : 1),
      top: 0,
      behavior: "smooth",
    });
  }, [page, gap, margins, isRTL]);

  return (
    <div className={cls(styles.container, "content-card-slider")}>
      {page > 0 && (
        <Button className={cls(styles.btn, styles.prev)} onClick={() => slide("prev")}>
          <EVAIcon name="arrow-back-outline" fill="white" size={40} />
        </Button>
      )}
      {page + 1 < Math.round(maxPage) && (
        <Button className={cls(styles.btn, styles.next)} onClick={() => slide("next")}>
          <EVAIcon name="arrow-forward-outline" fill="white" size={40} />
        </Button>
      )}
      <div
        ref={slider}
        className={cls(styles.slider, props.type === ContentType.DEMARCHE ? styles.demarches : styles.dispositifs)}
      >
        {props.cards.map((d) => (
          <div key={d._id.toString()} className={styles.card}>
            {props.type === ContentType.DEMARCHE ? <DemarcheCard demarche={d} /> : <DispositifCard dispositif={d} />}
          </div>
        ))}
      </div>
    </div>
  );
};

export default CardSlider;
