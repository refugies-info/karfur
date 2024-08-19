import React from "react";
import Button from "components/UI/Button";

interface Props {
  onValidate: () => void;
  disabled?: boolean;
  text?: string;
}

const SimpleFooter = (props: Props) => {
  return (
    <div className="text-end mt-6">
      <Button
        evaIcon="checkmark-circle-2"
        iconPosition="right"
        onClick={(e: any) => {
          e.preventDefault();
          props.onValidate();
        }}
        disabled={props.disabled}
      >
        {props.text || "Valider"}
      </Button>
    </div>
  );
};

export default SimpleFooter;
