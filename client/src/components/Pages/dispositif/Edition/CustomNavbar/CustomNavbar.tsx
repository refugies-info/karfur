import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { ContentType, CreateDispositifRequest, DispositifStatus } from "api-types";
import API from "utils/API";
import { cls } from "lib/classname";
import { isStatus } from "lib/dispositif";
import { useLocale } from "hooks";
import { useAutosave } from "hooks/dispositif";
import PageContext from "utils/pageContext";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { calculateProgress, getText } from "./functions";
import Tooltip from "components/UI/Tooltip";
import QuitModal from "./QuitModal";
import PublishModal from "./PublishModal";
import StepBar from "./StepBar";
import styles from "./CustomNavbar.module.scss";

interface Props {
  typeContenu: ContentType;
}

/**
 * Navbar of edition mode, which shows progress and validate buttons.
 * Responsible for autosave
 */
const CustomNavbar = (props: Props) => {
  const { isSaving } = useAutosave();
  const router = useRouter();
  const total = 14;
  const values = useWatch<CreateDispositifRequest>();
  const dispositif = useSelector(selectedDispositifSelector);
  const [progress, setProgress] = useState<number>(calculateProgress(values, props.typeContenu));

  const initialLocale = useLocale();
  const [showLanguageWarning, setShowLanguageWarning] = useState(initialLocale !== "fr");

  useEffect(() => {
    setProgress(calculateProgress(values, props.typeContenu));
  }, [values, props.typeContenu]);

  const { showMissingSteps, setShowMissingSteps } = useContext(PageContext);

  // Quit
  const [showQuitModal, setShowQuitModal] = useState(false);
  const toggleQuitModal = useCallback(() => setShowQuitModal((o) => !o), []);
  const quit = useCallback(() => router.push("/backend/user-dash-contrib"), [router]);
  const handleQuit = useCallback(() => {
    const isComplete = progress === 0;
    if (
      // no status
      !dispositif?.status ||
      // waiting and complete
      (isStatus(dispositif.status, [DispositifStatus.WAITING_ADMIN, DispositifStatus.WAITING_STRUCTURE]) &&
        isComplete) ||
      // deleted or rejected
      isStatus(dispositif.status, [DispositifStatus.DELETED, DispositifStatus.KO_STRUCTURE])
    ) {
      quit();
    } else {
      toggleQuitModal();
    }
  }, [dispositif, progress, toggleQuitModal, quit]);

  // Publish
  const [showPublishModal, setShowPublishModal] = useState(false);
  const togglePublishModal = useCallback(() => setShowPublishModal((o) => !o), []);
  const hideValidateButton = useMemo(() => {
    return isStatus(dispositif?.status, [
      DispositifStatus.KO_STRUCTURE,
      DispositifStatus.DELETED,
      DispositifStatus.NO_STRUCTURE,
    ]);
  }, [dispositif]);
  const handlePublish = useCallback(
    async (keepTranslations: boolean) => {
      if (!dispositif?._id) return;
      API.publishDispositif(dispositif._id, { keepTranslations });
    },
    [dispositif],
  );

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
          <StepBar total={total} progress={progress} text={`${progress} / ${total}`} />
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
            <EVAIcon
              name={isSaving ? "sync-outline" : "save"}
              size={16}
              fill={styles.darkBackgroundElevationContrast}
              className="me-2"
            />
            <span>{isSaving ? "Sauvegarde en cours..." : "Sauvegardé il y a quelques secondes"}</span>
          </span>
          <Tooltip target="save-status" placement="top">
            Toutes les modifications sont sauvegardées automatiquement
          </Tooltip>
          <Button secondary icon="log-out-outline" iconPlacement="end" onClick={handleQuit} className="me-4">
            Quitter
          </Button>
          {!hideValidateButton && (
            <Button
              icon={progress === total ? "checkmark-circle-2" : undefined}
              iconPlacement="end"
              onClick={togglePublishModal}
            >
              Valider
            </Button>
          )}
        </div>
      </div>

      <QuitModal
        show={showQuitModal}
        toggle={toggleQuitModal}
        onQuit={quit}
        onPublish={() => {
          toggleQuitModal();
          togglePublishModal();
        }}
        status={dispositif?.status || null}
        isComplete={progress === 0}
      />
      <PublishModal
        show={showPublishModal}
        typeContenu={props.typeContenu}
        toggle={togglePublishModal}
        onQuit={toggleQuitModal}
        onPublish={handlePublish}
        status={dispositif?.status || null}
      />
    </div>
  );
};

export default CustomNavbar;
