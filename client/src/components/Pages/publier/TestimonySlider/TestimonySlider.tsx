import React, { useEffect, useRef, useState } from "react";
import { Button, Col } from "reactstrap";
import useRTL from "hooks/useRTL";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { cls } from "lib/classname";
import TestimonyAuthor from "./TestimonyAuthor";
import styles from "./TestimonySlider.module.scss";

type Testimony = {
  text: string;
  image: any;
  name: string;
  position: string;
};

interface Props {
  testimonies: Testimony[];
}

const TestimonySlider = (props: Props) => {
  const isRTL = useRTL();
  const slider = useRef<any>(null);
  const [page, setPage] = useState(0);

  const maxPage = props.testimonies.length;
  const slide = (direction: "prev" | "next") => {
    let newPage = page;
    if (direction === "next" && page + 1 <= maxPage) {
      newPage = page + 1;
    } else if (direction === "prev" && page - 1 >= 0) {
      newPage = page - 1;
    }
    setPage(newPage);
  };

  useEffect(() => {
    if (!slider.current) return;
    const pageWidth = slider.current.clientWidth;
    slider.current.scroll({
      left: page * pageWidth * (isRTL ? -1 : 1),
      top: 0,
      behavior: "smooth"
    });
  }, [page, isRTL]);

  return (
    <div className={styles.container}>
      {page > 0 && (
        <Button className={cls(styles.btn, styles.prev)} onClick={() => slide("prev")}>
          <EVAIcon name="arrow-back-outline" fill="#055e5a" size={24} />
        </Button>
      )}
      {page + 1 < Math.round(maxPage) && (
        <Button className={cls(styles.btn, styles.next)} onClick={() => slide("next")}>
          <EVAIcon name="arrow-forward-outline" fill="#055e5a" size={24} />
        </Button>
      )}
      <div ref={slider} className={styles.slider}>
        {props.testimonies.map((testimony, i) => (
          <Col key={i} className={styles.testimony}>
            <p>{testimony.text}</p>
            <TestimonyAuthor image={testimony.image} name={testimony.name} position={testimony.position} />
          </Col>
        ))}
      </div>
    </div>
  );
};

export default TestimonySlider;
