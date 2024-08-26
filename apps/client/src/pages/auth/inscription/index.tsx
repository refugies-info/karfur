import Layout from "@/components/Pages/auth/Layout";
import SEO from "@/components/Seo";
import ErrorMessage from "@/components/UI/ErrorMessage";
import { useAuthRedirect, useRegisterFlow } from "@/hooks";
import { cls } from "@/lib/classname";
import { defaultStaticProps } from "@/lib/getDefaultStaticProps";
import { getRegisterInfos } from "@/lib/loginRedirect";
import { getPasswordStrength } from "@/lib/validatePassword";
import styles from "@/scss/components/auth.module.scss";
import API from "@/utils/API";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Input from "@codegouvfr/react-dsfr/Input";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { RegisterRequest } from "@refugies-info/api-types";
import { logger } from "logger";
import { useTranslation } from "next-i18next";
import { useRouter } from "next/router";
import { ReactElement, useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useAsyncFn } from "react-use";
import { Spinner } from "reactstrap";
import { getPath } from "routes";

const AuthLogin = () => {
  useAuthRedirect(true);
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

      {loading && (
        <div className={styles.mini_loader}>
          <div className={styles.message}>
            <p>Création de compte...</p>
            <Spinner className={styles.spinner} />
          </div>
        </div>
      )}

      <div className={styles.title}>
        <h1>Créez votre compte</h1>
        <Tag
          className={styles.tag}
          dismissible
          nativeButtonProps={{
            onClick: () => router.push(getPath("/auth", "fr")),
          }}
        >
          {email}
        </Tag>
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
          className="mb-0"
        />

        <Checkbox
          options={[
            {
              label: "Recevoir l’actualité mensuelle de Réfugiés.info",
              nativeInputProps: {
                checked: subscribeNewsletter,
                onChange: () => setSubscribeNewsletter((o) => !o),
              },
            },
          ]}
          small
          className={cls(styles.mt, "mb-0")}
        />

        <ErrorMessage error={error} />

        <Button
          iconId="fr-icon-arrow-right-line"
          iconPosition="right"
          className={cls(styles.button, "mt-3")}
          nativeButtonProps={{ type: "submit" }}
          disabled={!passwordStrength.isOk || loading}
        >
          Créer mon compte
        </Button>
      </form>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthLogin;

// override default layout and options
AuthLogin.getLayout = (page: ReactElement) => <Layout loginHelp>{page}</Layout>;
