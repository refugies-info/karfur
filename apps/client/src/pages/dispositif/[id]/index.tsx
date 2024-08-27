import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { END } from "redux-saga";
import Dispositif from "~/components/Content/Dispositif";
import { updateNbViews } from "~/lib/dispositifPage";
import { getLanguageFromLocale } from "~/lib/getLanguageFromLocale";
import { wrapper } from "~/services/configureStore";
import { fetchNeedsActionCreator } from "~/services/Needs/needs.actions";
import { fetchSelectedDispositifActionCreator } from "~/services/SelectedDispositif/selectedDispositif.actions";
import { fetchThemesActionCreator } from "~/services/Themes/themes.actions";
import { fetchUserActionCreator } from "~/services/User/user.actions";
import PageContext from "~/utils/pageContext";

interface Props {
  history: string[];
}

const DispositifPage = (props: Props) => {
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
  if (!dispositif || dispositif.typeContenu !== "dispositif") {
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

export default DispositifPage;
