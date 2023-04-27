import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { DispositifStatus } from "api-types";
import { userSelector } from "services/User/user.selectors";
import { isStatus } from "lib/dispositif";
import Button from "components/UI/Button";
import ChoiceButton from "components/Pages/dispositif/Edition/ChoiceButton";
import StepBar from "../../../StepBar";
import PublicationSteps from "./PublicationSteps";
import BubbleFlags from "./BubbleFlags";
import { TOTAL_STEPS } from "../../functions";
import { getTextContent } from "./functions";
import { Content } from "./data";
import PublishImage from "assets/dispositif/publish-image.svg";
import YesIcon from "assets/dispositif/yes-icon.svg";
import NoIcon from "assets/dispositif/no-icon.svg";
import styles from "./CompleteContent.module.scss";

interface Props {
  status: DispositifStatus | null;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  toggle: () => void;
  onPublish: (keepTranslations: boolean) => Promise<void>;
}

const CompleteContent = (props: Props) => {
  const { status, onPublish, toggle, setTitle } = props;
  const user = useSelector(userSelector);
  const [step, setStep] = useState<0 | 1>(0);
  const [textContent, setTextContent] = useState<Content[]>(getTextContent(status));
  const [keepTranslations, setKeepTranslations] = useState(false);

  useEffect(() => {
    const textContent = getTextContent(status);
    setTitle(textContent[step].title); // TODO: if admin and no changes -> Tout est prêt !
    setTextContent(textContent); // TODO: if admin and no changes -> Les changements que tu as effectué n'ont pas impacté les traductions. Publier tes modifications ne déclenchera pas un nouveau processus de traduction.
  }, [status, step, setTitle]);

  const content = useMemo(() => {
    // status === ACTIVE
    if (isStatus(status, DispositifStatus.ACTIVE)) {
      // role === admin
      if (user.admin) {
        // TODO: only if content changes (new API endpoint?)
        return (
          <>
            <ChoiceButton
              text="Traduire les modifications"
              type="radio"
              selected={keepTranslations === false}
              onSelect={() => setKeepTranslations(false)}
              image={YesIcon}
              className="mb-2"
            />
            <ChoiceButton
              text="Ne pas traduire les modifications"
              type="radio"
              selected={keepTranslations === true}
              onSelect={() => setKeepTranslations(true)}
              image={NoIcon}
            />
            <div className="text-end mt-8">
              <Button
                onClick={() => onPublish(keepTranslations).then(toggle)}
                icon="arrow-forward-outline"
                iconPlacement="end"
              >
                Valider
              </Button>
            </div>
          </>
        );

        // TODO : if admin and no changes, new content (cf https://app.asana.com/0/1200625325783854/1204226726560920/f)
        /* return (
          <>
            <StepBar
              total={TOTAL_STEPS}
              progress={TOTAL_STEPS}
              text={`${TOTAL_STEPS} étapes complétées sur ${TOTAL_STEPS}`}
            />
            <div className="text-end">
              <Button onClick={() => onPublish(false).then(toggle)} icon="arrow-forward-outline" iconPlacement="end">
                Publier
              </Button>
            </div>
          </>
        ); */
      }
      // role === user
      return (
        <>
          <StepBar
            total={TOTAL_STEPS}
            progress={TOTAL_STEPS}
            text={`${TOTAL_STEPS} étapes complétées sur ${TOTAL_STEPS}`}
          />
          <PublicationSteps
            items={[
              {
                title: "Modification de la fiche",
                done: true,
              },
              {
                title: "Traduction des modifications en 7 langues",
                subtitle: (
                  <>
                    Votre fiche est traduite gratuitement par des experts linguistes en anglais, arabe, pachto, persan,
                    tigrinya, ukrainien et russe.
                    <BubbleFlags />
                  </>
                ),
              },
            ]}
          />
          <div className="text-end">
            <Button onClick={() => onPublish(false).then(toggle)} icon="arrow-forward-outline" iconPlacement="end">
              Envoyer pour traduction
            </Button>
          </div>
        </>
      );
    }

    // status === other
    if (step === 0) {
      return (
        <>
          <StepBar
            total={TOTAL_STEPS}
            progress={TOTAL_STEPS}
            text={`${TOTAL_STEPS} étapes complétées sur ${TOTAL_STEPS}`}
          />
          <div className="text-center mb-8 mt-6">
            <Image src={PublishImage} width={345} height={240} alt="" />
          </div>
          <div className="text-end">
            <Button
              onClick={() => onPublish(false).then(() => setStep(1))}
              icon="arrow-forward-outline"
              iconPlacement="end"
            >
              Envoyer pour relecture
            </Button>
          </div>
        </>
      );
    }
    return (
      <>
        <PublicationSteps
          items={[
            {
              title: "Rédaction de la fiche",
              done: true,
            },
            {
              title: "Relecture par l’équipe éditoriale",
              subtitle: "Nous vous contactons s’il manque des informations essentielles.",
            },
            { title: "Publication de la fiche 🎉", notification: true },
            {
              title: "Traduction en 7 langues",
              subtitle:
                "Votre fiche est traduite gratuitement par des bénévoles et des experts linguistes en anglais, arabe, pachto, persan, tigrinya, ukrainien et russe.",
              notification: true,
            },
          ]}
        />
        <div className="text-end">
          <Button onClick={toggle} icon="checkmark-circle-2" iconPlacement="end">
            C'est noté
          </Button>
        </div>
      </>
    );
  }, [status, step, onPublish, toggle, user.admin, keepTranslations]);

  return (
    <div>
      <p>{textContent[step].intro}</p>
      {content}
    </div>
  );
};

export default CompleteContent;
