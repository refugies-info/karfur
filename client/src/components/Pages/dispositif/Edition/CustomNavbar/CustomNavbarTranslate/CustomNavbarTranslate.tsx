import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useRouter } from "next/router";
import { ContentType, Languages, TranslationContent } from "api-types";
import API from "utils/API";
import { cls } from "lib/classname";
import { TranslateForm } from "hooks/dispositif/useDispositifTranslateForm";
import PageContext from "utils/pageContext";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import {
  calculateProgressTranslate,
  getMaxStepsTranslate,
  getMissingStepsTranslate,
  getPendingStepsTranslate,
  Step,
} from "./functions";
import Tooltip from "components/UI/Tooltip";
import StepBar from "../StepBar";
import styles from "../CustomNavbar.module.scss";
import useAutosave from "./useAutosave";
import { useUser } from "hooks";
import QuitModal from "./QuitModal";
import { useToggle } from "react-use";
import PublishModal from "./PublishModal";

interface Props {
  typeContenu: ContentType;
  defaultTranslation?: TranslationContent;
  locale?: Languages;
}

const CustomNavbarTranslate = (props: Props) => {
  const { isSaving } = useAutosave();
  const { user } = useUser();
  const router = useRouter();
  const values = useWatch<TranslateForm>();
  const { showMissingSteps, setShowMissingSteps } = useContext(PageContext);
  const max = useMemo(() => getMaxStepsTranslate(props.defaultTranslation), [props.defaultTranslation]);
  const progress = useMemo(
    () => calculateProgressTranslate(values, props.typeContenu, props.defaultTranslation),
    [values, props.typeContenu, props.defaultTranslation],
  );
  const missingSteps = useMemo(
    () =>
      getMissingStepsTranslate(values, props.typeContenu, props.defaultTranslation).filter((c) => c !== null) as Step[],
    [values, props.typeContenu, props.defaultTranslation],
  );
  const pendingSteps = useMemo(() => getPendingStepsTranslate(values), [values]);
  const isComplete = useMemo(() => progress === max, [progress, max]);

  // Quit
  const [showQuitModal, toggleQuitModal] = useToggle(false);
  const quit = useCallback(() => router.push("/backend/user-translation"), [router]);
  const handleQuit = useCallback(() => {
    if (user.expertTrad && !isComplete) {
      quit();
    } else {
      toggleQuitModal(true);
    }
  }, [quit, toggleQuitModal, user, isComplete]);

  // Publish
  const [showPublishModal, togglePublishModal] = useToggle(false);
  const handlePublish = useCallback(async () => {
    const id = router.query.id as string;
    if (!id || !isComplete || !props.locale) return;
    await API.publishTraduction({ dispositifId: id, language: props.locale });
  }, [router.query.id, isComplete, props.locale]);

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
          {user.expertTrad ? (
            <>
              <Button secondary icon="log-out-outline" iconPlacement="end" onClick={handleQuit} className="me-4">
                Finir plus tard
              </Button>
              <Button
                icon={progress === max ? "checkmark-circle-2" : undefined}
                iconPlacement="end"
                onClick={togglePublishModal}
              >
                Publier
              </Button>
            </>
          ) : (
            <Button icon="log-out-outline" iconPlacement="end" onClick={handleQuit}>
              Sauvegarder et quitter
            </Button>
          )}
        </div>
      </div>

      <QuitModal
        show={showQuitModal}
        toggle={toggleQuitModal}
        onQuit={quit}
        onPublish={() => {
          toggleQuitModal(false);
          togglePublishModal(true);
        }}
        missingSteps={missingSteps}
        pendingSteps={pendingSteps}
        isComplete={isComplete}
        progress={progress}
        locale={props.locale}
      />
      <PublishModal
        show={showPublishModal}
        toggle={togglePublishModal}
        onQuit={quit}
        onPublish={handlePublish}
        missingSteps={missingSteps}
        pendingSteps={pendingSteps}
        isComplete={isComplete}
        progress={progress}
        locale={props.locale}
      />
    </div>
  );
};

export default CustomNavbarTranslate;
