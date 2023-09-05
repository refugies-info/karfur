import React from "react";
import { useTranslation } from "next-i18next";
import Link from "next/link";
import styles from "scss/components/login.module.scss";
import { getPath } from "routes";
import { useRouter } from "next/router";

interface Props {
  step: number;
  resetPassword: any;
  resetPasswordNotPossible: boolean;
  resetPasswordPossible: boolean;
  login: any;
  unexpectedError: boolean;
  newAdminWithoutPhoneOrEmail: boolean;
  newHasStructureWithoutPhoneOrEmail: boolean;
  userDeletedError: boolean;
}

const Footer = (props: Props) => {
  const { t } = useTranslation();
  const router = useRouter();
  const contactSupportCallback = React.useCallback(() => {
    window.$crisp.push(["do", "chat:open"]);
  }, []);

  const { query } = router;

  const ContactSupport = () => (
    <button onClick={contactSupportCallback} className={styles.link}>
      {t("Login.Contactez le support", "Contactez le support")}
    </button>
  );

  // ERRORS
  if (props.unexpectedError) {
    return (
      <div className={styles.error_message}>
        {t("Login.error_retry", "Une erreur est survenue. Veuillez réessayer.")}
      </div>
    );
  }
  if (props.userDeletedError) {
    return <div className={styles.error_message}>{t("Login.account_deleted", "Ce compte a été supprimé.")}</div>;
  }
  if (props.resetPasswordNotPossible) {
    return (
      <>
        <div className={styles.reset_message}>
          {t(
            "Login.Reset password message",
            "Attention, si vous n'avez pas configuré d'email, vous ne pourrez pas réinitialiser votre mot de passe.",
          )}
        </div>
      </>
    );
  }
  if (props.resetPasswordPossible) {
    return (
      <>
        <div className={styles.footer_links}>
          <button onClick={props.resetPassword} className={styles.link}>
            {t("Login.Renvoyer le lien", "Renvoyer le lien")}
          </button>
        </div>
        <div className={styles.footer_links} style={{ marginTop: 16 }}>
          <ContactSupport />
        </div>
      </>
    );
  }

  // STEPS
  if (props.step === 0) {
    return (
      <>
        <p className={styles.footer_links}>
          {t("Login.no_account_yet", "Pas encore de compte ?")}{" "}
          <Link
            legacyBehavior
            href={{
              pathname: getPath("/register", router.locale),
              query,
            }}
          >
            <a className={styles.link}>{t("Login.create_account", "Créez un compte")}</a>
          </Link>
        </p>

        <p className={styles.footer_links} style={{ marginTop: 0, fontWeight: "bold" }}>
          {t("Login.forgot_username", "Pseudonyme oublié ?")} <ContactSupport />
        </p>
      </>
    );
  }

  if (props.step === 1 && !props.newAdminWithoutPhoneOrEmail && !props.newHasStructureWithoutPhoneOrEmail) {
    return (
      <p className={styles.footer_links}>
        <button onClick={props.resetPassword} className={styles.link}>
          {t("Login.forgot_password", "J'ai oublié mon mot de passe")}
        </button>
      </p>
    );
  }

  if (props.step === 2) {
    return (
      <>
        <p className={styles.footer_links} style={{ marginBottom: 8 }}>
          {t("Login.no_code_received", "Vous n'avez pas reçu le code à ce numéro ?")}
          <button onClick={props.login} className={styles.link}>
            {t("Login.Renvoyer le code", "Renvoyer le code")}
          </button>
        </p>

        <p className={styles.footer_links} style={{ marginTop: 0 }}>
          {t("Login.phone_number_outdated", "Le numéro n’est plus valable ?")}
          <button onClick={contactSupportCallback} className={styles.link}>
            {t("Login.contact_admin_edit_number", "Contactez un administrateur pour le modifier.")}
          </button>
        </p>
      </>
    );
  }
  return null;
};

export default Footer;
