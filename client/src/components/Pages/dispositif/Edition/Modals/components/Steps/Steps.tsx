import React, { useMemo } from "react";
import { cls } from "lib/classname";
import styles from "./Steps.module.scss";

interface Props {
  step: number;
  maxStep: number;
}

const Steps = (props: Props) => {
  const steps = useMemo(() => Array(props.maxStep).fill(true), [props.maxStep]);
  return (
    <div className={styles.container}>
      {steps.map((_, i) => (
        <div
          key={i}
          className={cls(styles.step, i + 1 === props.step && styles.current, props.step > i + 1 && styles.done)}
        >
          {i + 1}
        </div>
      ))}
    </div>
  );
};

export default Steps;
