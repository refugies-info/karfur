import React, { useCallback, useMemo, useState } from "react";
import { useFormContext } from "react-hook-form";
import { useTranslation } from "next-i18next";
import {
  ageType,
  CreateDispositifRequest,
  frenchLevelType,
  Metadatas,
  publicStatusType,
  publicType,
} from "@refugies-info/api-types";
import { cls } from "lib/classname";
import { entries } from "lib/typedObjectEntries";
import { BaseModal } from "components/Pages/dispositif";
import ChoiceButton from "../../ChoiceButton";
import { StepsFooter, InlineForm } from "../components";
import {
  ageOptions,
  ChoiceItem,
  frenchLevelOptions,
  help,
  modalTitles,
  publicOptions,
  publicStatusOptions,
} from "./data";
import { addAllRefugeeTypes, includeAllRefugees, removeAllRefugeeTypes } from "./functions";
import NoIcon from "assets/dispositif/no-icon.svg";
import styles from "./ModalPublic.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const MAX_STEP = 4;

const ModalPublic = (props: Props) => {
  const { t } = useTranslation();
  const { setValue, getValues } = useFormContext<CreateDispositifRequest>();
  const [step, setStep] = useState<number>(1);

  // public status
  const [publicStatus, setPublicStatus] = useState<publicStatusType[] | undefined>(
    getValues("metadatas.publicStatus") || undefined,
  );
  const selectPublicStatus = useCallback((option: publicStatusType) => {
    setPublicStatus((options) =>
      options?.includes(option) ? options.filter((o) => o !== option) : [...(options || []), option],
    );
  }, []);
  const validatePublicStatus = () => {
    if (publicStatus !== undefined) {
      setValue("metadatas.publicStatus", publicStatus);
    }
  };

  // frenchLevel
  const [frenchLevel, setFrenchLevel] = useState<frenchLevelType[] | null | undefined>(
    getValues("metadatas.frenchLevel"),
  );
  const selectFrenchLevel = useCallback((option: frenchLevelType) => {
    setFrenchLevel((options) =>
      options?.includes(option) ? options.filter((o) => o !== option) : [...(options || []), option],
    );
  }, []);
  const validateFrenchLevel = () => {
    if (frenchLevel !== undefined) {
      setValue("metadatas.frenchLevel", frenchLevel);
    }
  };

  // age
  const [ageType, setAgeType] = useState<ageType>(getValues("metadatas.age.type") || "moreThan");
  const [ages, setAges] = useState<number[]>(getValues("metadatas.age.ages") || []);
  const [noAge, setNoAge] = useState(getValues("metadatas.age") === null);
  const validateAge = () => {
    let age: Metadatas["age"] = undefined;
    if (noAge) age = null;
    else if (!noAge && ages.length > 0) {
      const betweenFormError = ageType === "between" && (!ages[0] || !ages[1]);
      const formError = !ages[0];
      if (!betweenFormError && !formError) {
        age = {
          type: ageType,
          ages: ageType === "between" ? [ages[0], ages[1]] : [ages[0]],
        };
      }
    }
    setValue("metadatas.age", age);
  };

  // public
  const [publicType, setPublicType] = useState<publicType[] | null | undefined>(getValues("metadatas.public"));
  const selectPublicType = useCallback((option: publicType) => {
    setPublicType((options) =>
      options?.includes(option) ? options.filter((o) => o !== option) : [...(options || []), option],
    );
  }, []);
  const validatePublicType = () => {
    if (publicType !== undefined) {
      setValue("metadatas.public", publicType);
    }
  };

  const validate = () => {
    if (step === 1) {
      validatePublicStatus();
      setStep(2);
    } else if (step === 2) {
      validateFrenchLevel();
      setStep(3);
    } else if (step === 3) {
      validateAge();
      setStep(4);
    } else if (step === 4) {
      validatePublicType();
      props.toggle();
    }
  };

  const emptySteps = useMemo(() => {
    return [
      publicStatus === undefined || publicStatus?.length === 0, // step 1
      frenchLevel === undefined || frenchLevel?.length === 0, // step 2
      !noAge && !ages[0], // step 3
      publicType === undefined || publicType?.length === 0, // step 4
    ];
  }, [publicStatus, publicType, frenchLevel, noAge, ages]);

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
      help={help[step - 1]}
      title={modalTitles[step - 1]}
      onOpened={navigateToStep}
    >
      <div>
        {step === 1 && (
          <div>
            <ChoiceButton
              text="Tous les publics"
              type="checkbox"
              selected={publicStatus?.length === 6}
              onSelect={() => {
                setPublicStatus(
                  publicStatus?.length === 6
                    ? []
                    : ["apatride", "asile", "french", "refugie", "temporaire", "subsidiaire"],
                );
              }}
              className="mb-2"
              helpTooltip="Votre action est ouverte de façon inconditionnelle, à toutes les personnes intéressées."
            />
            <ChoiceButton
              text="Primo-arrivants"
              type="checkbox"
              selected={includeAllRefugees(publicStatus)}
              onSelect={() => {
                setPublicStatus(
                  includeAllRefugees(publicStatus)
                    ? removeAllRefugeeTypes(publicStatus)
                    : addAllRefugeeTypes(publicStatus),
                );
              }}
              className="mb-2"
              helpTooltip="Votre action est ouverte aux étrangers primo-arrivants, c'est-à-dire vivant en France depuis moins de 5 ans."
            />
            <div>
              {publicStatusOptions.map((key) => (
                <div key={key.type} className={cls("mb-2", key.type !== "french" && "ms-6")}>
                  <ChoiceButton
                    text={t(`Infocards.${key.type}`)}
                    type="checkbox"
                    selected={!!(publicStatus && publicStatus?.includes(key.type))}
                    onSelect={() => selectPublicStatus(key.type)}
                    helpTooltip={key.help || undefined}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            <ChoiceButton
              text="Tous les niveaux"
              type="checkbox"
              selected={frenchLevel?.length === 7}
              onSelect={() => setFrenchLevel(["alpha", "A1", "A2", "B1", "B2", "C1", "C2"])}
              className="mb-2"
            />
            {entries<Record<frenchLevelType, ChoiceItem>>(frenchLevelOptions).map(([key, item]) => (
              <div key={key}>
                <ChoiceButton
                  key={key}
                  text={item.text}
                  type="checkbox"
                  selected={!!(frenchLevel && frenchLevel?.includes(key))}
                  onSelect={() => selectFrenchLevel(key)}
                  className="mb-2"
                  helpTooltip={item.help}
                />
              </div>
            ))}
            <ChoiceButton
              text="Ce n'est pas pertinent pour mon action"
              type="radio"
              selected={frenchLevel === null}
              onSelect={() => setFrenchLevel(null)}
              size="lg"
              className="mt-6"
              image={NoIcon}
            />
          </div>
        )}

        {step === 3 && (
          <div>
            <div className="d-flex justify-content-between">
              {entries<Record<ageType, string>>(ageOptions).map(([key, text]) => (
                <div key={key}>
                  <ChoiceButton
                    key={key}
                    text={text}
                    type="radio"
                    selected={!!(ageType && ageType?.includes(key))}
                    onSelect={() => setAgeType(key)}
                    className="mb-2"
                  />
                </div>
              ))}
            </div>
            <InlineForm border className="mt-4">
              {ageType === "moreThan" && (
                <>
                  <p>Plus de </p>
                  <span>
                    <input
                      type="number"
                      placeholder={"0"}
                      value={ages[0] || ""}
                      onChange={(e: any) => setAges([parseInt(e.target.value)])}
                    />
                  </span>
                </>
              )}
              {ageType === "between" && (
                <>
                  <p>Entre </p>
                  <span>
                    <input
                      type="number"
                      placeholder={"0"}
                      value={ages[0] || ""}
                      onChange={(e: any) => setAges((a) => [parseInt(e.target.value), a[1]])}
                    />
                  </span>
                  <p>et</p>
                  <span>
                    <input
                      type="number"
                      placeholder={"0"}
                      value={ages[1] || ""}
                      onChange={(e: any) => setAges((a) => [a[0], parseInt(e.target.value)])}
                    />
                  </span>
                </>
              )}
              {ageType === "lessThan" && (
                <>
                  <p>Moins de </p>
                  <span>
                    <input
                      type="number"
                      placeholder={"0"}
                      value={ages[0] || ""}
                      onChange={(e: any) => setAges([parseInt(e.target.value)])}
                    />
                  </span>
                </>
              )}
              <p>ans</p>
            </InlineForm>
            <ChoiceButton
              text="Ce n'est pas pertinent pour mon action"
              type="checkbox"
              selected={noAge}
              onSelect={() => setNoAge((o) => !o)}
              size="lg"
              className="mt-6"
              image={NoIcon}
            />
          </div>
        )}

        {step === 4 && (
          <div>
            {publicOptions.map((key) => (
              <div key={key}>
                <ChoiceButton
                  key={key}
                  text={t(`Infocards.${key}`)}
                  type="checkbox"
                  selected={!!(publicType && publicType?.includes(key))}
                  onSelect={() => selectPublicType(key)}
                  className="mb-2"
                />
              </div>
            ))}
            <ChoiceButton
              text="Ce n'est pas pertinent pour mon action"
              type="radio"
              selected={publicType === null}
              onSelect={() => setPublicType(null)}
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
      </div>
    </BaseModal>
  );
};

export default ModalPublic;
