import { ReactElement, useCallback, useMemo, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Input } from "@codegouvfr/react-dsfr/Input";
import API from "utils/API";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";
import { getPath } from "routes";

const AuthEmail = () => {
  const router = useRouter();
  const email: string = useMemo(() => router.query.email as string, [router.query]);
  const [error, setError] = useState("");

  const submit = useCallback(
    async (e: any) => {
      e.preventDefault();
      const email = e.target.email.value;
      try {
        const res = await API.resetPassword({ email });
        router.push(getPath("/auth/reinitialiser-mot-de-passe/mail-envoye", "fr", `?email=${res.email}`));
      } catch (e: any) {
        setError("Une erreur est survenue, veuillez réessayer ou contacter un administrateur");
      }
    },
    [router],
  );

  return (
    <div className={cls(styles.container, styles.half)}>
      <SEO title="Bienvenue" />
      <Button priority="tertiary" size="small" iconId="fr-icon-arrow-left-line" onClick={() => router.back()}>
        Retour
      </Button>
      <div className={styles.content}>
        <div className={styles.title}>
          <h1>Mot de passe oublié</h1>
          <p className={styles.subtitle}>
            Nous allons vous envoyer un mail avec des instructions pour le réinitialiser.
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
              defaultValue: email,
            }}
          />

          <Button
            iconId="fr-icon-mail-line"
            iconPosition="right"
            className={cls(styles.button, "mt-8")}
            nativeButtonProps={{ type: "submit" }}
          >
            Envoyer le lien de réinitialisation
          </Button>
        </form>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthEmail;

// override default layout and options
AuthEmail.getLayout = (page: ReactElement) => <Layout>{page}</Layout>;
