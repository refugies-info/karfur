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
import SearchHeader from "components/Pages/recherche/SearchHeader";
import { useSelector } from "react-redux";
import DemarcheCard from "components/Pages/recherche/DemarcheCard";
import { activeDispositifsSelector } from "services/ActiveDispositifs/activeDispositifs.selector";
import { Container } from "reactstrap";
import DispositifCard from "components/Pages/recherche/DispositifCard";

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
  const dispositifs = useSelector(activeDispositifsSelector);

  return (
    <div className={cls(styles.container)}>
      <SEO title="Recherche" />
      <SearchHeader />

      <Container>
        <div className="d-flex flex-wrap">
          {dispositifs
            .filter((d) => d.typeContenu === "dispositif")
            .slice(0, 10)
            .map((d, i) => (
              <DispositifCard key={i} dispositif={d} />
            ))}
        </div>

        <div className="d-flex flex-wrap">
          {dispositifs
            .filter((d) => d.typeContenu === "demarche")
            .slice(0, 10)
            .map((d, i) => (
              <DemarcheCard key={i} demarche={d} />
            ))}
        </div>
      </Container>
    </div>
  );
};

export const getServerSideProps = wrapper.getServerSideProps((store) => async ({ locale }) => {
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
      ...(await serverSideTranslations(getLanguageFromLocale(locale), ["common"]))
    }
  };
});

export default Recherche;
