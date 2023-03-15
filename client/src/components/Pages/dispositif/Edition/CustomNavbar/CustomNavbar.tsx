import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { cls } from "lib/classname";
import Button from "components/UI/Button";
import { calculateProgress, getText } from "./functions";
import styles from "./CustomNavbar.module.scss";

const CustomNavbar = () => {
  const total = Array(14).fill(true); // create an empty array with all steps
  const values = useWatch();
  const [progress, setProgress] = useState<number>(calculateProgress(values));

  useEffect(() => {
    setProgress(calculateProgress(values));
  }, [values]);

  return (
    <div className={styles.container}>
      <div className={cls("fr-container", styles.inner)}>
        <div className={styles.steps}>
          {total.map((_, i) => (
            <span key={i} className={cls(styles.step, i < progress && styles.done)} />
          ))}
          <p className={styles.label}>
            {progress} / {total.length}
          </p>
          <p className={styles.help}>{getText(progress)}</p>
        </div>
        <Button submit icon="checkmark-circle-2" iconPlacement="end">
          Terminer
        </Button>
      </div>
    </div>
  );
};

export default CustomNavbar;
