import Button from "@codegouvfr/react-dsfr/Button";
import type { SimpleDispositif } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { useEffect, useRef, useState } from "react";
import TutoImg from "~/assets/dispositif/tutoriel-image.svg";
import { useAnnounce } from "~/components/Accessibility/ScreenReaderAnnouncer";
import Image from "~/components/UI/Image";
import { RESULTS_PER_PAGE } from "~/hooks/learnFrench/useCourseSearch";
import { CourseCard } from "./CourseCard";
import { ShareResultsButtons } from "./ShareResultsButtons";

interface Props {
  results: SimpleDispositif[];
  total: number;
  page: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onResetFilters: () => void;
  onSeeOtherCourses?: () => void;
  needLabels: Map<string, string>;
}

export const CourseResults = (props: Props) => {
  const { t } = useTranslation();
  const announce = useAnnounce();

  const remainingItems = props.total - props.results.length;
  const seeMoreCount = Math.min(remainingItems, RESULTS_PER_PAGE);

  const prevPageRef = useRef(props.page);
  useEffect(() => {
    if (props.page <= prevPageRef.current) {
      prevPageRef.current = props.page;
      return;
    }
    prevPageRef.current = props.page;

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
  }, [props.page, remainingItems, announce, t]);

  const firstNewCardRef = useRef<HTMLAnchorElement | null>(null);
  const [focusIndex, setFocusIndex] = useState<number | null>(null);

  useEffect(() => {
    if (focusIndex === null || props.results.length <= focusIndex) return;
    firstNewCardRef.current?.focus();
    setFocusIndex(null);
  }, [focusIndex, props.results.length]);

  const handleLoadMore = () => {
    setFocusIndex(props.results.length);
    announce(
      t("Recherche.loadingResults", "Chargement de {{count}} résultats...", {
        count: seeMoreCount,
      }),
      { priority: "interrupt", delay: props.page === 1 ? 1000 : 0 },
    );
    props.onLoadMore();
  };

  if (props.loading) {
    return <p className="text-default-grey">{t("Recherche.loading", "Chargement...")}</p>;
  }

  if (props.results.length === 0) {
    const isUpcomingEmpty = Boolean(props.onSeeOtherCourses);

    return (
      <div className="flex flex-col items-center gap-10 py-14">
        <Image src={TutoImg} width={176} height={120} alt="" />
        <div className="text-chapo text-default-grey flex flex-col items-center gap-1.5 text-center">
          <h2 className="text-chapo mb-0 font-bold">
            {isUpcomingEmpty
              ? t(
                  "LearnFrench.results_noUpcomingTitle",
                  "Pas de prochaines dates connues pour le moment",
                )
              : t(
                  "Recherche.noResultTitle",
                  "Oups ! Il n'y a aucun résultat avec vos critères de recherche.",
                )}
          </h2>
          <p className="mb-0">
            {isUpcomingEmpty
              ? t(
                  "LearnFrench.results_noUpcomingText",
                  "mais d’autres cours sont peut-être ouverts près de chez vous.",
                )
              : t(
                  "Recherche.noResultText",
                  "Utilisez moins de filtres ou vérifiez l'orthographe du mot-clé.",
                )}
          </p>
        </div>
        {props.onSeeOtherCourses ? (
          <Button onClick={props.onSeeOtherCourses}>
            {t("LearnFrench.results_seeOtherCourses", "Voir les autres cours")}
          </Button>
        ) : (
          <Button
            priority="tertiary"
            onClick={props.onResetFilters}
            iconId="fr-icon-refresh-line"
            iconPosition="right"
          >
            {t("Recherche.resetFilters", "Effacer les filtres")}
          </Button>
        )}
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="hidden flex-wrap items-center justify-between gap-4 lg:flex">
        <p className="mb-0 font-bold">{t("LearnFrench.results_count", { count: props.total })}</p>
        <ShareResultsButtons />
      </div>

      <div className="flex flex-col gap-4">
        {props.results.map((dispositif, index) => (
          <CourseCard
            key={String(dispositif._id)}
            ref={index === focusIndex ? firstNewCardRef : undefined}
            dispositif={dispositif}
            needLabels={props.needLabels}
          />
        ))}
      </div>

      {props.hasMore && (
        <div className="flex justify-center">
          <Button onClick={handleLoadMore} disabled={props.loadingMore}>
            {props.loadingMore
              ? t("Recherche.loading", "Chargement...")
              : t("LearnFrench.results_loadMore", "Afficher plus de résultats")}
          </Button>
        </div>
      )}
    </div>
  );
};
