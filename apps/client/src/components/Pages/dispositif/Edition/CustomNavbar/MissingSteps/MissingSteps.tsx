import { UserTradStatus } from "@/components/Pages/dispositif/Translation/TranslationInput/functions";
import TranslationStatus from "@/components/Pages/dispositif/Translation/TranslationInput/TranslationStatus";
import Badge from "@/components/UI/Badge";
import { Step as TranslateStep } from "@/hooks/dispositif";
import { cls } from "@/lib/classname";
import PageContext from "@/utils/pageContext";
import { useTranslation } from "next-i18next";
import { useCallback, useContext } from "react";
import { Step as EditStep } from "../CustomNavbarEdit/functions";
import { stepTranslations } from "./data";
import styles from "./MissingSteps.module.scss";

type Step = TranslateStep | EditStep;

export type StepStatus = "new" | "error";

interface Props {
  missingSteps: { step: Step; status: StepStatus }[];
  toggle: () => void;
  navigateCallback?: (step: Step) => void;
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
    <div className={cls(styles.missing)}>
      {props.missingSteps.map((item, i) => (
        <button
          key={i}
          className={cls(styles.step, styles[item.status])}
          onClick={(e: any) => {
            e.preventDefault();
            goToStep(item.step);
          }}
        >
          <span>{t(stepTranslations[item.step], stepTranslations[item.step])}</span>

          <span>
            {pageContext.mode === "edit" ? (
              <Badge severity="error" icon="ri-alert-fill" small className="me-4">
                Manquant
              </Badge>
            ) : (
              <TranslationStatus status={item.status === "error" ? UserTradStatus.MISSING : UserTradStatus.PENDING} />
            )}
          </span>
        </button>
      ))}
    </div>
  );
};

export default MissingSteps;
