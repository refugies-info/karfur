import React, { ReactElement, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import { getPath } from "routes";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";

const AuthEmail = () => {
  const router = useRouter();
  const [error, setError] = useState("");

  const submit = useCallback(
    (e: any) => {
      e.preventDefault();
      const email = e.target.email.value;
      const emailExists = true; // TODO: check email exists, and redirect
      if (emailExists) {
        const hasDoubleAuthent = true; // TODO: check email exists, and redirect
        if (hasDoubleAuthent) {
          router.push(getPath("/auth/connexion", "fr", `?email=${email}&2fa=true`));
        } else {
          router.push(getPath("/auth/connexion", "fr", `?email=${email}`));
        }
      } else {
        router.push(getPath("/auth/inscription", "fr", `?email=${email}`));
      }
    },
    [router],
  );

  const loginGoogle = useCallback(() => {}, []);
  const loginOutlook = useCallback(() => {}, []);
  const loginInclusionConnect = useCallback(() => {}, []);

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO title="Bienvenue" />

      <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
        Retour
      </Button>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Bienvenue&nbsp;!</h1>
          <p className={styles.subtitle}>
            Votre compte Réfugiés.info vous permet d’avoir une expérience personnalisée.
          </p>
        </div>

        <form onSubmit={submit}>
          <Input
            label="Adresse mail"
            state={!error ? "default" : "error"}
            stateRelatedMessage={error}
            nativeInputProps={{
              autoFocus: true,
              type: "email",
              name: "email",
            }}
          />

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={styles.button}
            nativeButtonProps={{ type: "submit" }}
          >
            Continuer
          </Button>
        </form>

        <div className={styles.separator}>
          <span>ou connectez-vous avec</span>
        </div>

        <Button onClick={loginGoogle} className={cls(styles.button, "mb-4")} priority="tertiary">
          Google
        </Button>
        <Button onClick={loginOutlook} className={cls(styles.button, "mb-4")} priority="tertiary">
          Outlook
        </Button>
        <Button onClick={loginInclusionConnect} className={cls(styles.button, "mb-4")} priority="tertiary">
          Inclusion Connect
        </Button>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthEmail;

// override default layout and options
AuthEmail.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
