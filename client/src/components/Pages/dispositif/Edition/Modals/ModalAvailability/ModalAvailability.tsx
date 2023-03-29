import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import {
  amountDetailsType,
  CreateDispositifRequest,
  frequencyUnitType,
  Metadatas,
  timeSlotType,
  timeUnitType,
} from "api-types";
import { BaseModal } from "components/Pages/dispositif";
import ChoiceButton from "../../ChoiceButton";
import DropdownModals from "../../DropdownModals";
import { StepsFooter, InlineForm } from "../components";
import {
  amountDetailsOptions,
  frequencyUnitOptions,
  help,
  modalTitles,
  timeSlotOptions,
  timeUnitOptions,
} from "./data";
import styles from "./ModalAvailability.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const MAX_STEP = 3;

const ModalAvailability = (props: Props) => {
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();
  const [step, setStep] = useState<number>(1);

  // commitment
  const [commitmentAmountDetails, setCommitmentAmountDetails] = useState<amountDetailsType>(
    getValues("metadatas.commitment.amountDetails") || "atLeast",
  );
  const [commitmentHours, setCommitmentHours] = useState<number | undefined>(
    getValues("metadatas.commitment.hours") || undefined,
  );
  const [commitmentTimeUnit, setCommitmentTimeUnit] = useState<timeUnitType>(
    getValues("metadatas.commitment.timeUnit") || "hours",
  );
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
    setValue("metadatas.commitment", commitment);
  };

  // frequency
  const [frequencyAmountDetails, setFrequencyAmountDetails] = useState<amountDetailsType>(
    getValues("metadatas.frequency.amountDetails") || "atLeast",
  );
  const [frequencyHours, setFrequencyHours] = useState<number | undefined>(
    getValues("metadatas.frequency.hours") || undefined,
  );
  const [frequencyTimeUnit, setFrequencyTimeUnit] = useState<timeUnitType>(
    getValues("metadatas.frequency.timeUnit") || "hours",
  );
  const [frequencyUnit, setFrequencyUnit] = useState<frequencyUnitType>(
    getValues("metadatas.frequency.frequencyUnit") || "day",
  );
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
    setValue("metadatas.frequency", frequency);
  };

  // timeSlots
  const [timeSlots, setTimeSlots] = useState<timeSlotType[] | null | undefined>(
    getValues("metadatas.timeSlots") || undefined,
  );
  const selectTimeSlot = useCallback((option: timeSlotType) => {
    setTimeSlots((options) =>
      options?.includes(option) ? options.filter((o) => o !== option) : [...(options || []), option],
    );
  }, []);
  const validateTimeSlots = () => {
    if (timeSlots !== undefined) {
      setValue("metadatas.timeSlots", timeSlots);
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
    <BaseModal show={props.show} toggle={props.toggle} help={help} title={modalTitles[step - 1]}>
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
            text="Cette question ne concerne pas mon action"
            type="checkbox"
            selected={noCommitment}
            onSelect={() => setNoCommitment((o) => !o)}
            size="lg"
            className="mt-6"
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
            text="Cette question ne concerne pas mon action"
            type="checkbox"
            selected={noFrequency}
            onSelect={() => setNoFrequency((o) => !o)}
            size="lg"
            className="mt-6"
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
            text="Cette question ne concerne pas mon action"
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
