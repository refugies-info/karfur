import { useCallback, useContext, useEffect, useState } from "react";
import { useWatch } from "react-hook-form";
import { cls } from "lib/classname";
import { useLocale } from "hooks";
import PageContext from "utils/pageContext";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { calculateProgress, getText } from "./functions";
import Tooltip from "components/UI/Tooltip";
import QuitModal from "./QuitModal";
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

  const { showMissingSteps, setShowMissingSteps } = useContext(PageContext);

  const [showQuitModal, setShowQuitModal] = useState(false);
  const toggleQuitModal = useCallback(() => setShowQuitModal((o) => !o), []);

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
          <Button
            secondary={!showMissingSteps}
            id="missing-steps-btn"
            icon={showMissingSteps ? "eye-off-outline" : "eye-outline"}
            className={cls("ms-4", styles.btn)}
            onClick={() => setShowMissingSteps?.(!showMissingSteps)}
          />
          <Tooltip target="missing-steps-btn" placement="top">
            Voir les étapes restantes
          </Tooltip>
        </div>
        <div>
          <span id="save-status" className={styles.save}>
            <EVAIcon name="save" size={16} fill={styles.darkBackgroundElevationContrast} className="me-2" />
            Sauvegardé il y a quelques secondes
          </span>
          <Tooltip target="save-status" placement="top">
            Toutes les modifications sont sauvegardées automatiquement
          </Tooltip>
          <Button secondary icon="log-out-outline" iconPlacement="end" onClick={toggleQuitModal} className="me-4">
            Quitter
          </Button>
          <Button submit icon="checkmark-circle-2" iconPlacement="end">
            Valider
          </Button>
        </div>
      </div>

      <QuitModal show={showQuitModal} toggle={toggleQuitModal} onQuit={() => {}} />
    </div>
  );
};

export default CustomNavbar;
