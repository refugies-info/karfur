import Button from "@codegouvfr/react-dsfr/Button";
import { useTranslation } from "next-i18next";
import Image from "next/image";
import { memo, useCallback, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import {
  noResultsSelector,
  searchQuerySelector,
  searchResultsSelector,
} from "services/SearchResults/searchResults.selector";
import TutoImg from "~/assets/dispositif/tutoriel-image.svg";
import ResultsFilter from "~/components/Pages/recherche/ResultsFilter";
import DispositifCard from "~/components/UI/DispositifCard";
import { useWindowSize } from "~/hooks";
import { filterByType } from "~/lib/recherche/filterContents";
import { getDisplayRuleForQuery } from "~/lib/recherche/queryContents";
import { resetQueryActionCreator } from "~/services/SearchResults/searchResults.actions";
import styles from "./SearchResults.module.scss";

export const MATCHES_PER_PAGE = 24;

interface Props {
  targetBlank?: boolean;
}

const SearchResults = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const searchResults = useSelector(searchResultsSelector);
  const noResultsDemarche = useSelector(noResultsSelector);
  const selectedDepartment = query.departments.length === 1 ? query.departments[0] : undefined;
  const showSuggestions = useMemo(() => getDisplayRuleForQuery(query, "suggestions")?.display, [query]);

  const [page, setPage] = useState(1);

  const filteredResults = useMemo(() => {
    return {
      matches: searchResults.matches.filter((dispositif) => filterByType(dispositif, query.type)),
      suggestions: searchResults.suggestions,
    };
  }, [query.type, searchResults]);

  const { isMobile } = useWindowSize();
  const dispositifs = useMemo(
    () => (!isMobile ? filteredResults.matches.slice(0, page * MATCHES_PER_PAGE) : filteredResults.matches),
    [filteredResults.matches, isMobile, page],
  );

  const noResults = filteredResults.matches.length === 0;

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

  return (
    <section className={styles.wrapper}>
      <Container className={styles.container}>
        <ResultsFilter />
        {noResults ? (
          <>
            <div className={styles.no_results}>
              <Image src={TutoImg} width={176} height={120} alt="" />
              <div>
                <h2 className="mb-2">
                  {t("Recherche.noResultTitle", "Oups ! Il n’y a aucun résultat avec vos critères de recherche.")}
                </h2>
                <p>{t("Recherche.noResultText", "Utilisez moins de filtres ou vérifiez l’orthographe du mot-clé.")}</p>
              </div>

              <Button
                priority="tertiary"
                onClick={() => dispatch(resetQueryActionCreator())}
                iconId="ri-eraser-line"
                iconPosition="right"
              >
                {t("Recherche.resetFilters", "Effacer les filtres")}
              </Button>
            </div>

            <div>
              <h2 className={styles.no_results_other}>
                {t("Recherche.noResultOther", "Ces fiches peuvent aussi vous intéresser")}
              </h2>
              <div className={styles.results}>
                {noResultsDemarche.map((d) => (
                  <DispositifCard key={d._id.toString()} dispositif={d} targetBlank />
                ))}
              </div>
            </div>
          </>
        ) : (
          <>
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
          </>
        )}
        {showSuggestions && filteredResults.suggestions.length > 0 && (
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
