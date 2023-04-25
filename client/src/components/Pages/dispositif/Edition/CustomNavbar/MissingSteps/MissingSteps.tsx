import { useCallback, useContext } from "react";
import { useTranslation } from "next-i18next";
import { Badge } from "@dataesr/react-dsfr";
import PageContext from "utils/pageContext";
import { cls } from "lib/classname";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import TranslationStatus from "components/Pages/dispositif/Translation/TranslationInput/TranslationStatus";
import { UserTradStatus } from "components/Pages/dispositif/Translation/TranslationInput/functions";
import { Step as TranslateStep } from "../CustomNavbarTranslate/functions";
import { Step as EditStep } from "../CustomNavbarEdit/functions";
import { stepTranslations } from "./data";
import styles from "./MissingSteps.module.scss";

type Step = TranslateStep | EditStep;

export type StepStatus = "new" | "warning" | "error";

interface Props {
  missingSteps: { step: Step; status: StepStatus }[];
  toggle: () => void;
  navigateCallback?: (step: Step) => void;
  noPlusIcon?: boolean;
  style: "new" | "error" | "warning";
}

const MissingSteps = (props: Props) => {
  const { t } = useTranslation();
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
        if (props.navigateCallback) {
          props.navigateCallback(step);
        }
      }, 1000);
    },
    [pageContext, props],
  );

  return (
    <div className={cls(styles.missing, styles[props.style])}>
      {props.missingSteps.map((item, i) => (
        <button key={i} className={cls(styles.step, styles[item.status])} onClick={() => goToStep(item.step)}>
          <span>{t(stepTranslations[item.step], stepTranslations[item.step])}</span>

          <span>
            {pageContext.mode === "edit" ? (
              <Badge type="warning" text="Manquant" icon="ri-alert-fill" isSmall className="me-4" />
            ) : (
              <TranslationStatus status={item.status === "error" ? UserTradStatus.MISSING : UserTradStatus.PENDING} />
            )}
            {!props.noPlusIcon && <EVAIcon name="plus-circle" size={24} fill={styles.lightTextMentionGrey} />}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MissingSteps;
