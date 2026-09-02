import { Button } from "@codegouvfr/react-dsfr/Button";
import { isInBrowser } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useCallback, useEffect } from "react";
import { useResetPasswordMail } from "~/hooks";
import { startThrottleIfIdle } from "~/hooks/useThrottledEmail";
import { cls } from "~/lib/classname";
import styles from "./ForgotPasswordMailSent.module.scss";

interface Props {
  email: string;
}

const ForgotPasswordMailSent = ({ email }: Props) => {
  const { t } = useTranslation();
  const { sendResetPasswordMail, secondsLeft, canSendResetPasswordMail } =
    useResetPasswordMail(email);

  // This screen is only reachable after a send, so the countdown runs on arrival.
  useEffect(() => {
    startThrottleIfIdle("reset-password", email);
  }, [email]);

  const sendMail = useCallback(() => {
    sendResetPasswordMail();
  }, [sendResetPasswordMail]);

  const openChat = useCallback(() => {
    if (!isInBrowser()) return;
    window.$crisp.push(["do", "chat:open"]);
  }, []);

  return (
    <>
      <Button
        iconId="fr-icon-mail-line"
        iconPosition="right"
        onClick={sendMail}
        disabled={!canSendResetPasswordMail}
        className={cls(styles.button, "mb-1")}
      >
        Renvoyer le lien de réinitialisation
      </Button>
      <p className={cls(styles.countdown, "mb-4")} role="status">
        {!canSendResetPasswordMail && t("Auth.resendCodeCountdown", { count: secondsLeft })}
      </p>
      <Button onClick={openChat} className={cls(styles.button)} priority="tertiary">
        Contacter le chat
      </Button>
    </>
  );
};

export default ForgotPasswordMailSent;
