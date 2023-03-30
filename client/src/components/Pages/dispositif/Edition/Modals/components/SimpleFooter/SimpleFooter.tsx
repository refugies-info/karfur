import React from "react";
import Button from "components/UI/Button";

interface Props {
  onValidate: () => void;
  disabled?: boolean;
}

const SimpleFooter = (props: Props) => {
  return (
    <div className="text-end mt-6">
      <Button icon="checkmark-circle-2" iconPlacement="end" onClick={props.onValidate} disabled={props.disabled}>
        Valider
      </Button>
    </div>
  );
};

export default SimpleFooter;
