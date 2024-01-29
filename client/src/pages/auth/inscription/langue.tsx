import { ReactElement, useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons";
import { logger } from "logger";
import { getPath } from "routes";
import API from "utils/API";
import { cls } from "lib/classname";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { wrapper } from "services/configureStore";
import { fetchLanguesActionCreator } from "services/Langue/langue.actions";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import { userIdSelector } from "services/User/user.selectors";
import { isLoadingSelector } from "services/LoadingStatus/loadingStatus.selectors";
import { LoadingStatusKey } from "services/LoadingStatus/loadingStatus.actions";
import { fetchUserActionCreator } from "services/User/user.actions";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import Flag from "components/UI/Flag";
import Error from "components/Pages/auth/Error";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const userId = useSelector(userIdSelector);
  const isUserLoading = useSelector(isLoadingSelector(LoadingStatusKey.FETCH_USER));
  const languages = useSelector(allLanguesSelector);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!userId && !isUserLoading) dispatch(fetchUserActionCreator());
  }, [userId, isUserLoading, dispatch]);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      const languages = e.target.language.value;
      if (!userId || !languages) return;
      try {
        await API.updateUser(userId.toString(), {
          user: { selectedLanguages: languages },
          action: "modify-my-details",
        });
        router.push(getPath("/auth/inscription/territoire", "fr"));
      } catch (e: any) {
        logger.error(e);
        setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
      }
    },
    [router, userId],
  );

  if (!userId) return null;

  return (
    <div className={cls(styles.container, styles.full)}>
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
            name="language"
            className={styles.radio}
            options={languages
              .filter((ln) => ln.i18nCode !== "fr")
              .map((language) => ({
                illustration: <Flag langueCode={language?.langueCode} />,
                label: `${language.langueFr} - ${language.langueLoc}`,
                nativeInputProps: {
                  value: language._id.toString(),
                },
              }))}
          />

          <Error error={error} />

          <Button
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            className={cls(styles.button, "mt-14")}
            nativeButtonProps={{ type: "submit" }}
            disabled={loading}
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
