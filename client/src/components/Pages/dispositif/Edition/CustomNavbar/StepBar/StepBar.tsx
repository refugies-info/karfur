import React, { useMemo } from "react";
import { cls } from "lib/classname";
import styles from "./StepBar.module.scss";

interface Props {
  total: number;
  progress: number;
  text: string;
}

const StepBar = (props: Props) => {
  const totalArray = useMemo(() => Array(props.total).fill(true), [props.total]);

  return (
    <div className={styles.container}>
      {totalArray.map((_, i) => (
        <span key={i} className={cls(styles.step, i < props.progress && styles.done)} />
      ))}
      <span className={styles.label}>{props.text}</span>
    </div>
  );
};

export default StepBar;
