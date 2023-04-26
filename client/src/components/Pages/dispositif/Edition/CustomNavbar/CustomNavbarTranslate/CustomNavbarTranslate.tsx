import { useCallback, useContext } from "react";
import { useRouter } from "next/router";
import { ContentType, Languages, TranslationContent } from "api-types";
import API from "utils/API";
import { cls } from "lib/classname";
import { Progress } from "hooks/dispositif";
import PageContext from "utils/pageContext";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import Camembert from "components/UI/Camembert";
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
  progress?: Progress;
}

const defaultProgress: Progress = {
  isComplete: false,
  totalSteps: 6,
  doneSteps: 0,
  missingSteps: [],
  pendingSteps: [],
  reviewSteps: [],
  totalWords: 1,
  doneWords: 1,
  myDoneWords: 1,
};

const CustomNavbarTranslate = (props: Props) => {
  const { locale } = props;
  const progress = props.progress || defaultProgress;
  const { isSaving } = useAutosave();
  const { user } = useUser();
  const router = useRouter();
  const { showMissingSteps, setShowMissingSteps } = useContext(PageContext);

  // Quit
  const [showQuitModal, toggleQuitModal] = useToggle(false);
  const quit = useCallback(() => router.push("/backend/user-translation"), [router]);
  const handleQuit = useCallback(() => {
    if (user.expertTrad && !progress.isComplete) {
      quit();
    } else {
      toggleQuitModal(true);
    }
  }, [quit, toggleQuitModal, user, progress.isComplete]);

  // Publish
  const [showPublishModal, togglePublishModal] = useToggle(false);
  const handlePublish = useCallback(async () => {
    const id = router.query.id as string;
    if (!id || !progress.isComplete || !locale) return;
    await API.publishTraduction({ dispositifId: id, language: locale });
  }, [router.query.id, progress.isComplete, locale]);
  return (
    <div className={styles.container}>
      <div className={cls("fr-container", styles.inner)}>
        <div className={styles.steps}>
          <StepBar
            total={progress.totalSteps}
            progress={progress.doneSteps}
            text={`${progress.doneSteps} / ${progress.totalSteps}`}
          />
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

          <div className={styles.progress}>
            <Camembert progress={progress.doneWords / progress.totalWords} />
            <p>{`${progress.doneWords}/${progress.totalWords} mots ${user.expertTrad ? "validés" : "traduits"}`}</p>
          </div>
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
                icon={progress.isComplete ? "checkmark-circle-2" : undefined}
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
        pendingSteps={progress.pendingSteps}
        isComplete={progress.isComplete}
        progress={progress.doneSteps}
        locale={locale}
        nbWords={progress.myDoneWords}
      />
      <PublishModal
        show={showPublishModal}
        toggle={togglePublishModal}
        onQuit={quit}
        onPublish={handlePublish}
        missingSteps={progress.missingSteps}
        pendingSteps={progress.pendingSteps}
        reviewSteps={progress.reviewSteps}
        isComplete={progress.isComplete}
        progress={progress.doneSteps}
        locale={locale}
        nbWords={progress.totalWords}
      />
    </div>
  );
};

export default CustomNavbarTranslate;
