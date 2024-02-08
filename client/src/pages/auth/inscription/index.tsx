import { ReactElement, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { RegisterRequest } from "@refugies-info/api-types";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Input from "@codegouvfr/react-dsfr/Input";
import { logger } from "logger";
import { useRegisterFlow } from "hooks";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { getPasswordStrength } from "lib/validatePassword";
import { getRegisterInfos } from "lib/loginRedirect";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import ErrorMessage from "components/UI/ErrorMessage";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const email = useMemo(() => router.query.email as string, [router.query]);
  const [error, setError] = useState("");
  const [subscribeNewsletter, setSubscribeNewsletter] = useState(false);
  const [password, setPassword] = useState("");
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);
  const { start } = useRegisterFlow(null);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      if (!passwordStrength.isOk || !email) return;
      try {
        const firstName = e.target.name.value;
        const password = e.target.password.value;
        const registerRequest: RegisterRequest = {
          email,
          password,
          firstName,
          subscribeNewsletter,
        };
        const registerInfos = getRegisterInfos();
        if (registerInfos?.role) {
          registerRequest.role = registerInfos.role;
        }

        const { token } = await API.register(registerRequest);
        if (token) start(token, registerInfos?.role);
      } catch (e: any) {
        const errorCode = e.response?.data?.code;
        if (errorCode === "PASSWORD_TOO_WEAK") {
          setError("Votre mot de passe est trop faible.");
        } else {
          logger.error(e);
          setError("Erreur lors de l'inscription, veuillez réessayer.");
        }
      }
    },
    [router, passwordStrength, email, dispatch, start],
  );

  if (!email) return null;

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO title="Bienvenue" />
      <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
        Retour
      </Button>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Créez votre compte</h1>

          <Tag className={cls("mb-5", styles.tag)}>{email}</Tag>
        </div>

        <form onSubmit={submit}>
          <Input
            label="Votre prénom (optionnel)"
            nativeInputProps={{
              autoFocus: true,
              name: "name",
            }}
          />
          <PasswordInput
            label="Mot de passe"
            messages={passwordStrength.criterias.map((criteria) => ({
              message: t(criteria.label),
              severity: !password ? "info" : criteria.isOk ? "valid" : "error",
            }))}
            nativeInputProps={{ name: "password", value: password, onChange: (e: any) => setPassword(e.target.value) }}
          />

          <Checkbox
            options={[
              {
                label: "J'accepte de recevoir l'actualité de Réfugiés.info (maximum 1 fois par mois)",
                nativeInputProps: {
                  checked: subscribeNewsletter,
                  onChange: () => setSubscribeNewsletter((o) => !o),
                },
              },
            ]}
            small
            className="mt-8 mb-6"
          />

          <ErrorMessage error={error} />

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={cls(styles.button, "mt-8")}
            nativeButtonProps={{ type: "submit" }}
            disabled={!passwordStrength.isOk || loading}
          >
            Créer mon compte
          </Button>
        </form>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthLogin;

// override default layout and options
AuthLogin.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
