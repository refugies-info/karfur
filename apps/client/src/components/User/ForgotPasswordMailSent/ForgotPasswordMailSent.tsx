import { useCallback } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { cls } from "lib/classname";
import isInBrowser from "lib/isInBrowser";
import API from "utils/API";
import styles from "./ForgotPasswordMailSent.module.scss";

interface Props {
  email: string;
}

const ForgotPasswordMailSent = ({ email }: Props) => {
  const sendMail = useCallback(async () => {
    if (!email) return;
    await API.resetPassword({ email });
  }, [email]);

  const openChat = useCallback(() => {
    if (!isInBrowser()) return;
    window.$crisp.push(["do", "chat:open"]);
  }, []);

  return (
    <>
      <Button iconId="fr-icon-mail-line" iconPosition="right" onClick={sendMail} className={cls(styles.button, "mb-4")}>
        Renvoyer le lien de réinitialisation
      </Button>
      <Button onClick={openChat} className={cls(styles.button)} priority="tertiary">
        Contacter le chat
      </Button>
    </>
  );
};

export default ForgotPasswordMailSent;
