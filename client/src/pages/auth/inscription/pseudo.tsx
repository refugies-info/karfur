import { ReactElement, useMemo } from "react";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { useRegisterFlow } from "hooks";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import { EditPseudo } from "components/User";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const { userId, getStepCount, next, back } = useRegisterFlow("pseudo");
  const stepCount = useMemo(() => getStepCount(null), [getStepCount]);

  if (!userId) return null;

  return (
    <div className={cls(styles.container, styles.full)}>
      <SEO title="Votre pseudonyme" />
      <div className={styles.container_inner}>
        <Button
          priority="tertiary"
          size="small"
          iconId="fr-icon-arrow-left-line"
          onClick={back}
          className={styles.back_button}
        >
          Retour
        </Button>

        <Stepper currentStep={stepCount[0]} stepCount={stepCount[1]} title={null} />

        <div className={cls(styles.title, styles.sm, "mt-12")}>
          <h1>Choisissez un pseudonyme</h1>
          <p className={styles.subtitle}>
            Au pied de chaque fiche, nous affichons les contributeurs ayant participé à sa rédaction et sa traduction.
          </p>
        </div>

        <EditPseudo successCallback={() => next(null)} />
      </div>
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthLogin;

// override default layout and options
AuthLogin.getLayout = (page: ReactElement) => <Layout fullWidth>{page}</Layout>;
