import { useEffect, useState } from "react";
import { useAsyncFn } from "react-use";
import { useSelector } from "react-redux";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { logger } from "logger";
import { cls } from "lib/classname";
import API from "utils/API";
import { userDetailsSelector } from "services/User/user.selectors";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import ErrorMessage from "components/UI/ErrorMessage";
import RichCheckbox from "components/UI/RichCheckbox";
import Flag from "components/UI/Flag";
import styles from "./EditLanguage.module.scss";

const buttonProps = {
  validate: {
    icon: "fr-icon-check-line",
    text: "Valider",
  },
  next: {
    icon: "fr-icon-arrow-right-line",
    text: "Suivant",
  },
};

interface Props {
  successCallback: () => void;
  buttonFullWidth?: boolean;
  buttonType: keyof typeof buttonProps;
}

const EditDepartments = (props: Props) => {
  const languages = useSelector(allLanguesSelector);
  const userDetails = useSelector(userDetailsSelector);
  const [error, setError] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);

  useEffect(() => {
    if (userDetails?.selectedLanguages) setSelectedLanguages(userDetails.selectedLanguages);
  }, [userDetails]);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      if (!userDetails) return;
      if (selectedLanguages.length === 0) {
        setError("Veuillez sélectionner au moins une langue.");
        return;
      }
      try {
        await API.updateUser(userDetails._id.toString(), {
          user: { selectedLanguages },
          action: "modify-my-details",
        });
        props.successCallback();
      } catch (e: any) {
        logger.error(e);
        setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
      }
    },
    [userDetails, props.successCallback, selectedLanguages],
  );

  if (!userDetails) return null;

  return (
    <form onSubmit={submit}>
      {languages
        .filter((ln) => ln.i18nCode !== "fr")
        .map((language) => {
          const id = language._id.toString();
          const checked = selectedLanguages.includes(id);
          return (
            <RichCheckbox
              key={language._id.toString()}
              name="language"
              value={language._id.toString()}
              text={
                <>
                  <strong>{language.langueFr}</strong> - {language.langueLoc}
                </>
              }
              illuComponent={<Flag langueCode={language?.langueCode} />}
              checked={checked}
              onSelect={() => setSelectedLanguages((ln) => (checked ? ln.filter((l) => l !== id) : [...ln, id]))}
              className="mb-4 rounded-0"
            />
          );
        })}

      <ErrorMessage error={error} />

      <div className="text-end">
        <Button
          //@ts-ignore
          iconId={buttonProps[props.buttonType].icon}
          iconPosition="right"
          className={cls(styles.button, props.buttonFullWidth && styles.full, "mt-8")}
          nativeButtonProps={{ type: "submit" }}
          disabled={loading}
        >
          {buttonProps[props.buttonType].text}
        </Button>
      </div>
    </form>
  );
};

export default EditDepartments;
