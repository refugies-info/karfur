import { ReactElement, useCallback } from "react";
import { useRouter } from "next/router";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { cls } from "lib/classname";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { wrapper } from "services/configureStore";
import { fetchLanguesActionCreator } from "services/Langue/langue.actions";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import Flag from "components/UI/Flag";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const languages = useSelector(allLanguesSelector);

  const submit = useCallback((e: any) => {
    e.preventDefault();
  }, []);

  return (
    <div className={styles.container}>
      <SEO title="Votre langue" />
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

        <Stepper currentStep={2} stepCount={3} title="Votre langue" />

        <div className={cls(styles.title, "mt-14")}>
          <h1>En quelle langue souhaitez-vous traduire&nbsp;?</h1>
        </div>

        <form onSubmit={submit}>
          <RadioButtons
            name="structure"
            className={styles.radio}
            options={languages.map((language) => ({
              illustration: <Flag langueCode={language?.langueCode} />,
              label: `${language.langueFr} - ${language.langueLoc}`,
              nativeInputProps: {
                value: language.i18nCode,
              },
            }))}
          />

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={cls(styles.button, "mt-14")}
            nativeButtonProps={{ type: "submit" }}
          >
            Suivant
          </Button>
        </form>
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
