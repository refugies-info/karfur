import { ReactElement, useCallback } from "react";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import Input from "@codegouvfr/react-dsfr/Input";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();

  const submit = useCallback((e: any) => {
    e.preventDefault();
    const pseudo = e.target.pseudo;
  }, []);

  return (
    <div className={cls(styles.container, styles.full)}>
      <SEO title="Votre pseudonyme" />
      <div className={styles.container_inner}>
        <Button
          priority="tertiary"
          size="small"
          iconId="fr-icon-arrow-left-line"
          onClick={() => router.back()}
          className={styles.back_button}
        >
          Retour
        </Button>

        <Stepper currentStep={3} stepCount={5} title="Votre pseudonyme" />

        <div className={cls(styles.title, "mt-14")}>
          <h1>Choisissez un pseudonyme</h1>
          <p className={styles.subtitle}>
            Au pied de chaque fiche, nous affichons les contributeurs ayant participé à sa rédaction et sa traduction.
          </p>
        </div>

        <form onSubmit={submit}>
          <Input
            label="Votre pseudonyme"
            className="mt-14"
            nativeInputProps={{
              autoFocus: true,
              name: "pseduo",
            }}
          />

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={cls(styles.button, "mt-7")}
            nativeButtonProps={{ type: "submit" }}
          >
            Suivant
          </Button>
        </form>
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthLogin;

// override default layout and options
AuthLogin.getLayout = (page: ReactElement) => <Layout fullWidth>{page}</Layout>;
