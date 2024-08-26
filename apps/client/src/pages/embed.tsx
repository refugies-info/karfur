import LogoDiair from "@/assets/embed/logo-diair.png";
import LogoRI from "@/assets/embed/logo-ri-inline.png";
import EmbedHeader from "@/components/Pages/embed/EmbedHeader";
import SearchResults from "@/components/Pages/recherche/SearchResults";
import { cls } from "@/lib/classname";
import { getLanguageFromLocale } from "@/lib/getLanguageFromLocale";
import decodeQuery from "@/lib/recherche/decodeUrlQuery";
import { queryDispositifs } from "@/lib/recherche/queryContents";
import styles from "@/scss/pages/recherche.module.scss";
import { fetchActiveDispositifsActionsCreator } from "@/services/ActiveDispositifs/activeDispositifs.actions";
import { fetchLanguesActionCreator, toggleLangueActionCreator } from "@/services/Langue/langue.actions";
import { addToQueryActionCreator, setSearchResultsActionCreator } from "@/services/SearchResults/searchResults.actions";
import { searchQuerySelector } from "@/services/SearchResults/searchResults.selector";
import { fetchThemesActionCreator } from "@/services/Themes/themes.actions";
import { themesSelector } from "@/services/Themes/themes.selectors";
import { wrapper } from "@/services/configureStore";
import { serverSideTranslations } from "next-i18next/serverSideTranslations";
import Image from "next/image";
import { ReactElement } from "react";
import { useSelector } from "react-redux";
import { Container } from "reactstrap";
import { END } from "redux-saga";

const Embed = () => {
  const themes = useSelector(themesSelector);
  const query = useSelector(searchQuerySelector);

  return (
    <div className={cls(styles.container, styles.embed)}>
      <Container className={styles.container_inner}>
        <EmbedHeader themes={themes} languages={query.language} departments={query.departments} />
        <SearchResults departmentsNotDeployed={[]} targetBlank={true} />

        <footer>
          <p>
            Contenu proposé par
            <span className={styles.logo}>
              <Image src={LogoDiair} width={88} height={90} alt="Logo DIAIR" />
            </span>
            <span className={styles.logo}>
              <Image src={LogoRI} width={186} height={32} alt="Logo Réfugiés.info" />
            </span>
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
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"])),
    },
  };
});

export default Embed;

// override default layout and options
Embed.getLayout = (page: ReactElement) => page;
Embed.options = {
  cookiesModule: false,
  supportModule: false,
};
