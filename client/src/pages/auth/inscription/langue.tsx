import { ReactElement, useEffect, useMemo, useState } from "react";
import { useSelector } from "react-redux";
import { useAsyncFn } from "react-use";
import { useRouter } from "next/router";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { logger } from "logger";
import API from "utils/API";
import { useRegisterFlow } from "hooks";
import { cls } from "lib/classname";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { wrapper } from "services/configureStore";
import { fetchLanguesActionCreator } from "services/Langue/langue.actions";
import { allLanguesSelector } from "services/Langue/langue.selectors";
import SEO from "components/Seo";
import Layout from "components/Pages/auth/Layout";
import Flag from "components/UI/Flag";
import Error from "components/Pages/auth/Error";
import { ChoiceButton } from "components/Pages/dispositif/Edition";
import styles from "scss/components/auth.module.scss";

const AuthLogin = () => {
  const router = useRouter();
  const languages = useSelector(allLanguesSelector);
  const [error, setError] = useState("");
  const [selectedLanguages, setSelectedLanguages] = useState<string[]>([]);
  const { userId, userDetails, getStepCount, next, back } = useRegisterFlow("langue");
  const stepCount = useMemo(() => getStepCount(null), [getStepCount]);

  useEffect(() => {
    if (userDetails?.selectedLanguages) setSelectedLanguages(userDetails.selectedLanguages);
  }, [userDetails]);

  const [{ loading }, submit] = useAsyncFn(
    async (e: any) => {
      e.preventDefault();
      setError("");
      if (!userId || selectedLanguages.length === 0) return;
      try {
        await API.updateUser(userId.toString(), {
          user: { selectedLanguages },
          action: "modify-my-details",
        });
        next(null);
      } catch (e: any) {
        logger.error(e);
        setError("Une erreur s'est produite, veuillez réessayer ou contacter un administrateur.");
      }
    },
    [router, userId, next, selectedLanguages],
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
          onClick={back}
          className={styles.back_button}
        >
          Retour
        </Button>

        <Stepper currentStep={stepCount[0]} stepCount={stepCount[1]} title="Votre langue" />

        <div className={cls(styles.title, "mt-14")}>
          <h1>En quelle langue souhaitez-vous traduire&nbsp;?</h1>
        </div>

        <form onSubmit={submit}>
          {languages
            .filter((ln) => ln.i18nCode !== "fr")
            .map((language) => {
              const id = language._id.toString();
              const checked = selectedLanguages.includes(id);
              return (
                <ChoiceButton
                  key={language._id.toString()}
                  text={`${language.langueFr} - ${language.langueLoc}`}
                  illuComponent={<Flag langueCode={language?.langueCode} />}
                  type="checkbox"
                  selected={checked}
                  onSelect={() => setSelectedLanguages((ln) => (checked ? ln.filter((l) => l !== id) : [...ln, id]))}
                  className="mb-2"
                />
              );
            })}

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
