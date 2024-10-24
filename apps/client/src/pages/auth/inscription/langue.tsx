import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { ReactElement, useCallback, useMemo } from "react";
import { END } from "redux-saga";
import Layout from "~/components/Pages/auth/Layout";
import SEO from "~/components/Seo";
import { EditLanguage } from "~/components/User";
import { useRegisterFlow } from "~/hooks";
import { cls } from "~/lib/classname";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import styles from "~/scss/components/auth.module.scss";
import { wrapper } from "~/services/configureStore";
import { fetchLanguesActionCreator } from "~/services/Langue/langue.actions";

const AuthLogin = () => {
  const { userId, getStepCount, next, back } = useRegisterFlow("langue", true);
  const stepCount = useMemo(() => getStepCount(null), [getStepCount]);

  const successCallback = useCallback(() => {
    next(null);
  }, [next]);

  if (!userId) return null;

  return (
    <div className={cls(styles.container, styles.full)}>
      <SEO title="Votre langue" />
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
          <h1>En quelle langue souhaitez-vous traduire&nbsp;?</h1>
        </div>

        <EditLanguage successCallback={successCallback} buttonFullWidth buttonType="next" />
      </div>
    </div>
  );
};

export const getStaticProps = wrapper.getStaticProps((store) => async ({ locale }) => {
  store.dispatch(fetchLanguesActionCreator());
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
    revalidate: 60 * 10,
  };
});
export default AuthLogin;

// override default layout and options
AuthLogin.getLayout = (page: ReactElement) => <Layout fullWidth>{page}</Layout>;
