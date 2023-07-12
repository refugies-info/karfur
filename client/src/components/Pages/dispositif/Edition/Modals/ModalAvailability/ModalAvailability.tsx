import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "next-i18next";
import {
  commitmentDetailsType,
  CreateDispositifRequest,
  frequencyDetailsType,
  frequencyUnitType,
  Metadatas,
  timeSlotType,
  timeUnitType,
} from "@refugies-info/api-types";
import { jsUcfirst } from "lib";
import BaseModal from "components/UI/BaseModal";
import ChoiceButton from "../../ChoiceButton";
import DropdownModals from "../../DropdownModals";
import { StepsFooter, InlineForm } from "../components";
import {
  commitmentDetailsOptions,
  frequencyDetailsOptions,
  frequencyUnitOptions,
  help,
  helpDays,
  modalTitles,
  timeSlotOptions,
  timeUnitOptions,
} from "./data";
import NoIcon from "assets/dispositif/no-icon.svg";
import { getInputValue, getInputValues, includesAllDays, isCommitmentHoursKo } from "./functions";
import styles from "./ModalAvailability.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const MAX_STEP = 3;

const ModalAvailability = (props: Props) => {
  const { t } = useTranslation();
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();
  const [step, setStep] = useState<number>(1);

  // commitment
  const [commitmentAmountDetails, setCommitmentAmountDetails] = useState<commitmentDetailsType>(
    getValues("metadatas.commitment.amountDetails") || "exactly",
  );
  const [commitmentHours, setCommitmentHours] = useState<(number | undefined)[] | undefined>(
    getValues("metadatas.commitment.hours") || undefined,
  );
  const [commitmentTimeUnit, setCommitmentTimeUnit] = useState<timeUnitType>(
    getValues("metadatas.commitment.timeUnit") || "months",
  );
  const [noCommitment, setNoCommitment] = useState<boolean>(getValues("metadatas.commitment") === null);
  const validateCommitment = () => {
    let commitment: Metadatas["commitment"] = undefined;
    if (noCommitment) commitment = null;
    else if (!noCommitment && !isCommitmentHoursKo(commitmentHours, commitmentAmountDetails)) {
      commitment = {
        amountDetails: commitmentAmountDetails,
        hours: commitmentHours?.filter((c) => c !== undefined) as number[],
        timeUnit: commitmentTimeUnit,
      };
    }
    setValue("metadatas.commitment", commitment);
  };

  // frequency
  const [frequencyAmountDetails, setFrequencyAmountDetails] = useState<frequencyDetailsType>(
    getValues("metadatas.frequency.amountDetails") || "minimum",
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
  const [noFrequency, setNoFrequency] = useState<boolean>(getValues("metadatas.frequency") === null);
  const validateFrequency = () => {
    let frequency: Metadatas["frequency"] = undefined;
    if (noFrequency) frequency = null;
    if (!noFrequency && !!frequencyHours) {
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
  const [timeSlots, setTimeSlots] = useState<timeSlotType[] | null | undefined>(getValues("metadatas.timeSlots"));
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

  const emptySteps = useMemo(() => {
    return [
      !noCommitment && isCommitmentHoursKo(commitmentHours, commitmentAmountDetails),
      !noFrequency && !frequencyHours,
      timeSlots === undefined || timeSlots?.length === 0,
    ];
  }, [noCommitment, commitmentAmountDetails, commitmentHours, noFrequency, frequencyHours, timeSlots]);

  const navigateToStep = useCallback(() => {
    const firstEmpty = emptySteps.indexOf(true);
    if (firstEmpty >= 0) {
      setStep(firstEmpty + 1);
    }
  }, [emptySteps]);

  return (
    <BaseModal
      show={props.show}
      toggle={props.toggle}
      help={step === 3 ? helpDays : help}
      title={modalTitles[step - 1]}
      onOpened={navigateToStep}
    >
      {step === 1 && (
        <div>
          <InlineForm>
            <DropdownModals<commitmentDetailsType>
              options={commitmentDetailsOptions}
              selected={commitmentAmountDetails}
              setSelected={(key: commitmentDetailsType) => setCommitmentAmountDetails(key)}
            />
            <span>
              <input
                type="number"
                placeholder={"0"}
                value={getInputValue(commitmentHours?.[0])}
                onChange={(e: any) =>
                  setCommitmentHours(
                    commitmentAmountDetails === "between"
                      ? getInputValues([e.target.value, commitmentHours?.[1]])
                      : getInputValues([e.target.value]),
                  )
                }
                className="spinner"
              />
              {commitmentAmountDetails === "between" && (
                <>
                  <span className="mx-2">et</span>
                  <input
                    type="number"
                    placeholder={"0"}
                    value={getInputValue(commitmentHours?.[1])}
                    onChange={(e: any) => setCommitmentHours(getInputValues([commitmentHours?.[0], e.target.value]))}
                    className="spinner"
                  />
                </>
              )}
            </span>

            <DropdownModals<timeUnitType>
              options={timeUnitOptions}
              selected={commitmentTimeUnit}
              setSelected={(key: timeUnitType) => setCommitmentTimeUnit(key)}
            />
          </InlineForm>
          <ChoiceButton
            text="Ce n'est pas pertinent pour mon action"
            type="checkbox"
            selected={noCommitment}
            onSelect={() => setNoCommitment((o) => !o)}
            size="lg"
            className="mt-6"
            image={NoIcon}
          />
        </div>
      )}

      {step === 2 && (
        <div>
          <InlineForm>
            <DropdownModals<frequencyDetailsType>
              options={frequencyDetailsOptions}
              selected={frequencyAmountDetails}
              setSelected={(key: frequencyDetailsType) => setFrequencyAmountDetails(key)}
            />
            <span>
              <input
                type="number"
                placeholder={"0"}
                value={frequencyHours || ""}
                onChange={(e: any) => setFrequencyHours(e.target.value)}
                className="spinner"
              />
            </span>
            <DropdownModals<timeUnitType>
              options={timeUnitOptions}
              selected={frequencyTimeUnit}
              setSelected={(key: timeUnitType) => setFrequencyTimeUnit(key)}
            />
            <DropdownModals<frequencyUnitType>
              options={frequencyUnitOptions}
              selected={frequencyUnit}
              setSelected={(key: frequencyUnitType) => setFrequencyUnit(key)}
            />
          </InlineForm>
          <ChoiceButton
            text="Ce n'est pas pertinent pour mon action"
            type="checkbox"
            selected={noFrequency}
            onSelect={() => setNoFrequency((o) => !o)}
            size="lg"
            className="mt-6"
            image={NoIcon}
          />
        </div>
      )}

      {step === 3 && (
        <div>
          <ChoiceButton
            text="Tous les jours"
            type="checkbox"
            selected={includesAllDays(timeSlots)}
            onSelect={() => {
              includesAllDays(timeSlots)
                ? setTimeSlots([])
                : setTimeSlots(["monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday"]);
            }}
            className="mb-2"
          />
          {timeSlotOptions.map((day) => (
            <ChoiceButton
              key={day}
              text={jsUcfirst(t(`Infocards.${day}`))}
              type="checkbox"
              selected={!!(timeSlots && timeSlots?.includes(day))}
              onSelect={() => selectTimeSlot(day)}
              className="mb-2"
            />
          ))}
          <ChoiceButton
            text="Ce n'est pas pertinent pour mon action"
            type="radio"
            selected={timeSlots === null}
            onSelect={() => setTimeSlots(null)}
            size="lg"
            className="mt-6"
            image={NoIcon}
          />
        </div>
      )}

      <StepsFooter
        onValidate={validate}
        onPrevious={() => setStep((s) => s - 1)}
        maxSteps={MAX_STEP}
        step={step}
        disabled={emptySteps[step - 1]}
      />
    </BaseModal>
  );
};

export default ModalAvailability;
