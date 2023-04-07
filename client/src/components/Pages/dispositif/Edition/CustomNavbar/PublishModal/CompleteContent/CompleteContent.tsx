import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import Image from "next/image";
import { DispositifStatus } from "api-types";
import { userSelector } from "services/User/user.selectors";
import { isStatus } from "lib/dispositif";
import Button from "components/UI/Button";
import StepBar from "../../StepBar";
import ChoiceButton from "../../../ChoiceButton";
import PublicationSteps from "./PublicationSteps";
import BubbleFlags from "./BubbleFlags";
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
    setTitle(textContent[step].title);
    setTextContent(textContent);
  }, [status, step, setTitle]);

  const content = useMemo(() => {
    // status === ACTIVE
    if (isStatus(status, DispositifStatus.ACTIVE)) {
      // role === admin
      if (user.admin) {
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
      }
      // role === user
      return (
        <>
          <StepBar total={14} progress={14} text={"14 étapes complétées sur 14"} />
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
          <StepBar total={14} progress={14} text={"14 étapes complétées sur 14"} />
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
            { title: "Validation par le responsable de la structure" },
            { title: "Publication de la fiche 🎉" },
            {
              title: "Traduction en 7 langues",
              subtitle:
                "Votre fiche est traduite gratuitement par des bénévoles et des experts linguistes en anglais, arabe, pachto, persan, tigrinya, ukrainien et russe.",
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
