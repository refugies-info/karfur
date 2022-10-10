import React, { ReactElement } from "react";
import { useRouter } from "next/router";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import { queryDispositifs } from "lib/recherche/queryContents";
import { decodeQuery } from "lib/recherche/decodeUrlQuery";
import {
  fetchLanguesActionCreator,
  toggleLangueActionCreator,
} from "services/Langue/langue.actions";
import { wrapper } from "services/configureStore";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { cls } from "lib/classname";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import styles from "scss/pages/recherche.module.scss";
import { themesSelector } from "services/Themes/themes.selectors";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import SearchResults from "components/Pages/recherche/SearchResults";
import { Container } from "reactstrap";
import EmbedHeader from "components/Pages/recherche/EmbedHeader";

const Embed = () => {
  const dispositifs = useSelector(activeDispositifsSelector);
  const themes = useSelector(themesSelector);
  const router = useRouter();
  const initialQuery = decodeQuery(router.query);
  const filteredResult = queryDispositifs(initialQuery, dispositifs);

  const themesSelected = themes.filter(t => initialQuery.themesSelected.includes(t._id));

  return (
    <div className={cls(styles.container, styles.embed)}>
      <Container className={styles.container_inner}>
        <EmbedHeader
          themes={themesSelected}
          languages={initialQuery.filterLanguage}
          departments={initialQuery.departmentsSelected}
        />
        <SearchResults
          filteredResult={filteredResult}
          selectedType={initialQuery.selectedType}
          themesSelected={themesSelected}
          departmentsSelected={initialQuery.departmentsSelected}
          departmentsNotDeployed={[]}
          targetBlank={true}
          resetFilters={() => {}}
        />
      </Container>
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
