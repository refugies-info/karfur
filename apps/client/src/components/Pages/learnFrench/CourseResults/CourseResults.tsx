import Button from "@codegouvfr/react-dsfr/Button";
import type { SimpleDispositif } from "@refugies-info/api-types";
import { useTranslation } from "next-i18next";
import { CourseCard } from "./CourseCard";
import { ShareResultsButtons } from "./ShareResultsButtons";

interface Props {
  results: SimpleDispositif[];
  total: number;
  loading: boolean;
  loadingMore: boolean;
  hasMore: boolean;
  onLoadMore: () => void;
  onResetFilters: () => void;
  needLabels: Map<string, string>;
}

export const CourseResults = (props: Props) => {
  const { t } = useTranslation();

  if (props.loading) {
    return <p className="text-default-grey">{t("Recherche.loading", "Chargement...")}</p>;
  }

  if (props.results.length === 0) {
    return (
      <div className="flex flex-col items-start gap-4">
        <div>
          <h2 className="mb-2">
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
          onClick={props.onResetFilters}
          iconId="fr-icon-refresh-line"
          iconPosition="right"
        >
          {t("Recherche.resetFilters", "Effacer les filtres")}
        </Button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <p className="mb-0 font-bold">{t("Recherche.yourResults", { count: props.total })}</p>
        <ShareResultsButtons />
      </div>

      <div className="flex flex-col gap-4">
        {props.results.map((dispositif) => (
          <CourseCard
            key={String(dispositif._id)}
            dispositif={dispositif}
            needLabels={props.needLabels}
          />
        ))}
      </div>

      {props.hasMore && (
        <div className="flex justify-center">
          <Button onClick={props.onLoadMore} disabled={props.loadingMore}>
            {props.loadingMore
              ? t("Recherche.loading", "Chargement...")
              : t("LearnFrench.results_loadMore", "Afficher plus de résultats")}
          </Button>
        </div>
      )}
    </div>
  );
};
