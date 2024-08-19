import { useCallback, useContext, useEffect, useMemo, useState } from "react";
import { GetTraductionsForReview, Languages } from "@refugies-info/api-types";
import { Event } from "lib/tracking";
import PageContext from "utils/pageContext";
import BaseModal from "components/UI/BaseModal";
import Button from "components/UI/Button";
import MissingSteps from "../../MissingSteps";
import StepBar from "../../StepBar";
import { StepStatus } from "../../MissingSteps/MissingSteps";
import { Step } from "hooks/dispositif";
import CompleteContent from "./CompleteContent";
import NotationForm from "./NotationForm";
import styles from "./PublishModal.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  onQuit: () => void;
  onPublish: () => Promise<void>;
  isPublishing: boolean;
  isComplete: boolean;
  missingSteps: Step[];
  pendingSteps: Step[];
  reviewSteps: Step[];
  progress: number;
  locale?: Languages;
  nbWords: number;
  translators?: GetTraductionsForReview["author"][];
}

const PublishModal = (props: Props) => {
  const { toggle, onQuit, isComplete } = props;
  const pageContext = useContext(PageContext);
  const [screenStep, setScreenStep] = useState(0);
  const title = useMemo(() => {
    if (isComplete) {
      return screenStep === 0 ? "Tout est prêt, vous pouvez publier la fiche !" : "Qu'avez-vous pensé des bénévoles ?";
    }
    return `Plus que ${props.missingSteps.length} étapes`;
  }, [isComplete, props.missingSteps, screenStep]);

  const totalSteps = props.missingSteps.length + props.pendingSteps.length + props.progress;
  const closeModal = useCallback(() => {
    if (!isComplete) {
      pageContext?.setShowMissingSteps?.(true);
    } else {
      if (screenStep === 1) {
        onQuit();
      }
    }
    toggle();
  }, [pageContext, toggle, isComplete, screenStep, onQuit]);

  // send event with missing steps
  useEffect(() => {
    if (props.show) {
      Event(
        "DISPO_TRAD",
        `${props.missingSteps.length} missing steps: ${props.missingSteps.join(", ")}`,
        "Missing Steps",
      );
    }
  }, [props.show, props.missingSteps]);
  return (
    <BaseModal show={props.show} toggle={closeModal} title={title} small>
      {isComplete ? (
        screenStep === 0 ? (
          <CompleteContent
            locale={props.locale}
            nbWords={props.nbWords}
            isPublishing={props.isPublishing}
            publish={() => {
              props.onPublish().then(() => {
                if ((props.translators || []).length > 0) {
                  setScreenStep(1);
                } else {
                  onQuit();
                }
              });
            }}
          />
        ) : (
          <NotationForm locale={props.locale} translators={props.translators || []} onDone={onQuit} />
        )
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
              ...props.reviewSteps.map((p) => ({ step: p, status: "error" as StepStatus })),
              ...props.pendingSteps.map((p) => ({ step: p, status: "new" as StepStatus })),
              ...props.missingSteps
                .filter((s) => !props.reviewSteps.includes(s) && !props.pendingSteps.includes(s)) // remove steps already in review or pending
                .map((p) => ({ step: p, status: "error" as StepStatus })),
            ]}
            toggle={closeModal}
          />
          <div className="text-end">
            <Button
              priority="secondary"
              onClick={(e: any) => {
                e.preventDefault();
                onQuit();
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
