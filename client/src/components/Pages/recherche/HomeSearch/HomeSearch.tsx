import React, { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { ObjectId } from "mongodb";
import { Row, Col, Container, Button } from "reactstrap";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { cls } from "lib/classname";
import { sortThemes } from "lib/sortThemes";
import { TypeOptions } from "data/searchFilters";
import { SearchDispositif } from "types/interface";
import { themesSelector } from "services/Themes/themes.selectors";
import SearchThemeButton from "components/UI/SearchThemeButton";
import HomeTypeCard from "../HomeTypeCard";
import DemarcheCard from "../DemarcheCard";
import DispositifCard from "../DispositifCard";
import illuDemarche from "assets/recherche/illu-demarche.svg";
import illuDispositif from "assets/recherche/illu-dispositif.svg";
import illuLocation from "assets/recherche/illu-location.png";
import styles from "./HomeSearch.module.scss";

const demarchesExamples = [
  "Recherche.demarcheExample1",
  "Recherche.demarcheExample2",
  "Recherche.demarcheExample3",
  "Recherche.demarcheExample4",
  "..."
];
const dispositifsExamples = [
  "Recherche.dispositifExample1",
  "Recherche.dispositifExample2",
  "Recherche.dispositifExample3",
  "Recherche.dispositifExample4",
  "..."
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
  "Isère"
];

interface Props {
  setDepartmentsSelected: Dispatch<SetStateAction<string[]>>;
  setSelectedType: Dispatch<SetStateAction<TypeOptions>>;
  setThemesSelected: Dispatch<SetStateAction<ObjectId[]>>;
  dispositifs: SearchDispositif[];
  demarches: SearchDispositif[];
}

const HomeSearch = (props: Props) => {
  const { t } = useTranslation();
  const themes = useSelector(themesSelector);

  return (
    <div>
      {/* themes */}
      <div className={styles.section}>
        <Container className={styles.container_inner}>
          <h2 className="h3">{t("Recherche.titleThemes", "Les thématiques de l'intégration")}</h2>
          <div className={styles.themes}>
            {themes.sort(sortThemes).map((theme, i) => {
              return <SearchThemeButton key={i} theme={theme} onClick={() => props.setThemesSelected([theme._id])} />;
            })}
          </div>
        </Container>
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
                examples={demarchesExamples.map((d) => t(d))}
                onClick={() => props.setSelectedType("demarche")}
              />
            </Col>
            <Col md="6">
              <HomeTypeCard
                image={illuDispositif}
                title={t("Recherche.dispositifCardTitle")}
                buttonTitle={t("Recherche.seeAllDispositifs", "Voir tous les dispositifs")}
                examples={dispositifsExamples.map((d) => t(d))}
                onClick={() => props.setSelectedType("dispositif")}
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
            <Button
              onClick={() => {
                props.setSelectedType("demarche");
                window.scrollTo(0, 0);
              }}
            >
              Voir tout
            </Button>
          </div>
          <div className={cls(styles.results, styles.demarches)}>
            {props.demarches.map((d) => (
              <DemarcheCard key={d._id.toString()} demarche={d} />
            ))}
          </div>
          <div className={styles.title_line}>
            <h2 className="h3">{t("Recherche.titleNewDispositifs", "Nouveautés dans les fiches dispositifs")}</h2>
            <Button
              onClick={() => {
                props.setSelectedType("dispositif");
                window.scrollTo(0, 0);
              }}
            >
              Voir tout
            </Button>
          </div>
          <div className={cls(styles.results, styles.dispositifs)}>
            {props.dispositifs.map((d) => (
              <DispositifCard key={d._id.toString()} dispositif={d} />
            ))}
          </div>
        </Container>
      </div>

      {/* location */}
      <div className={cls(styles.section, styles.white, styles.location)}>
        <Container className={styles.container_inner}>
          <Row>
            <Col>
              <h2 className="h3">{t("Recherche.titleNearLocation", "Trouvez les fiches près de chez vous")}</h2>
              <div className={styles.departments}>
                {departmentExamples.map((dep, i) => (
                  <button
                    key={i}
                    className={styles.btn}
                    onClick={() => {
                      props.setDepartmentsSelected([dep]);
                      window.scrollTo(0, 0);
                    }}
                  >
                    {dep}
                  </button>
                ))}
              </div>
            </Col>
            <Col>
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

export default HomeSearch;
