import Dispositif from "components/Content/Dispositif";
import { wrapper } from "services/configureStore";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { fetchSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";
import { fetchUserActionCreator } from "services/User/user.actions";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { FormProvider, useForm } from "react-hook-form";
import { logger } from "logger";
import PageContext from "utils/pageContext";

interface Props {
  history: string[];
}

const DemarchePage = (props: Props) => {
  const methods = useForm();
  const onSubmit = (data: any) => logger.info(data);

  return (
    <PageContext.Provider value={{ mode: "translate" }}>
      <FormProvider {...methods}>
        <form onSubmit={methods.handleSubmit(onSubmit)}>
          <Dispositif />
        </form>
      </FormProvider>
    </PageContext.Provider>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query, locale }) => {
  if (query.id) {
    const action = fetchSelectedDispositifActionCreator({
      selectedDispositifId: query.id as string,
      locale: locale || "fr"
    });
    store.dispatch(action);
    store.dispatch(fetchThemesActionCreator());
    // store.dispatch(fetchUserActionCreator());
    store.dispatch(END);
    await store.sagaTask?.toPromise();
  }

  // 404
  const dispositif = store.getState().selectedDispositif;
  if (!dispositif || dispositif.typeContenu !== "demarche") {
    /* TODO: check authorization */
    return { notFound: true };
  }

  // 200
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"]))
    }
  };
});

export default DemarchePage;
