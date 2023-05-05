import React, { useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useWatch } from "react-hook-form";
import { useAsyncFn } from "react-use";
import Image from "next/image";
import { useContentType } from "hooks/dispositif";
import { DispositifStatus } from "api-types";
import { userSelector } from "services/User/user.selectors";
import Button from "components/UI/Button";
import ChoiceButton from "components/Pages/dispositif/Edition/ChoiceButton";
import StepBar from "../../../StepBar";
import PublicationSteps from "./PublicationSteps";
import BubbleFlags from "./BubbleFlags";
import { getTotalSteps } from "../../functions";
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
  const { status, onPublish, toggle, setTitle, redirectToBo } = props;
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

  const contentType = useContentType();
  const totalSteps = useMemo(() => getTotalSteps(contentType), [contentType]);

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
                onClick={(e: any) => {
                  e.preventDefault();
                  onPublish(keepTranslations).then(redirectToBo);
                }}
                evaIcon="arrow-forward-outline"
                iconPosition="right"
              >
                Valider
              </Button>
            </div>
          </>
        ) : (
          <>
            <StepBar
              total={totalSteps}
              progress={totalSteps}
              text={`${totalSteps} étapes complétées sur ${totalSteps}`}
            />
            <div className="text-center mb-8 mt-6">
              <Image src={PublishImage} width={345} height={240} alt="" />
            </div>
            <div className="text-end">
              <Button
                onClick={(e: any) => {
                  e.preventDefault();
                  onPublish(false).then(redirectToBo);
                }}
                evaIcon="arrow-forward-outline"
                iconPosition="right"
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
            total={totalSteps}
            progress={totalSteps}
            text={`${totalSteps} étapes complétées sur ${totalSteps}`}
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
              onClick={(e: any) => {
                e.preventDefault();
                onPublish(false).then(redirectToBo);
              }}
              evaIcon="arrow-forward-outline"
              iconPosition="right"
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
            total={totalSteps}
            progress={totalSteps}
            text={`${totalSteps} étapes complétées sur ${totalSteps}`}
          />
          <div className="text-center mb-8 mt-6">
            <Image src={PublishImage} width={345} height={240} alt="" />
          </div>
          <div className="text-end">
            <Button
              onClick={(e: any) => {
                e.preventDefault();
                onPublish(false).then(() => setStep(1));
              }}
              evaIcon="arrow-forward-outline"
              iconPosition="right"
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
          <Button
            onClick={(e: any) => {
              e.preventDefault();
              toggle();
            }}
            evaIcon="checkmark-circle-2"
            iconPosition="right"
          >
            C'est noté
          </Button>
        </div>
      </>
    );
  }, [step, onPublish, toggle, user.admin, keepTranslations, hasChanges, dispositif, totalSteps, redirectToBo]);

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
