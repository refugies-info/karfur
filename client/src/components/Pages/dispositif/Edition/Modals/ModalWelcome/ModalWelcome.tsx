import Button from "components/UI/Button";
import Image from "next/image";
import React, { useState } from "react";
import { BaseModal } from "components/Pages/dispositif";
import { StepsFooter } from "../components";
import { modalTitles } from "./data";
import TextExampleLine from "./TextExampleLine";
import WelcomeStep1 from "assets/dispositif/welcome-step-1.svg";
import WelcomeStep2 from "assets/dispositif/welcome-step-2.svg";
import WelcomeStep5 from "assets/dispositif/welcome-step-5.png";
import styles from "./ModalWelcome.module.scss";

interface Props {
  show: boolean;
  toggle: () => void;
}

const MAX_STEP = 5;

const ModalWelcome = (props: Props) => {
  const [step, setStep] = useState<number>(1);

  const validate = () => {
    if (step < MAX_STEP) {
      setStep((s) => s + 1);
    } else {
      props.toggle();
    }
  };

  return (
    <BaseModal show={props.show} toggle={props.toggle} title={modalTitles[step - 1]} small className={styles.modal}>
      <div className={styles.content}>
        {step === 1 && (
          <>
            <p>
              Vous allez rédiger une fiche pour présenter votre action. Prenez une minute pour lire ces quelques
              conseils.
            </p>
            <Image src={WelcomeStep1} width="524" height="280" alt="" />
          </>
        )}

        {step === 2 && (
          <>
            <p>
              Votre fiche n’est <span className={styles.error}>pas un support institutionnel</span>, mais{" "}
              <span className={styles.success}>une fiche pratique pour les personnes réfugiées non francophones</span>{" "}
              et leurs accompagnants.
            </p>
            <Image src={WelcomeStep2} width="524" height="240" alt="" />
          </>
        )}

        {step === 3 && (
          <>
            <p>Évitez au maximum le jargon technique (ou expliquez-le en quelques mots).</p>
            <TextExampleLine
              errorText="Un accompagnement vers et dans le logement."
              successText="Un accompagnement pour trouver un logement."
            />
            <TextExampleLine
              errorText="Lever les freins sociolinguistiques au maintien dans l'emploi.  "
              successText="Progresser en français pour trouver et garder votre travail."
            />
            <TextExampleLine
              errorText="Le dispositif s’inscrit dans le PLIE."
              successText="Le dispositif fait partie du Plan Local pour l’Insertion et l’Emploi (PLIE)."
            />
          </>
        )}

        {step === 4 && (
          <>
            <p>
              Une phrase courte est plus facile à lire. Évitez également les blocs de texte trop longs : cela bloque les
              lecteurs.
            </p>
            <TextExampleLine
              errorText="Acquérir et renforcer les compétences sociolinguistiques nécessaires à une autonomie langagière et pragmatique, à l’oral comme à l’écrit, en lien avec l’environnement de travail."
              successText="Améliorer votre niveau de français à l’écrit et à l’oral, pour être autonome dans votre vie quotidienne et au travail.  "
              fullHeight
            />
          </>
        )}

        {step === 5 && (
          <>
            <p>
              C’est un exercice rédactionnel : le gabarit éditorial vous permet de découper votre information en
              différentes parties. Les tutoriels sont là pour vous aider et nous sommes aussi disponibles via le chat en
              bas à droite.
            </p>
            <Image src={WelcomeStep5} width="524" height="248" alt="" />
          </>
        )}

        {step === 1 ? (
          <div className="text-end">
            <Button onClick={() => setStep(2)} icon="arrow-forward-outline" iconPlacement="end">
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
            nextText={step === MAX_STEP ? "Ok, c'est noté !" : undefined}
            nextIcon={step === MAX_STEP ? "arrow-forward-outline" : undefined}
          />
        )}
      </div>
    </BaseModal>
  );
};

export default ModalWelcome;
