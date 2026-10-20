import Button from "@codegouvfr/react-dsfr/Button";
import type { SimpleDispositif } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { memo, useEffect, useMemo, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Container } from "reactstrap";
import { searchQuerySelector } from "services/SearchResults/searchResults.selector";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import ResultsFilter from "~/components/Pages/recherche/ResultsFilter";
import DispositifCard from "~/components/UI/DispositifCard";
import { NoResultsPlaceholder } from "~/components/UI/NoResultsPlaceholder";
import { getDisplayRuleForQuery } from "~/lib/recherche/queryContents";
import { Event } from "~/lib/tracking";
import type { SearchCountsResponse } from "~/pages/api/search/counts";
import { resetFiltersActionCreator } from "~/services/SearchResults/searchResults.actions";
import styles from "./SearchResults.module.scss";

export const MATCHES_PER_PAGE = 24;

interface Props {
  results: SimpleDispositif[];
  suggestions: SimpleDispositif[];
  noResultsSuggestions: SimpleDispositif[];
  counts: SearchCountsResponse | null;
  totalResultsCount: number;
  currentPage: number;
  isLoading: boolean;
  error?: boolean;
  onLoadMore: () => void;
  targetBlank?: boolean;
}

const SearchResults = (props: Props) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const query = useSelector(searchQuerySelector);
  const { results: dispositifs, suggestions, counts, currentPage, isLoading: loading } = props;
  const selectedDepartment = query.departments.length === 1 ? query.departments[0] : undefined;
  const showSuggestions = useMemo(
    () => getDisplayRuleForQuery(query, "suggestions")?.display,
    [query],
  );

  const announce = useAnnounce();

  const remainingItems = props.totalResultsCount - dispositifs.length;
  const seeMoreCount = Math.min(remainingItems, MATCHES_PER_PAGE);
  const noResults = dispositifs.length === 0 && !loading && !props.error;

  // Announce remaining results after Load More completes
  const prevPageRef = useRef(currentPage);
  useEffect(() => {
    if (currentPage <= prevPageRef.current) {
      prevPageRef.current = currentPage;
      return;
    }
    prevPageRef.current = currentPage;

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
  }, [currentPage, remainingItems, announce, t]);

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
        delay: currentPage === 1 ? 1000 : 0,
      },
    );
    Event("SEE_MORE", "Click on see more button", (currentPage + 1).toString());
    props.onLoadMore();
  };

  return (
    <section className={styles.wrapper} aria-labelledby="resultats">
      <Container className={styles.container}>
        <ResultsFilter counts={counts} />

        {props.error ? (
          <NoResultsPlaceholder
            role="alert"
            titleId="resultats"
            title={t("Recherche.errorTitle", "Les résultats n'ont pas pu être chargés.")}
            text={t("Recherche.errorText", "Veuillez réessayer dans quelques instants.")}
          />
        ) : noResults ? (
          <>
            <NoResultsPlaceholder
              titleId="resultats"
              title={t(
                "Recherche.noResultTitle",
                "Oups ! Il n'y a aucun résultat avec vos critères de recherche.",
              )}
              text={t(
                "Recherche.noResultText",
                "Utilisez moins de filtres ou vérifiez l'orthographe du mot-clé.",
              )}
            >
              <Button
                priority="tertiary"
                onClick={() => dispatch(resetFiltersActionCreator(query.search))}
                iconId="ri-eraser-line"
                iconPosition="right"
              >
                {t("Recherche.resetFilters", "Effacer les filtres")}
              </Button>
            </NoResultsPlaceholder>

            <div style={{ width: "100%" }}>
              <h2 className={styles.no_results_other} id="resultats-suggestions">
                {t("Recherche.noResultOther", "Ces fiches peuvent aussi vous intéresser")}
              </h2>
              <div className={styles.results} id="resultats-suggestions-liste">
                {props.noResultsSuggestions.map((d) => (
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
              {remainingItems > 0 &&
                ` ${t("Recherche.resultsOn", { count: props.totalResultsCount })}`}
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
        {showSuggestions && suggestions.length > 0 && (
          <div style={{ width: "100%" }}>
            <h2 className={styles.no_results_other} id="resultats-suggestions">
              {t("Recherche.suggestedTitle", "Ces fiches peuvent aussi vous intéresser")}
            </h2>
            <div className={styles.results} id="resultats-suggestions-liste">
              {suggestions.map((d) => (
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
