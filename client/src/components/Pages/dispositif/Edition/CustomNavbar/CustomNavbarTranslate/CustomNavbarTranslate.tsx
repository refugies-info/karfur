import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useRouter } from "next/router";
import { ContentType, TranslationContent } from "api-types";
import API from "utils/API";
import { cls } from "lib/classname";
import { TranslateForm } from "hooks/dispositif/useDispositifTranslateForm";
import PageContext from "utils/pageContext";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { calculateProgressTranslate, getMaxStepsTranslate } from "./functions";
import Tooltip from "components/UI/Tooltip";
import StepBar from "../StepBar";
import styles from "../CustomNavbar.module.scss";
import useAutosave from "./useAutosave";

interface Props {
  typeContenu: ContentType;
  defaultTranslation?: TranslationContent;
}

const CustomNavbarTranslate = (props: Props) => {
  const { isSaving } = useAutosave();
  const router = useRouter();
  const values = useWatch<TranslateForm>();
  const max = useMemo(() => getMaxStepsTranslate(props.defaultTranslation), [props.defaultTranslation]);
  const [progress, setProgress] = useState<number>(
    calculateProgressTranslate(values, props.typeContenu, props.defaultTranslation),
  );

  useEffect(() => {
    setProgress(calculateProgressTranslate(values, props.typeContenu, props.defaultTranslation));
  }, [values, props.typeContenu, props.defaultTranslation]);

  const { showMissingSteps, setShowMissingSteps } = useContext(PageContext);

  // Quit
  const [showQuitModal, setShowQuitModal] = useState(false);
  const toggleQuitModal = useCallback(() => setShowQuitModal((o) => !o), []);
  const quit = useCallback(() => router.push("/backend/user-dash-contrib"), [router]);
  const handleQuit = useCallback(() => {
    const isComplete = progress === 0;
    if (isComplete) {
      quit();
    } else {
      toggleQuitModal();
    }
  }, [progress, toggleQuitModal, quit]);

  // Publish
  const [showPublishModal, setShowPublishModal] = useState(false);
  const togglePublishModal = useCallback(() => setShowPublishModal((o) => !o), []);

  const handlePublish = useCallback(
    async (keepTranslations: boolean) => {
      const id = router.query.id;
      if (!id) return;
      API.publishDispositif(id, { keepTranslations });
    },
    [router.query.id],
  );

  return (
    <div className={styles.container}>
      <div className={cls("fr-container", styles.inner)}>
        <div className={styles.steps}>
          <StepBar total={max} progress={progress} text={`${progress} / ${max}`} />
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
          <Button
            icon={progress === max ? "checkmark-circle-2" : undefined}
            iconPlacement="end"
            onClick={togglePublishModal}
          >
            Sauvegarder au quitter
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CustomNavbarTranslate;
