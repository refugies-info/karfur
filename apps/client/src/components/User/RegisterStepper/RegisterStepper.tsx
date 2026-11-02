import { useTranslation } from "next-i18next";

interface Props {
  currentStep: number;
  stepCount: number;
}

// Same markup as the DSFR Stepper, with a <p> instead of its hardcoded <h2> so the page h1 comes first (RGAA 9.1)
const RegisterStepper = ({ currentStep, stepCount }: Props) => {
  const { t } = useTranslation();
  return (
    <div className="fr-stepper">
      <p className="fr-stepper__title">
        <span className="fr-stepper__state">
          {t("Register.step_progress", "Étape {{currentStep}} sur {{stepCount}}", {
            currentStep,
            stepCount,
          })}
        </span>
      </p>
      <div
        className="fr-stepper__steps"
        data-fr-current-step={currentStep}
        data-fr-steps={stepCount}
      />
    </div>
  );
};

export default RegisterStepper;
