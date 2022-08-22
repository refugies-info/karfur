import { wrapper } from "services/configureStore";
import { END } from "redux-saga";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { getLanguageFromLocale } from "./getLanguageFromLocale";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";

export const defaultStaticProps = wrapper.getStaticProps(() => async ({ locale }) => {
  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    }
  };
});

export const defaultStaticPropsWithThemes = wrapper.getStaticProps((store) => async ({ locale }) => {
  const action = fetchThemesActionCreator();
  store.dispatch(action);
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
    revalidate: 60 * 60 // need to rebuild the page every 60 mins to update themes
  };
});
