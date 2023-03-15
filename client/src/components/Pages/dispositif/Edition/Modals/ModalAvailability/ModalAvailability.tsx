import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { amountDetailsType, frequencyUnitType, Metadatas, timeSlotType, timeUnitType } from "api-types";
import ChoiceButton from "../../ChoiceButton";
import DropdownModals from "../../DropdownModals";
import BaseModal from "../BaseModal";
import { StepsFooter, InlineForm } from "../components";
import { amountDetailsOptions, frequencyUnitOptions, help, timeSlotOptions, timeUnitOptions } from "./data";
import styles from "./ModalAvailability.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const MAX_STEP = 3;

const ModalAvailability = (props: Props) => {
  const formContext = useFormContext();
  const [step, setStep] = useState<number>(1);

  // commitment
  const [commitmentAmountDetails, setCommitmentAmountDetails] = useState<amountDetailsType>("atLeast");
  const [commitmentHours, setCommitmentHours] = useState<number | undefined>(undefined);
  const [commitmentTimeUnit, setCommitmentTimeUnit] = useState<timeUnitType>("hours");
  const [noCommitment, setNoCommitment] = useState<boolean>(false);
  const validateCommitment = () => {
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
  };

  // frequency
  const [frequencyAmountDetails, setFrequencyAmountDetails] = useState<amountDetailsType>("atLeast");
  const [frequencyHours, setFrequencyHours] = useState<number | undefined>(undefined);
  const [frequencyTimeUnit, setFrequencyTimeUnit] = useState<timeUnitType>("hours");
  const [frequencyUnit, setFrequencyUnit] = useState<frequencyUnitType>("day");
  const [noFrequency, setNoFrequency] = useState<boolean>(false);
  const validateFrequency = () => {
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
  };

  // timeSlots
  const [timeSlots, setTimeSlots] = useState<timeSlotType[] | null | undefined>(undefined);
  const selectTimeSlot = useCallback((option: timeSlotType) => {
    setTimeSlots((options) =>
      options?.includes(option) ? options.filter((o) => o !== option) : [...(options || []), option],
    );
  }, []);
  const validateTimeSlots = () => {
    const newTimeSlots: Metadatas["timeSlots"] = timeSlots;
    if (newTimeSlots !== undefined) {
      formContext.setValue("metadatas.timeSlots", newTimeSlots);
    }
  };

  const validate = () => {
    if (step === 1) {
      validateCommitment();
      setStep(2);
    } else if (step === 2) {
      validateFrequency();
      setStep(3);
    } else if (step === 3) {
      validateTimeSlots();
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

      <StepsFooter onValidate={validate} onPrevious={() => setStep((s) => s - 1)} maxSteps={MAX_STEP} step={step} />
    </BaseModal>
  );
};

export default ModalAvailability;
