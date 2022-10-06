import React, { Dispatch, SetStateAction } from "react";
import { useSelector } from "react-redux";
import { ObjectId } from "mongodb";
import { Row, Col, Container } from "reactstrap";
import Image from "next/image";
import Link from "next/link";
import qs from "query-string";
import { cls } from "lib/classname";
import { themesSelector } from "services/Themes/themes.selectors";
import SearchThemeButton from "components/UI/SearchThemeButton";
import HomeTypeCard from "../HomeTypeCard";
import illuDemarche from "assets/recherche/illu-demarche.svg";
import illuDispositif from "assets/recherche/illu-dispositif.svg";
import illuLocation from "assets/recherche/illu-location.png";
import styles from "./HomeSearch.module.scss";
import { getPath } from "routes";
import { useRouter } from "next/router";
import { TypeOptions } from "data/searchFilters";
import isInBrowser from "lib/isInBrowser";
import { UrlSearchQuery } from "pages/recherche";
import { needsSelector } from "services/Needs/needs.selectors";
import { SearchDispositif } from "types/interface";
import DemarcheCard from "../DemarcheCard";
import DispositifCard from "../DispositifCard";

const demarchesExamples = [
  "Demander un logement social",
  "Ouvrir un compte bancaire",
  "S’inscrire à Pôle Emploi",
  "S’inscrire à la CAF",
  "..."
];
const dispositifsExamples = [
  "Apprendre le français",
  "Faire une formation de commis",
  "Trouver un logement",
  "Avoir un soutien psychologique",
  "..."
];

const departmentExamples = [
  "Paris",
  "Haut-de-Seine",
  "Seine-Saint-Denis",
  "Val-de-Marne",
  "Val-d’Oise",
  "Seine-et-Marne",
  "Yvelines",
  "Essonne",
  "Rhône",
  "Côtes-d’Or",
  "Bouches-du-Rhône",
  "Puy-de-Dôme",
  "Ille-et-Vilaine",
  "Gironde",
  "Isère"
];

const getSearchPath = (params: UrlSearchQuery, router: any) => {
  if (isInBrowser()) return "#";
  const defaultParams = { sort: "date", type: "all" };
  const urlParams = `?${qs.stringify({ ...defaultParams, ...params }, { arrayFormat: "comma" })}`;
  return getPath("/recherche", router.locale, urlParams);
};

interface Props {
  setDepartmentsSelected: Dispatch<SetStateAction<string[]>>;
  setSelectedType: Dispatch<SetStateAction<TypeOptions>>;
  setNeedsSelected: Dispatch<SetStateAction<ObjectId[]>>;
  dispositifs: SearchDispositif[];
  demarches: SearchDispositif[];
}

const HomeSearch = (props: Props) => {
  const router = useRouter();
  const themes = useSelector(themesSelector);
  const needs = useSelector(needsSelector);

  const getNeedsOfTheme = (themeId: ObjectId) => {
    return [...needs].filter((need) => need.theme._id === themeId).map((n) => n._id);
  };

  return (
    <div>
      <div className={styles.section}>
        <Container className={styles.container_inner}>
          <h2 className="h4">Les thématiques de l'intégration</h2>

          <div className={styles.themes}>
            {themes.map((theme, i) => {
              const selectedNeeds = getNeedsOfTheme(theme._id);
              return (
                <SearchThemeButton
                  key={i}
                  theme={theme}
                  link={getSearchPath({ needs: selectedNeeds }, router)}
                  onClick={() => props.setNeedsSelected(selectedNeeds)}
                />
              );
            })}
          </div>
        </Container>
      </div>
      <div className={cls(styles.section, styles.white)}>
        <Container className={styles.container_inner}>
          <h2 className="h4">Deux types d'information</h2>
          <Row className={styles.content}>
            <Col md="6">
              <HomeTypeCard
                image={illuDemarche}
                title="Les fiches démarches"
                examples={demarchesExamples}
                onClick={() => props.setSelectedType("demarche")}
                link={getSearchPath({ type: "demarche" }, router)}
              />
            </Col>
            <Col md="6">
              <HomeTypeCard
                image={illuDispositif}
                title="Les fiches dispositifs"
                examples={dispositifsExamples}
                onClick={() => props.setSelectedType("dispositif")}
                link={getSearchPath({ type: "dispositif" }, router)}
              />
            </Col>
          </Row>
        </Container>
      </div>
      <div className={styles.section}>
        <Container className={styles.container_inner}>
          <h2 className="h4">Nouveautés dans les fiches démarches</h2>
          <div className={cls(styles.results, styles.demarches)}>
            {props.demarches.map((d) => (
              <DemarcheCard key={d._id.toString()} demarche={d} />
            ))}
          </div>
          <h2 className="h4">Nouveautés dans les fiches dispositifs</h2>
          <div className={cls(styles.results, styles.dispositifs)}>
            {props.dispositifs.map((d) => (
              <DispositifCard key={d._id.toString()} dispositif={d} />
            ))}
          </div>
        </Container>
      </div>
      <div className={cls(styles.section, styles.white, styles.location)}>
        <Container className={styles.container_inner}>
          <Row>
            <Col>
              <h2 className="h4">Trouvez les fiches près de chez vous</h2>
              <div className={styles.departments}>
                {departmentExamples.map((dep, i) => (
                  <Link href={getSearchPath({ departments: [dep] }, router)} key={i}>
                    <a className={styles.btn} onClick={() => props.setDepartmentsSelected([dep])}>
                      {dep}
                    </a>
                  </Link>
                ))}
              </div>
            </Col>
            <Col>
              <div className={styles.image}>
                <Image src={illuLocation} width={440} height={296} alt="" />
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </div>
  );
};

export default HomeSearch;
