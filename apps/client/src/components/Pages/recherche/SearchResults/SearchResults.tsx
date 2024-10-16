import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import { searchQuerySelector, searchResultsSelector } from "services/SearchResults/searchResults.selector";
import noResultsImage from "~/assets/no_results_alt.svg";
import ResultsFilter from "~/components/Pages/recherche/ResultsFilter";
import DispositifCard from "~/components/UI/DispositifCard";
import { useWindowSize } from "~/hooks";
import { filterByType } from "~/lib/recherche/filterContents";
import { resetQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import NotDeployedBanner from "../NotDeployedBanner";
import styles from "./SearchResults.module.scss";

export const MATCHES_PER_PAGE = 24;
const HIDDEN_DEPS_KEY = "hideBannerDepartments";

interface Props {
  departmentsNotDeployed: string[];
  targetBlank?: boolean;
}

const SearchResults = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const searchResults = useSelector(searchResultsSelector);

  const [page, setPage] = useState(1);

  const filteredResults = useMemo(() => {
    return {
      matches: searchResults.matches.filter((dispositif) => filterByType(dispositif, query.type)),
      suggestions: searchResults.suggestions,
    };
  }, [query.type, searchResults]);

  const [departmentsMessageHidden, setDepartmentsMessageHidden] = useState<string[]>([]);

  useEffect(() => {
    const savedDepartments = localStorage.getItem(HIDDEN_DEPS_KEY);
    if (savedDepartments) setDepartmentsMessageHidden(JSON.parse(savedDepartments));
  }, []);

  const { isMobile } = useWindowSize();
  const dispositifs = useMemo(
    () => (!isMobile ? filteredResults.matches.slice(0, page * MATCHES_PER_PAGE) : filteredResults.matches),
    [filteredResults.matches, isMobile, page],
  );

  const selectedDepartment = query.departments.length === 1 ? query.departments[0] : undefined;
  const noResults = filteredResults.matches.length === 0;

  // Banner
  const hideBanner = () => {
    localStorage.setItem(HIDDEN_DEPS_KEY, JSON.stringify(props.departmentsNotDeployed));
    setDepartmentsMessageHidden(props.departmentsNotDeployed);
  };
  const isBannerVisible =
    props.departmentsNotDeployed.length > 0 &&
    props.departmentsNotDeployed.find((dep) => !departmentsMessageHidden.includes(dep));

  const loadMoreData = useCallback(
    (page: number) => {
      // eslint-disable-next-line no-console
      console.log(page, dispositifs.length, filteredResults.matches.length);
      if (dispositifs.length < filteredResults.matches.length) {
        setPage(page);
      }
    },
    [dispositifs.length, filteredResults.matches],
  );

  useEffect(() => {
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
      if (scrollTop + clientHeight >= scrollHeight / 2) {
        setPage((prevPage) => prevPage + 1);
        loadMoreData(page + 1);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page, loadMoreData]);

  if (noResults) {
    return (
      <div className={styles.no_results}>
        <h2>{t("Recherche.noResultTitle", "Oups, aucun résultat")}</h2>
        <p>{t("Recherche.noResultText", "Utilisez moins de filtres ou vérifiez l’orthographe du mot-clé.")}</p>

        <Button onClick={() => dispatch(resetQueryActionCreator())}>
          {t("Recherche.resetFilters", "Effacer tous les filtres")}
        </Button>

        <Image src={noResultsImage} width={420} height={280} alt="No results" />
      </div>
    );
  }

  return (
    <section className={styles.wrapper}>
      <Container className={styles.container}>
        <ResultsFilter />
        {isBannerVisible && <NotDeployedBanner departments={props.departmentsNotDeployed} hideBanner={hideBanner} />}
        <div className={styles.results}>
          {dispositifs.length > 0 &&
            dispositifs.map((d) => {
              if (typeof d === "string") return null; // d can be a string if it comes from generateLightResults
              return (
                <DispositifCard
                  key={d._id.toString()}
                  dispositif={d}
                  selectedDepartment={selectedDepartment}
                  targetBlank
                />
              );
            })}
        </div>
        {filteredResults.suggestions.length > 0 && (
          <div>
            <h2>{t("Recherche.suggestedTitle", "Ces fiches peuvent aussi vous intéresser")}</h2>
            <div className={styles.results}>
              {filteredResults.suggestions.map((d) => {
                if (typeof d === "string") return null; // d can be a string if it comes from generateLightResults
                return (
                  <DispositifCard
                    key={d._id.toString()}
                    dispositif={d}
                    selectedDepartment={selectedDepartment}
                    targetBlank
                  />
                );
              })}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default memo(SearchResults);
