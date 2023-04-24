import React, { useContext, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { DispositifStatus } from "api-types";
import { Badge } from "@dataesr/react-dsfr";
import { isStatus } from "lib/dispositif";
import PageContext, { Modals } from "utils/pageContext";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import StepBar from "../../StepBar";
import { Step, TOTAL_STEPS } from "../../functions/edit";
import { help, stepTranslations } from "./data";
import styles from "./MissingContent.module.scss";

interface Props {
  missingSteps: Step[];
  status: DispositifStatus | null;
  onQuit: () => void;
  onStay: () => void;
}

const STEPS_MODAL: Record<Step, Modals | null> = {
  commitment: "Availability",
  conditions: "Conditions",
  location: "Location",
  price: "Price",
  public: "Public",
  theme: "Themes",
  abstract: "Abstract",
  mainSponsor: "MainSponsor",
  titreInformatif: null,
  titreMarque: null,
  what: null,
  why: null,
  how: null,
  next: null,
  sponsors: null,
};

const MissingContent = (props: Props) => {
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  const content = useMemo(() => {
    if (isStatus(props.status, DispositifStatus.ACTIVE)) return help.published;
    if (isStatus(props.status, [DispositifStatus.WAITING_ADMIN, DispositifStatus.WAITING_STRUCTURE]))
      return help.waiting;
    return help.draft;
  }, [props.status]);

  const goToStep = (step: Step) => {
    pageContext.setShowMissingSteps?.(true);
    props.onStay();
    // delay scroll so the modal is closed
    setTimeout(() => {
      document.getElementById(`step-${step}`)?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
      if (STEPS_MODAL[step]) {
        pageContext.setActiveModal?.(STEPS_MODAL[step]);
      }
    }, 1000);
  };

  return (
    <div>
      <p>{content}</p>
      <StepBar
        total={TOTAL_STEPS}
        progress={TOTAL_STEPS - props.missingSteps.length}
        text={`${TOTAL_STEPS - props.missingSteps.length} étapes complétées sur ${TOTAL_STEPS}`}
      />

      <div className={styles.missing}>
        {props.missingSteps.map((step, i) => (
          <button key={i} className={styles.step} onClick={() => goToStep(step)}>
            <span>{t(stepTranslations[step], stepTranslations[step])}</span>

            <span>
              <Badge type="warning" text="Manquant" icon="ri-alert-fill" isSmall className="me-4" />
              <EVAIcon name="plus-circle" size={24} fill={styles.lightTextMentionGrey} />
            </span>
          </button>
        ))}
      </div>
      <div className="text-end">
        <Button secondary onClick={props.onQuit} icon="log-out-outline" iconPlacement="end" className="me-2">
          Quitter et finir plus tard
        </Button>
        <Button onClick={props.onStay} icon="arrow-forward-outline" iconPlacement="end">
          Compléter ma fiche
        </Button>
      </div>
    </div>
  );
};

export default MissingContent;
