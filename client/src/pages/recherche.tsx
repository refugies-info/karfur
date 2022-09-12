import React, { useEffect } from "react";
import { END } from "redux-saga";
import SEO from "components/Seo";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { wrapper } from "services/configureStore";
import { toggleLangueActionCreator } from "services/Langue/langue.actions";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { cls } from "lib/classname";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import styles from "scss/pages/recherche.module.scss";
import { useRouter } from "next/router";

export type SearchQuery = {
  departments?: string[];
  needs?: string[];
  theme?: string;
  keyword?: string;
  age?: string;
  frenchLevel?: string;
  langue?: string;
  order: "date" | "views" | "theme" | "";
  type?: "dispositifs" | "demarches";
};

const Recherche = () => {
  return (
    <div className={cls(styles.container)}>
      <SEO title="Recherche" />

    </div>
  );
}

export const getServerSideProps = wrapper.getServerSideProps(
  (store) =>
    async ({ locale }) => {
      if (locale) {
        store.dispatch(toggleLangueActionCreator(locale)); // will fetch dispositifs automatically
      } else {
        store.dispatch(fetchActiveDispositifsActionsCreator());
      }
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

export default Recherche;
