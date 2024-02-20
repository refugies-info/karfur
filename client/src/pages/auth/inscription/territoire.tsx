import { ReactElement, useMemo, useCallback, useState } from "react";
import { useRouter } from "next/router";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { useRegisterFlow } from "hooks";
import { defaultStaticProps } from "lib/getDefaultStaticProps";
import { cls } from "lib/classname";
import { getInscriptionMessage, getLoginRedirect } from "lib/loginRedirect";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import Loader from "components/Pages/auth/Loader";
import { EditDepartments } from "components/User";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [inscriptionMessage, setInscriptionMessage] = useState("");
  const { userDetails, getStepCount, back } = useRegisterFlow("territoire");
  const successCallback = useCallback(() => {
    const loginRedirect = getLoginRedirect(userDetails?.roles);
    setInscriptionMessage(getInscriptionMessage(loginRedirect));
    router.push(loginRedirect);
  }, [router, userDetails]);
  const stepCount = useMemo(() => getStepCount(null), [getStepCount]);

  if (!userDetails) return null;

  return (
    <div className={cls(styles.container, styles.full)}>
      <SEO title="Votre territoire" />
      {isLoading ? (
        <Loader text="Création de votre espace..." subtitle={inscriptionMessage} />
      ) : (
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
            <h1>Où souhaitez-vous chercher des dispositifs&nbsp;?</h1>
            <p className={styles.subtitle}>
              Nous vous montrerons uniquement les contenus susceptibles de vous intéresser. Pas d’inquiétude, vous
              pourrez les modifier plus tard et les démarches nationales resteront visibles&nbsp;!
            </p>
          </div>

          <EditDepartments successCallback={successCallback} setIsLoading={setIsLoading} buttonFullWidth />
        </div>
      )}
    </div>
  );
};

export const getStaticProps = defaultStaticProps;
export default AuthLogin;

// override default layout and options
AuthLogin.getLayout = (page: ReactElement) => <Layout fullWidth>{page}</Layout>;
