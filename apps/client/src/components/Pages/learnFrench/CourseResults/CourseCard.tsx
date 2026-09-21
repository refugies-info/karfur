import type { SimpleDispositif } from "@refugies-info/api-types";
import Link from "next/link";
import { useTranslation } from "next-i18next";
import { forwardRef } from "react";
import { useSanitizedContent } from "~/hooks";
import useLocale from "~/hooks/useLocale";
import { getCommitmentText, getFrequencyText, getPriceText } from "~/lib/dispositif";
import { getNextUpcomingSession } from "~/lib/learnFrench/courseSessions";
import { getPath } from "~/routes";

interface Props {
  dispositif: SimpleDispositif;
  needLabels: Map<string, string>;
}

const getDepartmentBadge = (dispositif: SimpleDispositif): string | null => {
  const location = dispositif.metadatas?.location;
  const first = Array.isArray(location) ? location[0] : location;
  if (!first || first === "france" || first === "online") return null;
  return first.split(" - ")[1] ?? first;
};

export const CourseCard = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const title = useSanitizedContent(props.dispositif.titreInformatif);
  const description = useSanitizedContent(props.dispositif.abstract);

  const nextSession = getNextUpcomingSession(props.dispositif);
  const departmentBadge = getDepartmentBadge(props.dispositif);
  const tags = (props.dispositif.needs ?? [])
    .map((needId) => props.needLabels.get(String(needId)))
    .filter((label): label is string => Boolean(label));

  const commitment = getCommitmentText(props.dispositif.metadatas?.commitment, t);
  const frequency = getFrequencyText(props.dispositif.metadatas?.frequency, t);
  const price = getPriceText(props.dispositif.metadatas?.price, t);

  const href = {
    pathname: getPath(`/${props.dispositif.typeContenu}/[id]`, locale),
    query: { id: String(props.dispositif._id) },
  };

  return (
    <Link
      ref={ref}
      href={href}
      className="border-default-grey hover:bg-alt-blue-france flex items-stretch border bg-white"
    >
      <div
        className={`flex w-[170px] shrink-0 flex-col gap-1 px-6 py-8 ${
          nextSession ? "border-action-high-blue-france border-l-4" : ""
        }`}
      >
        {departmentBadge && (
          <span className="bg-contrast-purple-glycine text-label-purple-glycine w-fit rounded px-1.5 py-1 text-xs font-bold whitespace-nowrap uppercase">
            {departmentBadge}
          </span>
        )}
        {nextSession ? (
          <div className="text-title-blue-france">
            <p className="text-h1 leading-none font-bold">
              {new Date(nextSession.startDate).toLocaleDateString(locale, { day: "numeric" })}
            </p>
            <p className="text-base font-bold capitalize">
              {new Date(nextSession.startDate).toLocaleDateString(locale, { month: "long" })}
            </p>
            <p className="text-base">
              {new Date(nextSession.startDate).toLocaleDateString(locale, { year: "numeric" })}
            </p>
          </div>
        ) : (
          <p className="text-mention-grey text-base font-medium">
            {t(
              "LearnFrench.card_contactStructure",
              "Contacter la structure pour les prochaines dates",
            )}
          </p>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-8">
        {tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {tags.map((tag) => (
              <span
                key={tag}
                className="bg-action-low-blue-france text-title-grey rounded-full px-3 py-1 text-sm"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-col gap-3">
          <h3
            className="text-title-grey text-h5 mb-0 font-bold"
            dangerouslySetInnerHTML={{ __html: title }}
          />
          {props.dispositif.sponsor?.nom && (
            <div className="text-mention-grey flex items-center gap-2 text-xs">
              <i className="fr-icon-building-line fr-icon--sm" aria-hidden="true" />
              {props.dispositif.sponsor.nom}
            </div>
          )}
          <p
            className="text-default-grey line-clamp-1 text-sm"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <div className="flex items-center justify-between pt-2">
          <div className="text-mention-grey flex flex-wrap items-center gap-4 text-xs">
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
          <i
            className="fr-icon-arrow-right-line text-title-blue-france shrink-0"
            aria-hidden="true"
          />
        </div>
      </div>
    </Link>
  );
});

CourseCard.displayName = "CourseCard";
