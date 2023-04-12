import React from "react";
import Button from "components/UI/Button";
import Steps from "./Steps";

interface Props {
  onValidate: () => void;
  onPrevious: () => void;
  maxSteps: number;
  step: number;
  disabled?: boolean;
  previousOnFirst?: boolean;
  nextText?: string;
  nextIcon?: string;
}

const StepsFooter = (props: Props) => {
  const showPreviousButton = props.step > 1 || (props.step === 1 && props.previousOnFirst);
  return (
    <div className="d-flex mt-6">
      <Steps step={props.step} maxStep={props.maxSteps} />
      <div className="flex-grow-1 text-end">
        {showPreviousButton && (
          <Button
            secondary
            icon="arrow-back-outline"
            onClick={(e: any) => {
              e.preventDefault();
              props.onPrevious();
            }}
            className="me-4"
          >
            Précédent
          </Button>
        )}
        <Button
          icon={props.nextIcon || (props.step === props.maxSteps ? "checkmark-circle-2" : "arrow-forward-outline")}
          iconPlacement="end"
          onClick={(e: any) => {
            e.preventDefault();
            props.onValidate();
          }}
          disabled={props.disabled}
        >
          {props.nextText || (props.step === props.maxSteps ? "Valider" : "Étape suivante")}
        </Button>
      </div>
    </div>
  );
};

export default StepsFooter;
