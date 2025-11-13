import Button from "@codegouvfr/react-dsfr/Button";
import { useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { memo, useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import {
  noResultsSelector,
  searchQuerySelector,
  searchResultsSelector,
} from "services/SearchResults/searchResults.selector";
import TutoImg from "~/assets/dispositif/tutoriel-image.svg";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import ResultsFilter from "~/components/Pages/recherche/ResultsFilter";
import DispositifCard from "~/components/UI/DispositifCard";
import Image from "~/components/UI/Image";
import { filterByType } from "~/lib/recherche/filterContents";
import { getDisplayRuleForQuery } from "~/lib/recherche/queryContents";
import { Event } from "~/lib/tracking";
import { searchCountsDataSelector } from "~/services/SearchCounts/searchCounts.selector";
import { resetFiltersActionCreator } from "~/services/SearchResults/searchResults.actions";
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
  const counts = useSelector(searchCountsDataSelector);
  const selectedDepartment = query.departments.length === 1 ? query.departments[0] : undefined;
  const showSuggestions = useMemo(() => getDisplayRuleForQuery(query, "suggestions")?.display, [query]);

  const announce = useAnnounce();

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

  const remainingItems = useMemo(() => {
    return filteredResults.matches.length - dispositifs.length;
  }, [filteredResults.matches.length, dispositifs.length]);

  const seeMoreCount = useMemo(() => {
    return Math.min(remainingItems, MATCHES_PER_PAGE);
  }, [remainingItems]);

  const noResults = filteredResults.matches.length === 0;

  useEffect(() => {
    if (page > 1) {
      Event("SEE_MORE", "Click on see more button", page.toString());
    }
  }, [page]);

  const handleSeeMore = () => {
    announce(t("Recherche.loadingResults", "Chargement de {{count}} résultats...", { count: seeMoreCount }), {
      priority: "interrupt",
      delay: page === 1 ? 1000 : 0,
    });
    setPage(page + 1);
  };

  useEffect(() => {
    if (page === 1) return;

    if (remainingItems > 0) {
      announce(t("Recherche.remainingResults", "Il reste {{count}} résultats à charger", { count: remainingItems }), {
        priority: "normal",
      });
    } else {
      announce(t("Recherche.allResultsDisplayed", "Tous les résultats sont affichés"), {
        priority: "normal",
      });
    }
  }, [announce, remainingItems, page, t]);

  return (
    <section className={styles.wrapper} aria-labelledby="resultats">
      <Container className={styles.container}>
        <ResultsFilter counts={counts} />

        {noResults ? (
          <>
            <div className={styles.no_results} id="resultats-liste">
              <Image src={TutoImg} width={176} height={120} alt="" />
              <div>
                <h2 className="mb-2" id="resultats">
                  {t("Recherche.noResultTitle", "Oups ! Il n’y a aucun résultat avec vos critères de recherche.")}
                </h2>
                <p>{t("Recherche.noResultText", "Utilisez moins de filtres ou vérifiez l’orthographe du mot-clé.")}</p>
              </div>

              <Button
                priority="tertiary"
                onClick={() => dispatch(resetFiltersActionCreator(query.search))}
                iconId="ri-eraser-line"
                iconPosition="right"
              >
                {t("Recherche.resetFilters", "Effacer les filtres")}
              </Button>
            </div>

            <div style={{ width: "100%" }}>
              <h2 className={styles.no_results_other} id="resultats-suggestions">
                {t("Recherche.noResultOther", "Ces fiches peuvent aussi vous intéresser")}
              </h2>
              <div className={styles.results} id="resultats-suggestions-liste">
                {noResultsDemarche.map((d) => (
                  <DispositifCard className={styles.dispositifCard} key={d._id.toString()} dispositif={d} targetBlank />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ width: "100%" }}>
            <h2 id="resultats">
              {t("Recherche.yourResults", { count: dispositifs.length })}
              {remainingItems > 0 && ` ${t("Recherche.resultsOn", { count: searchResults.matches.length })}`}
            </h2>

            <div className={styles.results} id="resultats-liste">
              {dispositifs.length > 0 &&
                dispositifs.map((d) => {
                  if (typeof d === "string") return null; // d can be a string if it comes from generateLightResults
                  return (
                    <DispositifCard
                      className={styles.dispositifCard}
                      key={d._id.toString()}
                      dispositif={d}
                      selectedDepartment={selectedDepartment}
                      targetBlank
                    />
                  );
                })}
            </div>

            <div className="mt-10 flex w-full justify-center">
              {remainingItems !== 0 && (
                <Button onClick={handleSeeMore}>
                  {t("Recherche.loadMore", "Afficher {{count}} résultats supplémentaires", { count: seeMoreCount })}
                </Button>
              )}
            </div>
          </div>
        )}
        {showSuggestions && filteredResults.suggestions.length > 0 && (
          <div style={{ width: "100%" }}>
            <h2 className={styles.no_results_other} id="resultats-suggestions">
              {t("Recherche.suggestedTitle", "Ces fiches peuvent aussi vous intéresser")}
            </h2>
            <div className={styles.results} id="resultats-suggestions-liste">
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
