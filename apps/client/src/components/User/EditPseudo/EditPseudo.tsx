import { Button } from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { logger } from "logger";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useAsyncFn } from "react-use";
import { cls } from "~/lib/classname";
import { userDetailsSelector } from "~/services/User/user.selectors";
import API from "~/utils/API";
import styles from "./EditPseudo.module.scss";

interface Props {
  successCallback: () => void;
}

const EditPseudo = (props: Props) => {
  const userDetails = useSelector(userDetailsSelector);
  const [error, setError] = useState("");
  const [username, setUsername] = useState<string>("");

  useEffect(() => {
    if (userDetails?.username) setUsername(userDetails.username);
  }, [userDetails]);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      if (!userDetails) return;
      if (!username) {
        setError("Veuillez choisir un pseudonyme.");
        return;
      }
      try {
        await API.updateUser(userDetails._id.toString(), {
          user: { username },
          action: "modify-my-details",
        });
        props.successCallback();
      } catch (e: any) {
        const errorCode = e.response?.data?.code;
        if (errorCode === "USERNAME_TAKEN") {
          setError("Ce nom d'utilisateur est déjà utilisé, veuillez en choisir un autre.");
        } else {
          logger.error(e);
          setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
        }
      }
    },
    [userDetails, props.successCallback, username],
  );

  return (
    <form onSubmit={submit}>
      <Input
        label="Votre pseudonyme"
        className="mt-12 mb-0"
        state={!!error ? "error" : "default"}
        stateRelatedMessage={error}
        hintText="N'indiquez pas de coordonnées personnelles comme votre adresse email. Exemples : Guillaume-afpa, cidff13, sarah-trad, Nora78."
        nativeInputProps={{
          autoFocus: true,
          value: username,
          onChange: (e: any) => setUsername(e.target.value),
        }}
      />

      <Button
        iconId="fr-icon-arrow-right-line"
        iconPosition="right"
        className={cls(styles.button, "mt-12")}
        nativeButtonProps={{ type: "submit" }}
        disabled={loading}
      >
        Suivant
      </Button>
    </form>
  );
};

export default EditPseudo;
