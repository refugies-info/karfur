import { useCallback, useContext, useMemo } from "react";
import Image from "next/image";
import { Languages } from "api-types";
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
  const title = useMemo(
    () =>
      props.isComplete
        ? "Tout est prêt, vous pouvez publier la fiche !"
        : `Plus que ${props.missingSteps.length} étapes`,
    [props.isComplete, props.missingSteps],
  );

  const totalSteps = props.missingSteps.length + props.pendingSteps.length + props.progress;
  return (
    <BaseModal show={props.show} toggle={props.toggle} title={title} small>
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
            <Button onClick={props.onPublish} icon="log-out-outline" iconPlacement="end">
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
            toggle={props.toggle}
            noPlusIcon
            style="error"
          />
          <div className="text-end">
            <Button secondary onClick={props.onQuit} icon="log-out-outline" iconPlacement="end" className="me-2">
              Quitter et finir plus tard
            </Button>
            <Button onClick={props.toggle} icon="arrow-forward-outline" iconPlacement="end">
              Compléter ma fiche
            </Button>
          </div>
        </>
      )}
    </BaseModal>
  );
};

export default PublishModal;
