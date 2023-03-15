import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { amountDetailsType, frequencyUnitType, Metadatas, timeSlotType, timeUnitType } from "api-types";
import Button from "components/UI/Button";
import ChoiceButton from "../../ChoiceButton";
import DropdownModals from "../../DropdownModals";
import BaseModal from "../BaseModal";
import InlineForm from "../components/InlineForm";
import Steps from "../components/Steps";
import styles from "./ModalAvailability.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const help = {
  title: "À quoi sert cette information ?",
  content: "Si c’est variable selon le profil : il faut cocher la case “cette question ne me concerne pas”",
};

const amountDetailsOptions: Record<amountDetailsType, string> = {
  atLeast: "Au moins",
  approximately: "Environ",
  mandatory: "Obligatoirement",
};
const timeUnitOptions: Record<timeUnitType, string> = {
  hours: "heures",
  days: "jours",
  weeks: "semaines",
  months: "mois",
  trimesters: "trimestres",
  semesters: "semestres",
  years: "années",
};
const frequencyUnitOptions: Record<frequencyUnitType, string> = {
  day: "jour",
  week: "semaine",
  month: "mois",
  trimester: "trimestre",
  semester: "semestre",
  year: "année",
};
const timeSlotOptions: timeSlotType[] = ["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"];
const MAX_STEP = 3;

const ModalAvailability = (props: Props) => {
  const formContext = useFormContext();
  const [step, setStep] = useState<number>(1);

  // commitment
  const [commitmentAmountDetails, setCommitmentAmountDetails] = useState<amountDetailsType>("atLeast");
  const [commitmentHours, setCommitmentHours] = useState<number | undefined>(undefined);
  const [commitmentTimeUnit, setCommitmentTimeUnit] = useState<timeUnitType>("hours");
  const [noCommitment, setNoCommitment] = useState<boolean>(false);

  // frequency
  const [frequencyAmountDetails, setFrequencyAmountDetails] = useState<amountDetailsType>("atLeast");
  const [frequencyHours, setFrequencyHours] = useState<number | undefined>(undefined);
  const [frequencyTimeUnit, setFrequencyTimeUnit] = useState<timeUnitType>("hours");
  const [frequencyUnit, setFrequencyUnit] = useState<frequencyUnitType>("day");
  const [noFrequency, setNoFrequency] = useState<boolean>(false);

  // timeSlots
  const [timeSlots, setTimeSlots] = useState<timeSlotType[] | null | undefined>(undefined);
  const selectTimeSlot = useCallback((option: timeSlotType) => {
    setTimeSlots((options) =>
      options?.includes(option) ? options.filter((o) => o !== option) : [...(options || []), option],
    );
  }, []);

  const validate = () => {
    if (step === 1) {
      let commitment: Metadatas["commitment"] = undefined;
      if (noCommitment) commitment = null;
      else if (!noCommitment && commitmentHours !== undefined) {
        commitment = {
          amountDetails: commitmentAmountDetails,
          hours: commitmentHours,
          timeUnit: commitmentTimeUnit,
        };
      }
      formContext.setValue("metadatas.commitment", commitment);
      setStep(2);
    } else if (step === 2) {
      let frequency: Metadatas["frequency"] = undefined;
      if (noFrequency) frequency = null;
      if (!noFrequency && frequencyHours !== undefined) {
        frequency = {
          amountDetails: frequencyAmountDetails,
          hours: frequencyHours,
          timeUnit: frequencyTimeUnit,
          frequencyUnit: frequencyUnit,
        };
      }
      formContext.setValue("metadatas.frequency", frequency);
      setStep(3);
    } else if (step === 3) {
      const newTimeSlots: Metadatas["timeSlots"] = timeSlots;
      if (newTimeSlots !== undefined) {
        formContext.setValue("metadatas.timeSlots", newTimeSlots);
      }
      props.toggle();
    }
  };

  return (
    <BaseModal
      show={props.show}
      toggle={props.toggle}
      help={help}
      title="Quelle est la durée d’engagement total demandée ?"
    >
      {step === 1 && (
        <div>
          <InlineForm>
            <DropdownModals<amountDetailsType>
              options={amountDetailsOptions}
              selected={commitmentAmountDetails}
              setSelected={(key: amountDetailsType) => setCommitmentAmountDetails(key)}
            />
            <span>
              <input
                type="number"
                placeholder={"0"}
                value={commitmentHours}
                onChange={(e: any) => setCommitmentHours(e.target.value)}
              />
            </span>

            <DropdownModals<timeUnitType>
              options={timeUnitOptions}
              selected={commitmentTimeUnit}
              setSelected={(key: timeUnitType) => setCommitmentTimeUnit(key)}
            />
          </InlineForm>
          <ChoiceButton
            text="Cette question ne concerne pas mon action / C’est variable selon le profil"
            type="checkbox"
            selected={noCommitment}
            onSelect={() => setNoCommitment((o) => !o)}
            size="lg"
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <InlineForm>
            <DropdownModals<amountDetailsType>
              options={amountDetailsOptions}
              selected={frequencyAmountDetails}
              setSelected={(key: amountDetailsType) => setFrequencyAmountDetails(key)}
            />
            <span>
              <input
                type="number"
                placeholder={"0"}
                value={frequencyHours}
                onChange={(e: any) => setFrequencyHours(e.target.value)}
              />
            </span>
            <DropdownModals<timeUnitType>
              options={timeUnitOptions}
              selected={frequencyTimeUnit}
              setSelected={(key: timeUnitType) => setFrequencyTimeUnit(key)}
            />
            <p>par</p>
            <DropdownModals<frequencyUnitType>
              options={frequencyUnitOptions}
              selected={frequencyUnit}
              setSelected={(key: frequencyUnitType) => setFrequencyUnit(key)}
            />
          </InlineForm>
          <ChoiceButton
            text="Cette question ne concerne pas mon action / C’est variable selon le profil"
            type="checkbox"
            selected={noFrequency}
            onSelect={() => setNoFrequency((o) => !o)}
            size="lg"
          />
        </div>
      )}

      {step === 3 && (
        <div>
          {timeSlotOptions.map((day) => (
            <ChoiceButton
              key={day}
              text={day}
              type="checkbox"
              selected={!!(timeSlots && timeSlots?.includes(day))}
              onSelect={() => selectTimeSlot(day)}
              className="mb-2"
            />
          ))}
          <ChoiceButton
            text="Cette question ne concerne pas mon action / C’est variable selon le profil"
            type="radio"
            selected={timeSlots === null}
            onSelect={() => setTimeSlots(null)}
            size="lg"
            className="mt-6"
          />
        </div>
      )}

      <div className="d-flex mt-6">
        <Steps step={step} maxStep={MAX_STEP} />
        <div className="flex-grow-1 text-end">
          {step > 1 && (
            <Button secondary icon="arrow-back-outline" onClick={() => setStep((s) => s - 1)} className="me-4">
              Précédent
            </Button>
          )}
          <Button
            icon={step === MAX_STEP ? "checkmark-circle-2" : "arrow-forward-outline"}
            iconPlacement="end"
            onClick={validate}
          >
            {step === MAX_STEP ? "Valider" : "Étape suivante"}
          </Button>
        </div>
      </div>
    </BaseModal>
  );
};

export default ModalAvailability;
