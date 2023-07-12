import React, { useState } from "react";
import Image from "next/image";
import { Languages } from "@refugies-info/api-types";
import { useEvent } from "hooks";
import Button from "components/UI/Button";
import BaseModal from "components/UI/BaseModal";
import BubbleFlag from "components/UI/BubbleFlag";
import { StepsFooter } from "../../Edition/Modals/components";
import { expertImages, modalContent } from "./data";
import TranslationStep0 from "assets/dispositif/welcome-step-1.svg";
import TranslationStep1 from "assets/dispositif/translation/translate-step-1.svg";
import TranslationStep2 from "assets/dispositif/translation/translate-step-2.svg";
import TranslationStep3 from "assets/dispositif/translation/translate-step-3.svg";
import styles from "./ModalWelcome.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
  locale: Languages;
}

const MAX_STEP = 5;

const ModalWelcome = (props: Props) => {
  const { Event } = useEvent();
  const [step, setStep] = useState<number>(1);

  const validate = () => {
    if (step < MAX_STEP) {
      setStep((s) => s + 1);
    } else {
      props.toggle();
    }
  };

  return (
    <BaseModal
      show={props.show}
      toggle={() => {
        props.toggle();
        Event("DISPO_TRAD", "close welcome modal", "Modals");
      }}
      title={modalContent[step - 1].title}
      small
      className={styles.modal}
    >
      <div className={styles.content}>
        <p>{modalContent[step - 1].text}</p>

        <div className={styles.image}>
          {step === 1 && <Image src={TranslationStep0} width="524" height="240" alt="" />}
          {step === 2 && <Image src={TranslationStep1} width="126" height="200" alt="" />}
          {step === 3 && <Image src={TranslationStep2} width="218" height="200" alt="" />}
          {step === 4 && <Image src={TranslationStep3} width="257" height="200" alt="" />}
          {step === 5 && (
            <>
              <span className={styles.bubble}>
                <BubbleFlag ln={props.locale} size="lg" />
              </span>
              <div className={styles.expert}>
                <Image src={expertImages[props.locale]} width="160" height="160" alt="" />
              </div>
            </>
          )}
        </div>

        {step === 1 ? (
          <div className="text-end">
            <Button onClick={() => setStep(2)} evaIcon="arrow-forward-outline" iconPosition="right">
              C'est parti !
            </Button>
          </div>
        ) : (
          <StepsFooter
            onValidate={validate}
            onPrevious={() => setStep((s) => s - 1)}
            maxSteps={MAX_STEP - 1}
            step={step - 1}
            previousOnFirst={true}
            nextText={step === MAX_STEP ? "C'est parti !" : undefined}
          />
        )}
      </div>
    </BaseModal>
  );
};

export default ModalWelcome;
