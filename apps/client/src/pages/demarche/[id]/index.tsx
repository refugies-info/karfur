import Dispositif from "components/Content/Dispositif";
import { wrapper } from "services/configureStore";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { fetchSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";
import { fetchUserActionCreator } from "services/User/user.actions";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { updateNbViews } from "lib/dispositifPage";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import PageContext from "utils/pageContext";
import { fetchNeedsActionCreator } from "services/Needs/needs.actions";

interface Props {
  history: string[];
}

const DemarchePage = (props: Props) => {
  return (
    <PageContext.Provider value={{ mode: "view" }}>
      <Dispositif />
    </PageContext.Provider>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ req, query, locale }) => {
  if (query.id) {
    const action = fetchSelectedDispositifActionCreator({
      selectedDispositifId: query.id as string,
      locale: locale || "fr",
      token: req.cookies.authorization,
    });
    store.dispatch(action);
    store.dispatch(fetchThemesActionCreator());
    store.dispatch(fetchNeedsActionCreator());
    store.dispatch(fetchUserActionCreator({ token: req.cookies.authorization }));

    store.dispatch(END);
    await store.sagaTask?.toPromise();
  }

  // 404
  const dispositif = store.getState().selectedDispositif;
  if (!dispositif || dispositif.typeContenu !== "demarche") {
    return { notFound: true };
  }

  await updateNbViews(dispositif);

  // 200
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  };
});

export default DemarchePage;
