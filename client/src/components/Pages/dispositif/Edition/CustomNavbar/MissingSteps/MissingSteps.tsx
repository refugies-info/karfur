import React, { useContext, useMemo } from "react";
import { useTranslation } from "next-i18next";
import { DispositifStatus } from "api-types";
import { Badge } from "@dataesr/react-dsfr";
import { isStatus } from "lib/dispositif";
import PageContext, { Modals } from "utils/pageContext";
import Button from "components/UI/Button";
import EVAIcon from "components/UI/EVAIcon/EVAIcon";
import { help, stepTranslations } from "./data";
import styles from "./MissingSteps.module.scss";
import { Step as TranslateStep } from "../CustomNavbarTranslate/functions";
import { Step as EditStep } from "../CustomNavbarEdit/functions";

type Step = TranslateStep | EditStep;

interface Props {
  missingSteps: Step[];
  goToStep: (step: Step) => void;
}

const MissingSteps = (props: Props) => {
  const { t } = useTranslation();
  const pageContext = useContext(PageContext);

  return (
    <div className={styles.missing}>
      {props.missingSteps.map((step, i) => (
        <button key={i} className={styles.step} onClick={() => props.goToStep(step)}>
          <span>{t(stepTranslations[step], stepTranslations[step])}</span>

          <span>
            <Badge type="warning" text="Manquant" icon="ri-alert-fill" isSmall className="me-4" />
            <EVAIcon name="plus-circle" size={24} fill={styles.lightTextMentionGrey} />
          </span>
        </button>
      ))}
    </div>
  );
};

export default MissingSteps;
