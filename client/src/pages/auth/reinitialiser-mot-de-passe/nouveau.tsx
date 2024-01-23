import { ReactElement, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import PasswordInput from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "services/configureStore";
import { useLogin } from "hooks";
import API from "utils/API";
import { cls } from "lib/classname";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";

interface Props {
  error: string | null;
}

const AuthEmail = (props: Props) => {
  const router = useRouter();
  const { logUser } = useLogin();
  const token: string = useMemo(() => router.query.token as string, [router.query]);
  const [formError, setFormError] = useState("");
  const [step, setStep] = useState<1 | 2>(1);

  const submit = useCallback(
    async (e: any) => {
      e.preventDefault();
      setFormError("");
      const newPassword = e.target.password.value;
      const code = e.target.code.value;
      try {
        const res = await API.setNewPassword({
          newPassword: newPassword,
          reset_password_token: token,
          code,
        });
        if (!res.token) throw new Error();
        logUser(res.token);
      } catch (e: any) {
        const errorCode = e.response?.data?.code;
        if (errorCode === "NO_CODE_SUPPLIED") {
          setStep(2);
        } else if (errorCode === "USED_PASSWORD") {
          setFormError("Le mot de passe ne peut pas être identique à l'ancien mot de passe.");
        } else if (errorCode === "PASSWORD_TOO_WEAK") {
          setFormError("Mot de passe trop faible");
        } else {
          setFormError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
        }
      }
    },
    [logUser, token],
  );

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO title="Bienvenue" />
      <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
        Retour
      </Button>
      {props.error ? (
        <div className={styles.content}>
          <div className={styles.title}>
            <h1>Erreur</h1>
            {props.error && <p className={styles.subtitle}>{props.error}</p>}
            {/* TODO: design */}
          </div>
        </div>
      ) : (
        <div className={styles.content}>
          <div className={styles.title}>
            <h1>Mot de passe oublié</h1>
            {step === 1 ? (
              <p className={styles.subtitle}>Veuillez entrer votre nouveau mot de passe</p>
            ) : (
              <p className={styles.subtitle}>Veuillez entrer le code de sécurité reçu par mail</p>
            )}
          </div>

          <form onSubmit={submit}>
            <PasswordInput
              label="Mot de passe"
              messages={
                !!formError
                  ? [
                      {
                        message: formError,
                        severity: "error",
                      },
                    ]
                  : []
              }
              messagesHint=""
              nativeInputProps={{ name: "password", autoFocus: true }}
              className={cls(step === 2 && styles.hidden)}
            />

            <Input
              label="Code de vérification"
              state={!formError ? "default" : "error"}
              stateRelatedMessage={formError}
              nativeInputProps={{
                autoFocus: true,
                name: "code",
              }}
              className={cls(step === 1 && styles.hidden)}
            />

            <Button
              iconId="fr-icon-mail-line"
              iconPosition="right"
              className={cls(styles.button, "mt-8")}
              nativeButtonProps={{ type: "submit" }}
            >
              Changer le mot de passe
            </Button>
          </form>
        </div>
      )}
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(() => async ({ query, locale }) => {
  let error: string | null = null;
  if (!query.token) {
    error = "Token manquant";
  } else {
    try {
      await API.checkResetToken(query.token as string);
    } catch (e) {
      error = "Token invalide";
    }
  }

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
      error,
    },
  };
});
export default AuthEmail;

// override default layout and options
AuthEmail.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;