import type { DispositifStatus } from "@refugies-info/api-types";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import { useWatch } from "react-hook-form";
import { useSelector } from "react-redux";
import { useAsyncFn } from "react-use";
import NoIcon from "~/assets/dispositif/no-icon.svg";
import PublishImage from "~/assets/dispositif/publish-image.svg";
import YesIcon from "~/assets/dispositif/yes-icon.svg";
import ChoiceButton from "~/components/Pages/dispositif/Edition/ChoiceButton";
import Button from "~/components/UI/Button";
import Image from "~/components/UI/Image";
import { useContentType } from "~/hooks/dispositif";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";
import { userSelector } from "~/services/User/user.selectors";
import API from "~/utils/API";
import StepBar from "../../../StepBar";
import { getTotalSteps } from "../../functions";
import BubbleFlags from "./BubbleFlags";
import type { Content } from "./data";
import { getTextContent } from "./functions";
import PublicationSteps from "./PublicationSteps";

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
    getTextContent(status, !!dispositif?.hasDraftVersion, undefined),
  );
  const values = useWatch();

  const [hasChanges, setHasChanges] = useState<boolean | null>(null);
  const [{ loading }, getHasChanges] = useAsyncFn(() =>
    dispositif?._id
      ? API.getDispositifHasTextChanges(dispositif?._id.toString())
      : Promise.resolve(false),
  );

  const contentType = useContentType();
  const totalSteps = useMemo(() => getTotalSteps(contentType), [contentType]);

  // when form changes, reset hasChange
  useEffect(() => {
    setHasChanges(null);
  }, [values]);

  useEffect(() => {
    if (!loading && hasChanges === null) getHasChanges().then((res) => setHasChanges(res));
  }, [hasChanges, loading, getHasChanges]);

  useEffect(() => {
    if (hasChanges !== null) {
      const textContent = getTextContent(status, !!dispositif?.hasDraftVersion, hasChanges);
      setTitle(textContent[step].title);
      setTextContent(textContent);
    }
  }, [status, step, setTitle, hasChanges, dispositif]);

  const content = useMemo(() => {
    // status === ACTIVE
    if (dispositif?.hasDraftVersion) {
      // if changes
      if (hasChanges) {
        // for admin = ask to keep trads
        return user.admin ? (
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
            <div className="mt-8 text-end">
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
          // for user = show steps
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
                  title: "Relecture par l’équipe éditoriale",
                  subtitle: "Nous vous contactons s’il manque des informations essentielles.",
                },
                {
                  title: "Publication des mises à jour 🎉",
                  notification: true,
                },
                {
                  title: "Traduction des modifications en 7 langues",
                  subtitle: (
                    <>
                      Votre fiche est traduite gratuitement par des experts linguistes en anglais,
                      arabe, pachto, persan, tigrinya, ukrainien et russe.
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
                Envoyer pour relecture
              </Button>
            </div>
          </>
        );
      }

      // no change
      return (
        <>
          <StepBar
            total={totalSteps}
            progress={totalSteps}
            text={`${totalSteps} étapes complétées sur ${totalSteps}`}
          />
          <div className="mt-6 mb-8 flex justify-center">
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

    // status === other
    if (step === 0) {
      return (
        <>
          <StepBar
            total={totalSteps}
            progress={totalSteps}
            text={`${totalSteps} étapes complétées sur ${totalSteps}`}
          />
          <div className="mt-6 mb-8 flex justify-center">
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
              redirectToBo();
            }}
            evaIcon="checkmark-circle-2"
            iconPosition="right"
          >
            C'est noté
          </Button>
        </div>
      </>
    );
  }, [
    step,
    onPublish,
    user.admin,
    keepTranslations,
    hasChanges,
    dispositif,
    totalSteps,
    redirectToBo,
  ]);

  return (
    <div>
      {hasChanges !== null && (
        <>
          {textContent[step].intro.map((text, index) => (
            <p key={index}>{text}</p>
          ))}
          {content}
        </>
      )}
    </div>
  );
};

export default CompleteContent;
