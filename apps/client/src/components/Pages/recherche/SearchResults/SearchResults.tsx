import Button from "@codegouvfr/react-dsfr/Button";
import { useWindowSize } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import {
  noResultsSelector,
  searchLoadingSelector,
  searchPaginationSelector,
  searchQuerySelector,
  searchResultsSelector,
} from "services/SearchResults/searchResults.selector";
import TutoImg from "~/assets/dispositif/tutoriel-image.svg";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import ResultsFilter from "~/components/Pages/recherche/ResultsFilter";
import DispositifCard from "~/components/UI/DispositifCard";
import Image from "~/components/UI/Image";
import { getDisplayRuleForQuery } from "~/lib/recherche/queryContents";
import { Event } from "~/lib/tracking";
import { searchCountsDataSelector } from "~/services/SearchCounts/searchCounts.selector";
import {
  fetchSearchResultsNextPage,
  resetFiltersActionCreator,
} from "~/services/SearchResults/searchResults.actions";
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
  const pagination = useSelector(searchPaginationSelector);
  const loading = useSelector(searchLoadingSelector);
  const selectedDepartment = query.departments.length === 1 ? query.departments[0] : undefined;
  const showSuggestions = useMemo(
    () => getDisplayRuleForQuery(query, "suggestions")?.display,
    [query],
  );

  const announce = useAnnounce();

  // Results come directly from the server, already filtered by type
  const dispositifs = searchResults.matches;
  const remainingItems = pagination.total - dispositifs.length;
  const seeMoreCount = Math.min(remainingItems, MATCHES_PER_PAGE);
  const noResults = dispositifs.length === 0 && !loading;

  // Announce remaining results after Load More completes
  const prevPageRef = useRef(pagination.page);
  useEffect(() => {
    if (pagination.page <= prevPageRef.current) {
      prevPageRef.current = pagination.page;
      return;
    }
    prevPageRef.current = pagination.page;

    if (remainingItems > 0) {
      announce(
        t("Recherche.remainingResults", "Il reste {{count}} résultats à charger", {
          count: remainingItems,
        }),
        { priority: "normal" },
      );
    } else {
      announce(t("Recherche.allResultsDisplayed", "Tous les résultats sont affichés"), {
        priority: "normal",
      });
    }
  }, [pagination.page, remainingItems, announce, t]);

  // RGAA 12.8 : after loading more results, move the focus to the first new card.
  const firstNewCardRef = useRef<HTMLElement | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    if (focusIndex === null || dispositifs.length <= focusIndex) return;
    firstNewCardRef.current?.focus();
    setFocusIndex(null);
  }, [focusIndex, dispositifs.length]);

  const handleSeeMore = () => {
    setFocusIndex(dispositifs.length);
    announce(
      t("Recherche.loadingResults", "Chargement de {{count}} résultats...", {
        count: seeMoreCount,
      }),
      {
        priority: "interrupt",
        delay: pagination.page === 1 ? 1000 : 0,
      },
    );
    Event("SEE_MORE", "Click on see more button", (pagination.page + 1).toString());
    dispatch(fetchSearchResultsNextPage());
  };

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
                  {t(
                    "Recherche.noResultTitle",
                    "Oups ! Il n'y a aucun résultat avec vos critères de recherche.",
                  )}
                </h2>
                <p>
                  {t(
                    "Recherche.noResultText",
                    "Utilisez moins de filtres ou vérifiez l'orthographe du mot-clé.",
                  )}
                </p>
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
                  <DispositifCard
                    className={styles.dispositifCard}
                    key={d._id.toString()}
                    dispositif={d}
                    targetBlank
                  />
                ))}
              </div>
            </div>
          </>
        ) : (
          <div style={{ width: "100%" }}>
            <h2 id="resultats">
              {t("Recherche.yourResults", { count: dispositifs.length })}
              {remainingItems > 0 && ` ${t("Recherche.resultsOn", { count: pagination.total })}`}
            </h2>

            <div className={styles.results} id="resultats-liste">
              {dispositifs.map((d, index) => (
                <DispositifCard
                  className={styles.dispositifCard}
                  key={d._id.toString()}
                  ref={index === focusIndex ? firstNewCardRef : undefined}
                  dispositif={d}
                  selectedDepartment={selectedDepartment}
                  targetBlank
                />
              ))}
            </div>

            <div className="mt-10 flex w-full justify-center">
              {remainingItems > 0 && (
                <Button onClick={handleSeeMore} disabled={loading}>
                  {loading
                    ? t("Recherche.loading", "Chargement...")
                    : t("Recherche.loadMore", "Afficher {{count}} résultats supplémentaires", {
                        count: seeMoreCount,
                      })}
                </Button>
              )}
            </div>
          </div>
        )}
        {showSuggestions && searchResults.suggestions.length > 0 && (
          <div style={{ width: "100%" }}>
            <h2 className={styles.no_results_other} id="resultats-suggestions">
              {t("Recherche.suggestedTitle", "Ces fiches peuvent aussi vous intéresser")}
            </h2>
            <div className={styles.results} id="resultats-suggestions-liste">
              {searchResults.suggestions.map((d) => (
                <DispositifCard
                  key={d._id.toString()}
                  dispositif={d}
                  selectedDepartment={selectedDepartment}
                  targetBlank
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </section>
  );
};

export default memo(SearchResults);
