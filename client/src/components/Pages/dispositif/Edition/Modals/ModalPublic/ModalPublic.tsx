import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ageType, CreateDispositifRequest, frenchLevelType, Metadatas, publicStatusType, publicType } from "api-types";
import { cls } from "lib/classname";
import { entries } from "lib/typedObjectEntries";
import ChoiceButton from "../../ChoiceButton";
import BaseModal from "../BaseModal";
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
import { includeAllRefugees } from "./functions";
import styles from "./ModalPublic.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const MAX_STEP = 4;

const ModalPublic = (props: Props) => {
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

  // public
  const [publicType, setPublicType] = useState<publicType[] | null | undefined>(
    getValues("metadatas.public") || undefined,
  );
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

  // frenchLevel
  const [frenchLevel, setFrenchLevel] = useState<frenchLevelType[] | null | undefined>(
    getValues("metadatas.frenchLevel") || undefined,
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
  const [noAge, setNoAge] = useState(false);
  const validateAge = () => {
    let age: Metadatas["age"] = undefined;
    if (noAge) age = null;
    else if (!noAge && ages.length > 0) {
      const betweenFormError = ageType === "between" && (isNaN(ages[0]) || isNaN(ages[1]));
      const formError = isNaN(ages[0]);
      if (!betweenFormError && !formError) {
        age = {
          type: ageType,
          ages: ageType === "between" ? [ages[0], ages[1]] : [ages[0]],
        };
      }
    }
    setValue("metadatas.age", age);
  };

  const validate = () => {
    if (step === 1) {
      validatePublicStatus();
      setStep(2);
    } else if (step === 2) {
      validatePublicType();
      setStep(3);
    } else if (step === 3) {
      validateFrenchLevel();
      setStep(4);
    } else if (step === 4) {
      validateAge();
      props.toggle();
    }
  };

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title={modalTitles[step - 1]}>
      <div>
        {step === 1 && (
          <div>
            <ChoiceButton
              text="Tous les publics"
              type="checkbox"
              selected={publicStatus?.length === 5}
              onSelect={() => {
                setPublicStatus(
                  publicStatus?.length === 5 ? [] : ["apatride", "asile", "french", "refugie", "subsidiaire"],
                );
              }}
              className="mb-2"
            />
            <ChoiceButton
              text="Primo-arrivants"
              type="checkbox"
              selected={includeAllRefugees(publicStatus)}
              onSelect={() => {
                setPublicStatus(
                  includeAllRefugees(publicStatus) ? [] : ["apatride", "asile", "refugie", "subsidiaire"],
                );
              }}
              className="mb-2"
              helpTooltip="Les primo-arrivants contiennent également les regroupements familiaux, les personnes exilées, les étudiants étrangers, etc."
            />
            <div>
              {entries<Record<publicStatusType, string>>(publicStatusOptions).map(([key, text]) => (
                <div key={key} className={cls("mb-2", key !== "french" && "ms-6")}>
                  <ChoiceButton
                    text={text}
                    type="checkbox"
                    selected={!!(publicStatus && publicStatus?.includes(key))}
                    onSelect={() => selectPublicStatus(key)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {step === 2 && (
          <div>
            {entries<Record<publicType, string>>(publicOptions).map(([key, text]) => (
              <div key={key}>
                <ChoiceButton
                  key={key}
                  text={text}
                  type="checkbox"
                  selected={!!(publicType && publicType?.includes(key))}
                  onSelect={() => selectPublicType(key)}
                  className="mb-2"
                />
              </div>
            ))}
            <ChoiceButton
              text="Cette information n’est pas pertinente pour mon action"
              type="radio"
              selected={publicType === null}
              onSelect={() => setPublicType(null)}
              size="lg"
              className="mt-6"
            />
          </div>
        )}

        {step === 3 && (
          <div>
            {entries<Record<frenchLevelType, ChoiceItem>>(frenchLevelOptions).map(([key, item]) => (
              <div key={key}>
                <ChoiceButton
                  key={key}
                  text={`${key === "A1.1" ? "Infra A1 et A1.1" : key} : ${item.text}`}
                  type="checkbox"
                  selected={!!(frenchLevel && frenchLevel?.includes(key))}
                  onSelect={() => selectFrenchLevel(key)}
                  className="mb-2"
                  helpTooltip={item.help}
                />
              </div>
            ))}
            <ChoiceButton
              text="Peu importe, tous les niveaux"
              type="checkbox"
              selected={frenchLevel?.length === 7}
              onSelect={() => setFrenchLevel(["A1.1", "A1", "A2", "B1", "B2", "C1", "C2"])}
              className="mb-2"
            />
            <ChoiceButton
              text="Cette information n’est pas pertinente pour mon action"
              type="radio"
              selected={frenchLevel === null}
              onSelect={() => setFrenchLevel(null)}
              size="lg"
              className="mt-6"
            />
          </div>
        )}

        {step === 4 && (
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
            <InlineForm>
              {ageType === "moreThan" && (
                <>
                  <p>Plus de </p>
                  <span>
                    <input
                      type="number"
                      placeholder={"0"}
                      value={ages[0]}
                      onChange={(e: any) => setAges([e.target.value])}
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
                      value={ages[0]}
                      onChange={(e: any) => setAges((a) => [e.target.value, a[1]])}
                    />
                  </span>
                  <p>et</p>
                  <span>
                    <input
                      type="number"
                      placeholder={"0"}
                      value={ages[1]}
                      onChange={(e: any) => setAges((a) => [a[0], e.target.value])}
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
                      value={ages[0]}
                      onChange={(e: any) => setAges([e.target.value])}
                    />
                  </span>
                </>
              )}
              <p>ans</p>
            </InlineForm>
            <ChoiceButton
              text="Cette information n’est pas pertinente pour mon action"
              type="checkbox"
              selected={noAge}
              onSelect={() => setNoAge((o) => !o)}
              size="lg"
              className="mt-6"
            />
          </div>
        )}

        <StepsFooter onValidate={validate} onPrevious={() => setStep((s) => s - 1)} maxSteps={MAX_STEP} step={step} />
      </div>
    </BaseModal>
  );
};

export default ModalPublic;
