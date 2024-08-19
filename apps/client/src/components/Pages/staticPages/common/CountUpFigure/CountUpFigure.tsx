import React from "react";
import CountUp from "react-countup";
import { InView } from "react-intersection-observer";
import styles from "./CountUpFigure.module.scss";

interface Props {
  number: number;
  text: string;
}

const CountUpFigure = (props: Props) => {
  return (
    <>
      <div className={styles.figure}>
        <InView>
          {({ inView, ref }) => <div ref={ref}>{inView ? <CountUp end={props.number} separator=" " /> : 0}</div>}
        </InView>
      </div>
      <p className={styles.label}>{props.text}</p>
    </>
  );
};

export default CountUpFigure;
