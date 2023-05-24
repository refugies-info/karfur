import { useCallback, useContext, useEffect, useMemo } from "react";
import Image from "next/image";
import { Languages } from "@refugies-info/api-types";
import { useEvent } from "hooks";
import PageContext from "utils/pageContext";
import { BaseModal } from "components/Pages/dispositif";
import BubbleFlag from "components/UI/BubbleFlag";
import Button from "components/UI/Button";
import MissingSteps from "../../MissingSteps";
import StepBar from "../../StepBar";
import { StepStatus } from "../../MissingSteps/MissingSteps";
import { Step } from "hooks/dispositif";
import PublishImage from "assets/dispositif/publish-image.svg";
import styles from "./PublishModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  onQuit: () => void;
  onPublish: () => Promise<void>;
  isComplete: boolean;
  missingSteps: Step[];
  pendingSteps: Step[];
  reviewSteps: Step[];
  progress: number;
  locale?: Languages;
  nbWords: number;
}

const PublishModal = (props: Props) => {
  const { toggle } = props;
  const { Event } = useEvent();
  const pageContext = useContext(PageContext);
  const title = useMemo(
    () =>
      props.isComplete
        ? "Tout est prêt, vous pouvez publier la fiche !"
        : `Plus que ${props.missingSteps.length} étapes`,
    [props.isComplete, props.missingSteps],
  );

  const totalSteps = props.missingSteps.length + props.pendingSteps.length + props.progress;
  const closeModal = useCallback(() => {
    if (!props.isComplete) {
      pageContext?.setShowMissingSteps?.(true);
    }
    toggle();
  }, [pageContext, toggle, props.isComplete]);

  // send event with missing steps
  useEffect(() => {
    if (props.show) {
      Event(
        "DISPO_CREATE",
        `${props.missingSteps.length} missing steps: ${props.missingSteps.join(", ")}`,
        "Missing Steps",
      );
    }
  }, [props.show, Event, props.missingSteps]);
  return (
    <BaseModal show={props.show} toggle={closeModal} title={title} small>
      {props.isComplete ? (
        <>
          <p>
            Toutes les informations sont désormais traduites. Votre fiche va être publiée sur le site dans votre langue.
          </p>
          <div className={styles.done}>
            {props.locale && <BubbleFlag ln={props.locale} className="me-2" />}
            Félicitations, vous avez validé et traduit {props.nbWords} mots !
          </div>
          <div className="text-center mb-8 mt-6">
            <Image src={PublishImage} width={345} height={240} alt="" />
          </div>
          <div className="text-end">
            <Button
              onClick={(e: any) => {
                e.preventDefault();
                props.onPublish();
                props.onQuit();
              }}
              evaIcon="log-out-outline"
              iconPosition="right"
            >
              Publier
            </Button>
          </div>
        </>
      ) : (
        <>
          <p>Il reste quelques informations à valider pour publier votre fiche.</p>
          <StepBar
            total={totalSteps}
            progress={props.progress}
            text={`${props.progress} étapes complétées sur ${totalSteps}`}
          />
          <MissingSteps
            missingSteps={[
              ...props.reviewSteps.map((p) => ({ step: p, status: "warning" as StepStatus })),
              ...props.pendingSteps.map((p) => ({ step: p, status: "new" as StepStatus })),
              ...props.missingSteps
                .filter((s) => !props.reviewSteps.includes(s) && !props.pendingSteps.includes(s)) // remove steps already in review or pending
                .map((p) => ({ step: p, status: "error" as StepStatus })),
            ]}
            toggle={closeModal}
            noPlusIcon
            style="error"
          />
          <div className="text-end">
            <Button
              priority="secondary"
              onClick={(e: any) => {
                e.preventDefault();
                props.onQuit();
              }}
              evaIcon="log-out-outline"
              iconPosition="right"
              className="me-2"
            >
              Quitter et finir plus tard
            </Button>
            <Button
              onClick={(e: any) => {
                e.preventDefault();
                closeModal();
              }}
              evaIcon="arrow-forward-outline"
              iconPosition="right"
            >
              Compléter ma fiche
            </Button>
          </div>
        </>
      )}
    </BaseModal>
  );
};

export default PublishModal;
