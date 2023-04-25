import { useCallback, useContext, useMemo, useState } from "react";
import { BaseModal } from "components/Pages/dispositif";
import PublishImage from "assets/dispositif/publish-image.svg";
import Button from "components/UI/Button";
import Image from "next/image";
import { Step } from "../functions";
import BubbleFlag from "components/UI/BubbleFlag";
import { Languages } from "api-types";
import MissingSteps from "../../MissingSteps";
import PageContext from "utils/pageContext";
import styles from "./PublishModal.module.scss";
import StepBar from "../../StepBar";

interface Props {
  show: boolean;
  toggle: () => void;
  onQuit: () => void;
  onPublish: () => Promise<void>;
  isComplete: boolean;
  missingSteps: Step[];
  progress: number;
  locale?: Languages;
}

const PublishModal = (props: Props) => {
  const title = useMemo(
    () =>
      props.isComplete
        ? "Tout est prêt, vous pouvez publier la fiche !"
        : `Plus que ${props.missingSteps.length} étapes`,
    [props.isComplete, props.missingSteps],
  );

  const pageContext = useContext(PageContext);
  const goToStep = useCallback(
    (step: Step) => {
      pageContext.setShowMissingSteps?.(true);
      props.toggle();
      // delay scroll so the modal is closed
      setTimeout(() => {
        document.getElementById(`step-${step}`)?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
      }, 1000);
    },
    [pageContext, props],
  );

  return (
    <BaseModal show={props.show} toggle={props.toggle} title={title} small>
      {props.isComplete ? (
        <>
          <p>
            Toutes les informations sont désormais traduites. Votre fiche va être publiée sur le site dans votre langue.
          </p>
          <div className={styles.done}>
            {props.locale && <BubbleFlag ln={props.locale} className="me-2" />}
            Félicitations, vous avez validé et traduit 1200 mots !
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
            total={props.progress + props.missingSteps.length}
            progress={props.progress}
            text={`${props.progress} étapes complétées sur ${props.progress + props.missingSteps.length}`}
          />
          {/* @ts-ignore */}
          <MissingSteps missingSteps={props.missingSteps} goToStep={goToStep} /> {/* TODO: fix step type */}
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
