import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useWatch } from "react-hook-form";
import { useAsyncFn } from "react-use";
import Image from "next/image";
import { DispositifStatus } from "api-types";
import { userSelector } from "services/User/user.selectors";
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
import API from "utils/API";
import { selectedDispositifSelector } from "services/SelectedDispositif/selectedDispositif.selector";
import styles from "./CompleteContent.module.scss";

interface Props {
  status: DispositifStatus | null;
  setTitle: React.Dispatch<React.SetStateAction<string>>;
  toggle: () => void;
  onPublish: (keepTranslations: boolean) => Promise<void>;
  redirectToBo: () => void;
}

const CompleteContent = (props: Props) => {
  const { status, onPublish, toggle, setTitle } = props;
  const user = useSelector(userSelector);
  const [step, setStep] = useState<0 | 1>(0);
  const [keepTranslations, setKeepTranslations] = useState(false);
  const dispositif = useSelector(selectedDispositifSelector);
  const [textContent, setTextContent] = useState<Content[]>(
    getTextContent(status, !!dispositif?.hasDraftVersion, undefined, user.admin),
  );
  const values = useWatch();

  const [hasChanges, setHasChanges] = useState<boolean | null>(user.admin ? null : false); // check changes only for admins
  const [{ loading }, getHasChanges] = useAsyncFn(() =>
    dispositif?._id && user.admin
      ? API.getDispositifHasTextChanges(dispositif?._id.toString()).then((res) => res.data.data)
      : Promise.resolve(false),
  );

  // when form changes, reset hasChange
  useEffect(() => {
    setHasChanges(user.admin ? null : false);
  }, [values, user.admin]);

  useEffect(() => {
    if (!loading && hasChanges === null) getHasChanges().then((res) => setHasChanges(res));
  }, [hasChanges, loading, getHasChanges]);

  useEffect(() => {
    if (hasChanges !== null) {
      const textContent = getTextContent(status, !!dispositif?.hasDraftVersion, hasChanges, user.admin);
      setTitle(textContent[step].title);
      setTextContent(textContent);
    }
  }, [status, step, setTitle, hasChanges, dispositif, user.admin]);

  const content = useMemo(() => {
    // status === ACTIVE
    if (dispositif?.hasDraftVersion) {
      // role === admin and changes
      if (user.admin) {
        return hasChanges ? (
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
                onClick={() => onPublish(keepTranslations).then(props.redirectToBo)}
                icon="arrow-forward-outline"
                iconPlacement="end"
              >
                Valider
              </Button>
            </div>
          </>
        ) : (
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
                onClick={() => onPublish(false).then(props.redirectToBo)}
                icon="arrow-forward-outline"
                iconPlacement="end"
              >
                Publier
              </Button>
            </div>
          </>
        );
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
            <Button
              onClick={() => onPublish(false).then(props.redirectToBo)}
              icon="arrow-forward-outline"
              iconPlacement="end"
            >
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
  }, [step, onPublish, toggle, user.admin, keepTranslations, hasChanges, dispositif]);

  return (
    <div>
      {hasChanges !== null && (
        <>
          <p>{textContent[step].intro}</p>
          {content}
        </>
      )}
    </div>
  );
};

export default CompleteContent;
