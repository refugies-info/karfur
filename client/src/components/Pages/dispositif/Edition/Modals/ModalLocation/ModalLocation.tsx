import React, { useState } from "react";
import { useFormContext } from "react-hook-form";
import { CreateDispositifRequest, Metadatas } from "api-types";
import { BaseModal } from "components/Pages/dispositif";
import ChoiceButton from "../../ChoiceButton";
import { SimpleFooter, StepsFooter } from "../components";
import { help } from "./data";
import DepartmentInput from "./DepartmentInput";
import imgAll from "assets/dispositif/form-icons/location-all.svg";
import imgDepartment from "assets/dispositif/form-icons/location-department.svg";
import imgInternet from "assets/dispositif/form-icons/location-internet.svg";
import styles from "./ModalLocation.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const ModalLocation = (props: Props) => {
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();
  const initialValue = getValues("metadatas.location");
  const [selected, setSelected] = useState<"france" | "departments" | "online" | null | undefined>(
    Array.isArray(initialValue) ? "departments" : initialValue,
  );
  const [selectedDepartments, setSelectedDepartments] = useState<string[] | null | undefined>(
    Array.isArray(initialValue) ? initialValue : undefined,
  );
  const [step, setStep] = useState(1);

  const validate = () => {
    if (selected !== undefined) {
      const value: Metadatas["location"] = selected === "departments" ? selectedDepartments : selected;
      setValue("metadatas.location", value);
    }
    props.toggle();
  };

  return (
    <BaseModal
      show={props.show}
      toggle={props.toggle}
      help={help}
      title={step === 1 ? "Où votre action est-elle accessible ?" : "Dans quel(s) département(s) est-elle accessible ?"}
    >
      <div>
        {step === 1 && (
          <>
            <ChoiceButton
              text="France entière"
              type="radio"
              selected={selected === "france"}
              onSelect={() => setSelected("france")}
              image={imgAll}
              className="mb-2"
            />
            <ChoiceButton
              text="Départements"
              subtext="Vous pourrez choisir les départements à l’étape suivante."
              type="radio"
              selected={selected === "departments"}
              onSelect={() => setSelected("departments")}
              image={imgDepartment}
              className="mb-2"
            />
            <ChoiceButton
              text="Ressource en ligne"
              type="radio"
              selected={selected === "online"}
              onSelect={() => setSelected("online")}
              image={imgInternet}
              className="mb-6"
            />
          </>
        )}

        {step === 2 && (
          <>
            <p>Vous pouvez taper le numéro ou le nom des départements.</p>
            <DepartmentInput
              selectedDepartments={selectedDepartments}
              setSelectedDepartments={setSelectedDepartments}
            />
          </>
        )}

        {selected === "departments" ? (
          <StepsFooter
            step={step}
            maxSteps={2}
            onPrevious={() => setStep(1)}
            onValidate={step === 1 ? () => setStep(2) : validate}
            disabled={step === 2 && !selectedDepartments?.length}
          />
        ) : (
          <SimpleFooter onValidate={validate} disabled={selected === undefined} />
        )}
      </div>
    </BaseModal>
  );
};

export default ModalLocation;
