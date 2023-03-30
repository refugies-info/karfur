import { useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { cls } from "lib/classname";
import { useLocale } from "hooks";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { calculateProgress, getText } from "./functions";
import styles from "./CustomNavbar.module.scss";

/**
 * Navbar of edition mode, which shows progress and validate buttons
 */
const CustomNavbar = () => {
  const total = Array(14).fill(true); // create an empty array with all steps
  const values = useWatch();
  const [progress, setProgress] = useState<number>(calculateProgress(values));

  const initialLocale = useLocale();
  const [showLanguageWarning, setShowLanguageWarning] = useState(initialLocale !== "fr");

  useEffect(() => {
    setProgress(calculateProgress(values));
  }, [values]);

  return (
    <div className={styles.container}>
      {showLanguageWarning && (
        <div className={styles.warning}>
          <div className={cls("fr-container", styles.inner)}>
            <span>
              <EVAIcon name="info" size={24} fill={styles.lightBorderPlainInfo} className="me-4" />
              L’éditeur de fiche est disponible uniquement en français. Rédigez bien votre fiche en français.
            </span>
            <button onClick={() => setShowLanguageWarning(false)}>
              <EVAIcon name="close-outline" size={16} fill={styles.lightBorderPlainInfo} />
            </button>
          </div>
        </div>
      )}
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
