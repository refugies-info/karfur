import React, { useEffect, useRef, useState } from "react";
import { cls } from "lib/classname";
import { Button } from "reactstrap";
import useRTL from "hooks/useRTL";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import styles from "./ContentSlider.module.scss";

interface Props {
  cards: React.ReactNode[];
  gap?: number;
  className?: string;
  btnClassName?: string;
}

const NEGATIVE_MARGINS_LG = 160 * 2;
const NEGATIVE_MARGINS_MD = 50 * 2;
const RESPONSIVE_WIDTH_LIMIT = 1400;

const ContentSlider = (props: Props) => {
  const isRTL = useRTL();
  const slider = useRef<HTMLDivElement | null>(null);
  const [page, setPage] = useState(0);
  const [maxPage, setMaxPage] = useState(2);
  const gap = props.gap || 0;

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
        ? (slider.current.scrollWidth - margins - gap * 2) / (slider.current.clientWidth - margins)
        : 0;
      setMaxPage(Math.ceil(newMaxPage));
    }, 200); // fix because scrollWidth seems not accurate for demarches
  }, [margins, props.cards, gap]);

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
        <Button className={cls(styles.btn, styles.prev, props.btnClassName)} onClick={() => slide("prev")}>
          <EVAIcon name="arrow-back-outline" fill="white" size={40} />
        </Button>
      )}
      {page + 1 < Math.round(maxPage) && (
        <Button className={cls(styles.btn, styles.next, props.btnClassName)} onClick={() => slide("next")}>
          <EVAIcon name="arrow-forward-outline" fill="white" size={40} />
        </Button>
      )}
      <div ref={slider} className={cls(styles.slider, props.className)} style={{ gap }}>
        {props.cards.map((d, i) => (
          <div key={i} className={styles.card}>
            {d}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ContentSlider;
