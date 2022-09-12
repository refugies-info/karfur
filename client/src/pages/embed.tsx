import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import { decodeQuery, queryDispositifs } from "lib/filterContents";
import {
  fetchLanguesActionCreator,
  toggleLangueActionCreator,
} from "services/Langue/langue.actions";
import { wrapper } from "services/configureStore";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { cls } from "lib/classname";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import {
  allLanguesSelector,
  languei18nSelector,
} from "services/Langue/langue.selectors";
import styles from "scss/pages/recherche.module.scss";
import { themesSelector } from "services/Themes/themes.selectors";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";

export type SearchQuery = {
  theme?: string;
  age?: string;
  frenchLevel?: string;
  type?: "dispositifs" | "demarches";
  langue?: string;
  loc?: {
    city: string;
    dep: string;
  };
  order: "created_at" | "nbVues" | "theme" | "";
};

const Embed = () => {
  const allDispositifs = useSelector(activeDispositifsSelector);
  const languei18nCode = useSelector(languei18nSelector);
  const langues = useSelector(allLanguesSelector);
  const themes = useSelector(themesSelector);
  const router = useRouter();

  const initialQuery = decodeQuery(router.query);
  const queryResults = queryDispositifs(
    allDispositifs,
    initialQuery.query,
    languei18nCode,
    themes
  );
  const {
    themesObject,
    filterVille,
  } = queryResults;
  const { query } = initialQuery;

  const currentLanguage = langues.find((x) => x.i18nCode === router.locale);
  const langueCode = currentLanguage
    ? currentLanguage.langueCode
    : "fr";
  const filterLanguage = query.langue
    ? langues.find((x) => x.i18nCode === query.langue)
    : undefined;
  const selectedTheme = query.theme && query.theme.length === 1
    ? themes.find((theme) => theme.name.fr === query.theme?.[0])
    : undefined;

  const flagIconCode = filterLanguage?.langueCode || langueCode;

  return (
    <div className={cls(styles.container, styles.embed)}>
      <div className="w-100">
        <div
          className={cls(styles.search_wrapper)}
          style={{
            backgroundColor:
              query.order === "theme"
                ? themesObject[0]?.theme.colors.color30 || "#f1e8f5"
                : query.theme
                ? selectedTheme?.colors.color30
                : "#e4e5e6",
          }}
        >
        </div>
      </div>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale }) => {
      if (locale) {
        store.dispatch(toggleLangueActionCreator(locale)); // will fetch dispositifs automatically
      } else {
        store.dispatch(fetchActiveDispositifsActionsCreator());
      }
      store.dispatch(fetchLanguesActionCreator());
      store.dispatch(fetchThemesActionCreator());
      store.dispatch(END);
      await store.sagaTask?.toPromise();

      return {
        props: {
          ...(await serverSideTranslations(getLanguageFromLocale(locale), [
            "common",
          ])),
        },
      };
    }
);

export default Embed;

// override default layout and options
Embed.getLayout = (page: ReactElement) => page;
Embed.options = {
  cookiesModule: false,
  supportModule: false
}
