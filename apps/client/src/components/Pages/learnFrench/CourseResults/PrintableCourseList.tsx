import type { SimpleDispositif } from "@refugies-info/api-types";
import { frenchLevelFilter } from "data/searchFilters";
import { useTranslation } from "next-i18next";
import type { FiltersState } from "~/components/Pages/learnFrench/FiltersSidebar";
import Image from "~/components/UI/Image";
import { useSanitizedContent } from "~/hooks";
import useLocale from "~/hooks/useLocale";
import { getCommitmentText, getFrequencyText, getPriceText } from "~/lib/dispositif";
import { getNextUpcomingSession } from "~/lib/learnFrench/courseSessions";

interface RowProps {
  dispositif: SimpleDispositif;
  needLabels: Map<string, string>;
}

const PrintableCourseRow = (props: RowProps) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const title = useSanitizedContent(props.dispositif.titreInformatif);
  const description = useSanitizedContent(props.dispositif.abstract);

  const nextSession = getNextUpcomingSession(props.dispositif);
  const sessionDate = nextSession ? new Date(nextSession.startDate) : null;
  const sessionEndDate = nextSession ? new Date(nextSession.endDate) : null;
  const tags = (props.dispositif.needs ?? [])
    .map((needId) => props.needLabels.get(String(needId)))
    .filter((label): label is string => Boolean(label));

  const until = sessionEndDate
    ? t("LearnFrench.print_until", {
        date: sessionEndDate.toLocaleDateString(locale, {
          day: "numeric",
          month: "long",
          year: "numeric",
        }),
      })
    : null;
  const commitment = getCommitmentText(props.dispositif.metadatas?.commitment, t);
  const frequency = getFrequencyText(props.dispositif.metadatas?.frequency, t);
  const price = getPriceText(props.dispositif.metadatas?.price, t);

  return (
    <div className="border-default-grey flex gap-6 border-b py-6 [break-inside:avoid]">
      <div className="bg-alt-grey w-[180px] shrink-0 rounded p-3 text-xs">
        {props.dispositif.sponsor?.nom && (
          <p className="mb-2 font-bold">{props.dispositif.sponsor.nom}</p>
        )}
        {props.dispositif.sponsor?.address && (
          <p className="mb-2">{props.dispositif.sponsor.address}</p>
        )}
        {props.dispositif.sponsor?.phone && (
          <p className="mb-2">{props.dispositif.sponsor.phone}</p>
        )}
        {props.dispositif.sponsor?.email && (
          <p className="mb-0 break-all">{props.dispositif.sponsor.email}</p>
        )}
      </div>

      <div className="w-[85px] shrink-0">
        {sessionDate ? (
          <div>
            <p className="mb-0 text-h3 leading-none font-bold">
              {sessionDate.toLocaleDateString(locale, { day: "numeric" })}
            </p>
            <p className="mb-0 font-bold capitalize">
              {sessionDate.toLocaleDateString(locale, { month: "long" })}
            </p>
            <p className="mb-0">{sessionDate.toLocaleDateString(locale, { year: "numeric" })}</p>
          </div>
        ) : (
          <p className="text-mention-grey mb-0 text-sm">
            {t("LearnFrench.card_contactStructure", "Contacter la structure")}
          </p>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-3">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-action-low-blue-france text-title-grey rounded-full px-3 py-1 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
        <h3
          className="text-title-grey text-h6 mb-0 font-bold"
          dangerouslySetInnerHTML={{ __html: title }}
        />
        <p
          className="text-default-grey mb-0 line-clamp-2 text-sm"
          dangerouslySetInnerHTML={{ __html: description }}
        />
        <div className="text-mention-grey flex flex-wrap items-center gap-4 text-xs">
          {until && (
            <span className="flex items-center gap-2">
              <i className="fr-icon-calendar-line fr-icon--sm" aria-hidden="true" />
              {until}
            </span>
          )}
          {commitment && (
            <span className="flex items-center gap-2">
              <i className="fr-icon-time-line fr-icon--sm" aria-hidden="true" />
              {commitment}
            </span>
          )}
          {frequency && (
            <span className="flex items-center gap-2">
              <i className="fr-icon-calendar-event-line fr-icon--sm" aria-hidden="true" />
              {frequency}
            </span>
          )}
          {price && (
            <span className="flex items-center gap-2">
              <i className="fr-icon-money-euro-circle-line fr-icon--sm" aria-hidden="true" />
              {price}
            </span>
          )}
        </div>
      </div>
    </div>
  );
};

interface Props {
  results: SimpleDispositif[];
  needLabels: Map<string, string>;
  filters: FiltersState;
}

export const PrintableCourseList = (props: Props) => {
  const { t } = useTranslation();
  const locale = useLocale();

  const locationSummary = [...props.filters.departments, ...props.filters.cities].join(", ");
  const levelSummary = props.filters.frenchLevel
    .map((key) => frenchLevelFilter.find((option) => option.key === key)?.value)
    .filter((value): value is string => Boolean(value))
    .map((value) => t(value, value))
    .join(", ");
  const categorySummary = props.filters.categories
    .map((id) => props.needLabels.get(String(id)))
    .filter((label): label is string => Boolean(label))
    .join(", ");

  const updatedAt = new Date().toLocaleDateString(locale, {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="border-default-grey flex items-center justify-between border-b pb-4">
        <h1 className="text-h3 mb-0 font-bold">{t("LearnFrench.hero_title")}</h1>
        <div className="flex items-center gap-2">
          <Image src="/images/logoRI.svg" alt="" width={32} height={32} priority />
          <span className="text-lg font-bold">{t("Header.serviceName", "Réfugiés.info")}</span>
        </div>
      </div>

      {(locationSummary || levelSummary || categorySummary) && (
        <div className="mt-6 flex flex-col gap-1 text-sm">
          {locationSummary && (
            <p className="mb-0">
              <strong>{t("LearnFrench.filters_location")} : </strong>
              {locationSummary}
            </p>
          )}
          {levelSummary && (
            <p className="mb-0">
              <strong>{t("LearnFrench.filters_level")} : </strong>
              {levelSummary}
            </p>
          )}
          {categorySummary && (
            <p className="mb-0">
              <strong>{t("LearnFrench.filters_category")} : </strong>
              {categorySummary}
            </p>
          )}
        </div>
      )}

      <p className="text-mention-grey mt-6 text-sm italic">
        {t("LearnFrench.print_updatedAt", { date: updatedAt })}
      </p>

      <div className="mt-4 flex flex-col">
        {props.results.map((dispositif) => (
          <PrintableCourseRow
            key={String(dispositif._id)}
            dispositif={dispositif}
            needLabels={props.needLabels}
          />
        ))}
      </div>
    </div>
  );
};
