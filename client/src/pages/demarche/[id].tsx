import Dispositif from "components/Frontend/Dispositif/Dispositif"
import { wrapper } from "services/configureStore";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { fetchSelectedDispositifActionCreator } from "services/SelectedDispositif/selectedDispositif.actions";
import { fetchUserActionCreator } from "services/User/user.actions";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";

interface Props {
  history: string[]
}

const DispositifPage = (props: Props) => <Dispositif type="detail" typeContenu="demarche" history={props.history} />

export const getServerSideProps = wrapper.getServerSideProps(store => async ({ query, locale }) => {
  if (query.id) {
    const action = fetchSelectedDispositifActionCreator({
      selectedDispositifId: query.id as string,
      locale: locale || "fr"
    });
    store.dispatch(action);
    store.dispatch(fetchThemesActionCreator());
    store.dispatch(fetchUserActionCreator());
    store.dispatch(END);
    await store.sagaTask?.toPromise();
  }

  // 404
  if (
    !store.getState().selectedDispositif ||
    store.getState().selectedDispositif.typeContenu !== "demarche"
  ) {
    return { notFound: true }
  }

  // 200
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  }
});

export default DispositifPage;
