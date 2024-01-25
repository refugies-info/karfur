import { ReactElement, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { useTranslation } from "next-i18next";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import Input from "@codegouvfr/react-dsfr/Input";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { getPasswordStrength } from "lib/validatePassword";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const { t } = useTranslation();
  const email = useMemo(() => router.query.email, [router.query]);
  const [error, setError] = useState("");
  const [password, setPassword] = useState("");
  const passwordStrength = useMemo(() => getPasswordStrength(password), [password]);

  const submit = useCallback(
    (e: any) => {
      e.preventDefault();
      if (!passwordStrength.isOk) return;

      const name = e.target.name.value;
      const password = e.target.password.value;
      // TODO: send infos
      const isRegistered = true;
      if (isRegistered) {
        // TODO: check role
        router.push("/");
      }
    },
    [router, passwordStrength],
  );

  if (!email) return null;

  /* TODO: get extra infos if coming from SSO */

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
            state={!error ? "default" : "error"}
            stateRelatedMessage={error}
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
                  name: "newsletter",
                  value: "true",
                },
              },
            ]}
            small
            className="mt-8 mb-6"
          />

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={cls(styles.button, "mt-8")}
            nativeButtonProps={{ type: "submit" }}
            disabled={!passwordStrength.isOk}
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
