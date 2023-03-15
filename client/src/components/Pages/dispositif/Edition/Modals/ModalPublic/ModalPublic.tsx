import React, { useCallback, useState } from "react";
import { useFormContext } from "react-hook-form";
import { ageType, frenchLevelType, Metadatas, publicStatusType, publicType } from "api-types";
import { cls } from "lib/classname";
import { entries } from "lib/typedObjectEntries";
import Button from "components/UI/Button";
import ChoiceButton from "../../ChoiceButton";
import BaseModal from "../BaseModal";
import InlineForm from "../components/InlineForm";
import Steps from "../components/Steps";
import styles from "./ModalPublic.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const help = {
  title: "À quoi sert cette information ?",
  content: "Ajoutez-les seulement si ce sont vraiment des critères exluant le cas échéant.",
};

const publicStatusOptions: Record<publicStatusType, string> = {
  asile: "Demandeurs d'asile",
  refugie: "Réfugiés statutaires",
  subsidiaire: "Bénéficiaires de la protection subsidiaire",
  apatride: "Apatrides",
  french: "Citoyens français",
};
const publicOptions: Record<publicType, string> = {
  family: "Famille",
  women: "Femmes",
  youths: "Jeunes (de 16 à 25 ans)",
  senior: "Séniors",
};
const frenchLevelOptions: Record<frenchLevelType, string> = {
  "A1.1": "en cours d'alphabétisation",
  "A1": "je découvre le français",
  "A2": "je comprends des messages simples",
  "B1": "je communique avec des francophones",
  "B2": "je communique avec aisance",
  "C1": "je communique avec grande aisance",
  "C2": "...",
};
const ageOptions: Record<ageType, string> = {
  moreThan: "Plus de ** ans",
  between: "Entre ** et ** ans",
  lessThan: "Moins de ** ans",
};

const includeAllRefugees = (publicStatus: publicStatusType[] | undefined) => {
  return !!(
    publicStatus &&
    publicStatus.includes("asile") &&
    publicStatus.includes("refugie") &&
    publicStatus.includes("subsidiaire") &&
    publicStatus.includes("apatride")
  );
};

const MAX_STEP = 4;

const ModalPublic = (props: Props) => {
  const formContext = useFormContext();
  const [step, setStep] = useState<number>(1);

  const [publicStatus, setPublicStatus] = useState<publicStatusType[] | undefined>(undefined);
  const selectPublicStatus = useCallback((option: publicStatusType) => {
    setPublicStatus((options) =>
      options?.includes(option) ? options.filter((o) => o !== option) : [...(options || []), option],
    );
  }, []);

  const [publicType, setPublicType] = useState<publicType[] | null | undefined>(undefined);
  const selectPublicType = useCallback((option: publicType) => {
    setPublicType((options) =>
      options?.includes(option) ? options.filter((o) => o !== option) : [...(options || []), option],
    );
  }, []);

  const [frenchLevel, setFrenchLevel] = useState<frenchLevelType[] | null | undefined>(undefined);
  const selectFrenchLevel = useCallback((option: frenchLevelType) => {
    setFrenchLevel((options) =>
      options?.includes(option) ? options.filter((o) => o !== option) : [...(options || []), option],
    );
  }, []);

  const [ageType, setAgeType] = useState<ageType>("moreThan");
  const [ages, setAges] = useState<number[]>([]);
  const [noAge, setNoAge] = useState(false);

  const validate = () => {
    if (step === 1) {
      const newPublicStatus: Metadatas["publicStatus"] = publicStatus;
      if (newPublicStatus !== undefined) {
        formContext.setValue("metadatas.publicStatus", newPublicStatus);
      }
      setStep(2);
    } else if (step === 2) {
      const newPublicType: Metadatas["public"] = publicType;
      if (newPublicType !== undefined) {
        formContext.setValue("metadatas.public", newPublicType);
      }
      setStep(3);
    } else if (step === 3) {
      const newFrenchLevel: Metadatas["frenchLevel"] = frenchLevel;
      if (newFrenchLevel !== undefined) {
        formContext.setValue("metadatas.frenchLevel", newFrenchLevel);
      }
      setStep(4);
    } else if (step === 4) {
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
      formContext.setValue("metadatas.age", age);
      props.toggle();
    }
  };

  return (
    <BaseModal show={props.show} toggle={props.toggle} help={help} title="À quel public s'adresse votre action ?">
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
            {entries<Record<frenchLevelType, string>>(frenchLevelOptions).map(([key, text]) => (
              <div key={key}>
                <ChoiceButton
                  key={key}
                  text={`${key === "A1.1" ? "Infra A1 et A1.1" : key} : ${text}`}
                  type="checkbox"
                  selected={!!(frenchLevel && frenchLevel?.includes(key))}
                  onSelect={() => selectFrenchLevel(key)}
                  className="mb-2"
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
      </div>
    </BaseModal>
  );
};

export default ModalPublic;
