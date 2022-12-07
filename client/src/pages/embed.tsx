import React, { ReactElement } from "react";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import { useSelector } from "react-redux";
import { END } from "redux-saga";
import { Container } from "reactstrap";
import Image from "next/legacy/image";
import { queryDispositifs } from "lib/recherche/queryContents";
import decodeQuery from "lib/recherche/decodeUrlQuery";
import { fetchLanguesActionCreator, toggleLangueActionCreator } from "services/Langue/langue.actions";
import { wrapper } from "services/configureStore";
import { fetchActiveDispositifsActionsCreator } from "services/ActiveDispositifs/activeDispositifs.actions";
import { themesSelector } from "services/Themes/themes.selectors";
import { fetchThemesActionCreator } from "services/Themes/themes.actions";
import { addToQueryActionCreator, setSearchResultsActionCreator } from "services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { getLanguageFromLocale } from "lib/getLanguageFromLocale";
import { cls } from "lib/classname";
import SearchResults from "components/Pages/recherche/SearchResults";
import EmbedHeader from "components/Pages/embed/EmbedHeader";
import LogoDiair from "assets/embed/logo-diair.png";
import LogoRI from "assets/embed/logo-ri-inline.png";
import styles from "scss/pages/recherche.module.scss";

const Embed = () => {
  const themes = useSelector(themesSelector);
  const query = useSelector(searchQuerySelector);
  const themesSelected = themes.filter((t) => query.themes.includes(t._id));

  return (
    <div className={cls(styles.container, styles.embed)}>
      <Container className={styles.container_inner}>
        <EmbedHeader themes={themes} languages={query.language} departments={query.departments} />
        <SearchResults
          themesSelected={themesSelected}
          departmentsNotDeployed={[]}
          targetBlank={true}
          resetFilters={() => {}}
        />

        <footer>
          <p>
            Contenu proposé par
            <div className={styles.logo}>
              <Image src={LogoDiair} width={88} height={90} alt="Logo DIAIR" />
            </div>
            <div className={styles.logo}>
              <Image src={LogoRI} width={186} height={32} alt="Logo Réfugiés.info" />
            </div>
          </p>
        </footer>
      </Container>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ query, locale }) => {
  if (locale) {
    store.dispatch(toggleLangueActionCreator(locale)); // will fetch dispositifs automatically
  } else {
    store.dispatch(fetchActiveDispositifsActionsCreator());
  }
  store.dispatch(fetchLanguesActionCreator());
  store.dispatch(fetchThemesActionCreator());
  store.dispatch(END);
  await store.sagaTask?.toPromise();

  const initialQuery = decodeQuery(query, store.getState().themes.activeThemes);
  const results = queryDispositifs(initialQuery, store.getState().activeDispositifs);
  store.dispatch(setSearchResultsActionCreator(results));
  store.dispatch(addToQueryActionCreator(initialQuery));

  return {
    props: {
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"]))
    }
  };
});

export default Embed;

// override default layout and options
Embed.getLayout = (page: ReactElement) => page;
Embed.options = {
  cookiesModule: false,
  supportModule: false
};
