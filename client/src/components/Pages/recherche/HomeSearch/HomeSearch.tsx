import React, { memo, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Container, Button } from "reactstrap";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { cls } from "lib/classname";
import { TypeOptions } from "data/searchFilters";
import { addToQueryActionCreator } from "services/SearchResults/searchResults.actions";
import { searchResultsSelector } from "services/SearchResults/searchResults.selector";
import ThemesGrid from "components/Content/ThemesGrid/ThemesGrid";
import illuDemarche from "assets/recherche/illu-demarche.svg";
import illuDispositif from "assets/recherche/illu-dispositif.svg";
import illuLocation from "assets/recherche/illu-location.png";
import HomeTypeCard from "../HomeTypeCard";
import CardSlider from "../CardSlider";
import styles from "./HomeSearch.module.scss";
import { ContentType, Id } from "api-types";
import { useEvent } from "hooks";

export const HOME_MAX_SHOWN_DISPOSITIFS = 15;
export const HOME_MAX_SHOWN_DEMARCHES = 15;

const demarchesExamples = [
  "Recherche.demarcheExample1",
  "Recherche.demarcheExample2",
  "Recherche.demarcheExample3",
  "Recherche.demarcheExample4",
  "...",
];
const dispositifsExamples = [
  "Recherche.dispositifExample1",
  "Recherche.dispositifExample2",
  "Recherche.dispositifExample3",
  "Recherche.dispositifExample4",
  "...",
];

const departmentExamples = [
  "Paris",
  "Hauts-de-Seine",
  "Seine-Saint-Denis",
  "Val-de-Marne",
  "Val-d'Oise",
  "Seine-et-Marne",
  "Yvelines",
  "Essonne",
  "Rhône",
  "Côte-d'Or",
  "Bouches-du-Rhône",
  "Puy-de-Dôme",
  "Ille-et-Vilaine",
  "Gironde",
  "Isère",
];

const HomeSearch = () => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const { Event } = useEvent();

  const filteredResult = useSelector(searchResultsSelector);

  const demarches = useMemo(() => filteredResult.demarches.slice(0, HOME_MAX_SHOWN_DEMARCHES), [filteredResult]);
  const dispositifs = useMemo(() => filteredResult.dispositifs.slice(0, HOME_MAX_SHOWN_DISPOSITIFS), [filteredResult]);

  const selectTheme = (themeId: Id) => {
    dispatch(addToQueryActionCreator({ themes: [themeId] }));
    Event("USE_SEARCH", "use home search", "click theme");
  };
  const selectType = (type: TypeOptions) => {
    dispatch(addToQueryActionCreator({ type: type }));
    window.scrollTo(0, 0);
    Event("USE_SEARCH", "use home search", "click type");
  };
  const selectDepartment = (department: string) => {
    dispatch(addToQueryActionCreator({ departments: [department] }));
    window.scrollTo(0, 0);
    Event("USE_SEARCH", "use home search", "click department");
  };

  return (
    <div>
      {/* themes */}
      <div className={styles.section}>
        <ThemesGrid className={styles.container_inner} onClickTheme={(themeId) => selectTheme(themeId)} />
      </div>

      {/* types */}
      <div className={cls(styles.section, styles.white)}>
        <Container className={styles.container_inner}>
          <h2 className="h3">{t("Recherche.titleTypes", "Deux types d'information")}</h2>
          <Row className={styles.content}>
            <Col md="6">
              <HomeTypeCard
                image={illuDemarche}
                title={t("Recherche.demarcheCardTitle")}
                buttonTitle={t("Recherche.seeAllDemarches", "Voir toutes les démarches")}
                // @ts-ignore
                examples={demarchesExamples.map((d) => t(d))}
                onClick={() => selectType("demarche")}
              />
            </Col>
            <Col md="6">
              <HomeTypeCard
                image={illuDispositif}
                title={t("Recherche.dispositifCardTitle")}
                buttonTitle={t("Recherche.seeAllDispositifs", "Voir tous les dispositifs")}
                // @ts-ignore
                examples={dispositifsExamples.map((d) => t(d))}
                onClick={() => selectType("dispositif")}
              />
            </Col>
          </Row>
        </Container>
      </div>

      {/* new */}
      <div className={styles.section}>
        <Container className={styles.container_inner}>
          <div className={styles.title_line}>
            <h2 className="h3">{t("Recherche.titleNewDemarches", "Nouveautés dans les fiches démarches")}</h2>
            <Button onClick={() => selectType("demarche")}>{t("Recherche.seeAllButton", "Voir tout")}</Button>
          </div>
          <CardSlider cards={demarches} type={ContentType.DEMARCHE} />
          <div className={styles.title_line}>
            <h2 className="h3">{t("Recherche.titleNewDispositifs", "Nouveautés dans les fiches dispositifs")}</h2>
            <Button onClick={() => selectType("dispositif")}>{t("Recherche.seeAllButton", "Voir tout")}</Button>
          </div>
          <CardSlider cards={dispositifs} type={ContentType.DISPOSITIF} />
        </Container>
      </div>

      {/* location */}
      <div className={cls(styles.section, styles.white)}>
        <Container className={styles.container_inner}>
          <h2 className="h3">{t("Recherche.titleNearLocation", "Trouvez les fiches près de chez vous")}</h2>
          <Row>
            <Col md={{ size: 6, order: 1 }} xs={{ size: 12, order: 2 }}>
              <div className={styles.departments}>
                {departmentExamples.map((dep, i) => (
                  <button key={i} className={styles.btn} onClick={() => selectDepartment(dep)}>
                    {dep}
                  </button>
                ))}
              </div>
            </Col>
            <Col md={{ size: 6, order: 2 }} xs={{ size: 12, order: 1 }}>
              <div className={styles.image}>
                <Image src={illuLocation} width={440} height={332} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default memo(HomeSearch);
