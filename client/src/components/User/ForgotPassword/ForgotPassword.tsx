import { useState, useCallback } from "react";
import { ResetPasswordResponse } from "@refugies-info/api-types";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { logger } from "logger";
import { cls } from "lib/classname";
import API from "utils/API";
import styles from "./ForgotPassword.module.scss";

interface Props {
  email: string;
  successCallback: (res: ResetPasswordResponse) => void;
  buttonFullWidth?: boolean;
}

const ForgotPassword = ({ email, buttonFullWidth, successCallback }: Props) => {
  const [error, setError] = useState("");

  const submit = useCallback(
    async (e: any) => {
      e.preventDefault();
      const email = e.target.email.value;
      try {
        const res = await API.resetPassword({ email });
        successCallback(res);
      } catch (e: any) {
        logger.error(e);
        setError("Une erreur est survenue, veuillez réessayer ou contacter un administrateur");
      }
    },
    [successCallback],
  );

  return (
    <form onSubmit={submit} className={styles.container}>
      <Input
        label="Adresse mail"
        state={!error ? "default" : "error"}
        stateRelatedMessage={error}
        className="mb-0"
        nativeInputProps={{
          autoFocus: true,
          type: "email",
          name: "email",
          defaultValue: email,
        }}
      />

      <div className="text-end">
        <Button
          iconId="fr-icon-mail-line"
          iconPosition="right"
          className={cls(styles.button, buttonFullWidth && styles.full, styles.mt)}
          nativeButtonProps={{ type: "submit" }}
        >
          Envoyer le lien de réinitialisation
        </Button>
      </div>
    </form>
  );
};

export default ForgotPassword;
