import { fr } from "@codegouvfr/react-dsfr";
import { ContentType, CreateDispositifRequest, DispositifStatus } from "@refugies-info/api-types";
import { useRouter } from "next/router";
import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import Button from "~/components/UI/Button";
import EVAIcon from "~/components/UI/EVAIcon/EVAIcon";
import Tooltip from "~/components/UI/Tooltip";
import { useLocale, useUser } from "~/hooks";
import { useContentType } from "~/hooks/dispositif";
import { cls } from "~/lib/classname";
import { isStatus } from "~/lib/dispositif";
import { Event } from "~/lib/tracking";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import API from "~/utils/API";
import PageContext from "~/utils/pageContext";
import styles from "../CustomNavbar.module.scss";
import SaveErrorModal from "../SaveErrorModal";
import StepBar from "../StepBar";
import { calculateProgressEdit, getText, getTotalSteps } from "./functions";
import PublishModal from "./PublishModal";
import QuitModal from "./QuitModal";
import useAutosave from "./useAutosave";

interface Props {
  typeContenu: ContentType;
}

const CustomNavbarEdit = (props: Props) => {
  const router = useRouter();
  const values = useWatch<CreateDispositifRequest>();
  const dispositif = useSelector(selectedDispositifSelector);
  const [progress, setProgress] = useState<number>(calculateProgressEdit(values, props.typeContenu));

  const initialLocale = useLocale();
  const [showLanguageWarning, setShowLanguageWarning] = useState(initialLocale !== "fr");

  const contentType = useContentType();
  const totalSteps = useMemo(() => getTotalSteps(contentType), [contentType]);

  useEffect(() => {
    setProgress(calculateProgressEdit(values, props.typeContenu));
  }, [values, props.typeContenu]);

  const { showMissingSteps, setShowMissingSteps } = useContext(PageContext);

  // Save
  const { isSaving, hasError } = useAutosave();
  const saveText = useMemo(() => {
    if (isSaving) return "Sauvegarde en cours...";
    if (hasError) return "Erreur lors de la sauvegarde !";
    return "Sauvegardé il y a quelques secondes";
  }, [isSaving, hasError]);

  // Quit
  const [showQuitModal, setShowQuitModal] = useState(false);
  const toggleQuitModal = useCallback(() => setShowQuitModal((o) => !o), []);
  const { user } = useUser();
  const dispositifId = useMemo(() => dispositif?._id, [dispositif]);
  const quit = useCallback(() => {
    if (user.admin) {
      router.push(`/backend/admin?tab=contenus&contentId=${dispositifId}`);
    } else {
      router.push("/backend/user-dash-contrib");
    }
  }, [router, user.admin, dispositifId]);
  const handleQuit = useCallback(
    (e: any) => {
      e.preventDefault();
      Event("DISPO_CREATE", "click quit", "Navbar");
      const isComplete = totalSteps - progress === 0;
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
    },
    [dispositif, progress, totalSteps, toggleQuitModal, quit],
  );

  // Publish
  const [showPublishModal, setShowPublishModal] = useState(false);
  const togglePublishModal = useCallback(() => setShowPublishModal((o) => !o), []);
  const hideValidateButton = useMemo(() => {
    return isStatus(dispositif?.status, [DispositifStatus.KO_STRUCTURE, DispositifStatus.DELETED]);
  }, [dispositif]);
  const handlePublish = useCallback(
    async (keepTranslations: boolean) => {
      if (!dispositif?._id) return;
      API.publishDispositif(dispositif._id, { keepTranslations }).catch(() => {
        Swal.fire("Oh non...", "Une erreur s'est produite. Veuillez réessayer ou contacter un administrateur", "error");
      });
    },
    [dispositif],
  );

  const validate = useCallback(
    (e: any) => {
      e.preventDefault();
      togglePublishModal();
      Event("DISPO_CREATE", "click validate", "Navbar");
    },
    [togglePublishModal],
  );

  return (
    <div className={styles.container}>
      {showLanguageWarning && (
        <div className={styles.warning}>
          <div className={cls("fr-container", styles.inner)}>
            <span>
              <EVAIcon name="info" size={24} fill={fr.colors.decisions.text.default.info.default} className="me-4" />
              L’éditeur de fiche est disponible uniquement en français. Il n’est pas possible de rédiger dans une autre
              langue.
            </span>
            <button
              onClick={(e: any) => {
                e.preventDefault();
                setShowLanguageWarning(false);
              }}
            >
              <EVAIcon name="close-outline" size={16} fill={fr.colors.decisions.text.default.info.default} />
            </button>
          </div>
        </div>
      )}
      <div className={cls("fr-container", styles.inner)}>
        <div className={styles.steps}>
          <StepBar total={totalSteps} progress={progress} text={`${progress} / ${totalSteps}`} />
          <p className={styles.help}>{getText(progress, totalSteps)}</p>
          <Button
            priority={showMissingSteps ? "primary" : "secondary"}
            id="missing-steps-btn"
            evaIcon={showMissingSteps ? "eye-off-outline" : "eye-outline"}
            className={cls("ms-4", styles.btn)}
            onClick={(e: any) => {
              e.preventDefault();
              setShowMissingSteps?.(!showMissingSteps);
              Event("DISPO_CREATE", "click show missing steps", "Navbar");
            }}
          />
          <Tooltip target="missing-steps-btn" placement="top">
            Voir les étapes restantes
          </Tooltip>
        </div>
        <div>
          {dispositif?._id && (
            <>
              <span id="save-status" className={styles.save}>
                <EVAIcon
                  name={isSaving ? "sync-outline" : "save"}
                  size={16}
                  fill={styles.darkBackgroundElevationContrast}
                  className="me-2"
                />
                <span>{saveText}</span>
              </span>
              <Tooltip target="save-status" placement="top">
                Toutes les modifications sont sauvegardées automatiquement
              </Tooltip>
            </>
          )}
          <Button
            priority="secondary"
            evaIcon="log-out-outline"
            iconPosition="right"
            onClick={handleQuit}
            className="me-4"
          >
            Finir plus tard
          </Button>
          {!hideValidateButton && (
            <Button
              evaIcon={progress === totalSteps ? "checkmark-circle-2" : undefined}
              iconPosition="right"
              onClick={validate}
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
        hasDraftVersion={!!dispositif?.hasDraftVersion}
        isComplete={progress === totalSteps}
      />
      <PublishModal
        show={showPublishModal}
        typeContenu={props.typeContenu}
        toggle={togglePublishModal}
        onQuit={toggleQuitModal}
        redirectToBo={quit}
        onPublish={handlePublish}
        status={dispositif?.status || null}
      />
      <SaveErrorModal show={hasError} />
    </div>
  );
};

export default CustomNavbarEdit;
