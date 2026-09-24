import type { SimpleDispositif } from "@refugies-info/api-types";
import { frenchLevelOptionKeys, frenchLevelValuesByOption } from "data/searchFilters";
import Link from "next/link";
import { type TFunction, useTranslation } from "next-i18next";
import { forwardRef } from "react";
import Image from "~/components/UI/Image";
import { LOCATION_FRANCE, LOCATION_ONLINE } from "~/data/learnFrench";
import { useSanitizedContent } from "~/hooks";
import useLocale from "~/hooks/useLocale";
import { jsUcfirst } from "~/lib";
import { getCommitmentText, getFrequencyText, getPriceText } from "~/lib/dispositif";
import { getNextUpcomingSession } from "~/lib/learnFrench/courseSessions";
import { getFrenchLevelOptionLabel } from "~/lib/learnFrench/frenchLevelLabels";
import { getPath } from "~/routes";
import { SingleLineTags } from "./SingleLineTags";

interface Props {
  dispositif: SimpleDispositif;
  needLabels: Map<string, string>;
}

const CONTACT_BUTTON_CLASSNAME =
  "border-action-high-blue-france text-title-blue-france relative z-10 inline-flex min-h-11 items-center gap-2 border bg-white px-3 text-sm font-medium whitespace-nowrap";

const getDepartmentBadge = (dispositif: SimpleDispositif): string | null => {
  const location = dispositif.metadatas?.location;
  const first = Array.isArray(location) ? location[0] : location;
  if (!first || first === LOCATION_FRANCE || first === LOCATION_ONLINE) return null;
  return first.split(" - ")[1] ?? first;
};

const isOnlineCourse = (dispositif: SimpleDispositif): boolean => {
  const location = dispositif.metadatas?.location;
  return !Array.isArray(location) && location === LOCATION_ONLINE;
};

const isFranceWideCourse = (dispositif: SimpleDispositif): boolean => {
  const location = dispositif.metadatas?.location;
  return !Array.isArray(location) && location === LOCATION_FRANCE;
};

const getFrenchLevelLabels = (dispositif: SimpleDispositif, t: TFunction): string[] => {
  const levels = dispositif.metadatas?.frenchLevel ?? [];
  const labels: string[] = [];
  for (const option of frenchLevelOptionKeys) {
    const optionLevels = frenchLevelValuesByOption[option];
    if (!optionLevels.some((level) => levels.includes(level))) continue;
    labels.push(getFrenchLevelOptionLabel(option, t));
  }
  return labels;
};

export const CourseCard = forwardRef<HTMLAnchorElement, Props>((props, ref) => {
  const { t } = useTranslation();
  const locale = useLocale();
  const title = useSanitizedContent(props.dispositif.titreInformatif);
  const description = useSanitizedContent(props.dispositif.abstract);

  const nextSession = getNextUpcomingSession(props.dispositif);
  const sessionDate = nextSession ? new Date(nextSession.startDate) : null;
  const departmentBadge = getDepartmentBadge(props.dispositif);
  const isOnline = isOnlineCourse(props.dispositif);
  const isFranceWide = isFranceWideCourse(props.dispositif);
  const needTags = (props.dispositif.needs ?? [])
    .map((needId) => props.needLabels.get(String(needId)))
    .filter((label): label is string => Boolean(label));
  const tags = [...getFrenchLevelLabels(props.dispositif, t), ...needTags];

  const commitment = getCommitmentText(props.dispositif.metadatas?.commitment, t);
  const frequency = getFrequencyText(props.dispositif.metadatas?.frequency, t);
  const price = getPriceText(props.dispositif.metadatas?.price, t);

  const sponsor = props.dispositif.sponsor;
  const sponsorLogo = sponsor?.picture?.secure_url;
  const showContactActions = !sessionDate && (sponsor?.phone || sponsor?.email);

  const href = {
    pathname: getPath(`/${props.dispositif.typeContenu}/[id]`, locale),
    query: { id: String(props.dispositif._id) },
  };

  return (
    <div className="border-default-grey hover:bg-alt-blue-france relative flex flex-col items-stretch border bg-white md:flex-row">
      {nextSession && (
        <span
          aria-hidden="true"
          className="bg-action-high-blue-france absolute inset-y-0 left-0 w-1 md:hidden"
        />
      )}
      <div
        className={`border-default-grey flex flex-col gap-1 border-b px-4 py-5 md:w-[170px] md:shrink-0 md:border-b-0 md:px-6 md:py-8 ${
          nextSession ? "md:border-action-high-blue-france md:border-l-4" : ""
        }`}
      >
        <div className="flex items-start justify-between gap-3">
          {isOnline ? (
            <span className="bg-contrast-info text-default-info flex w-fit items-center gap-1 rounded px-1.5 py-1 text-xs font-bold whitespace-nowrap uppercase">
              {t("Recherche.online", "En ligne")}
            </span>
          ) : isFranceWide ? (
            <span className="bg-contrast-purple-glycine text-label-purple-glycine w-fit rounded px-1.5 py-1 text-xs font-bold whitespace-nowrap uppercase">
              {jsUcfirst(t("Recherche.france", "toute la France"))}
            </span>
          ) : (
            departmentBadge && (
              <span className="bg-contrast-purple-glycine text-label-purple-glycine w-fit rounded px-1.5 py-1 text-xs font-bold whitespace-nowrap uppercase">
                {departmentBadge}
              </span>
            )
          )}
          {!sessionDate && sponsorLogo && (
            <Image
              className="h-10 w-10 shrink-0 object-contain md:hidden"
              src={sponsorLogo}
              alt=""
              width={40}
              height={40}
            />
          )}
        </div>
        {sessionDate ? (
          <div className="text-title-blue-france">
            <p className="text-h1 leading-none font-bold">
              {sessionDate.toLocaleDateString(locale, { day: "numeric" })}
            </p>
            <p className="text-base font-bold capitalize">
              {sessionDate.toLocaleDateString(locale, { month: "long" })}
            </p>
            <p className="text-base">
              {sessionDate.toLocaleDateString(locale, { year: "numeric" })}
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
        {showContactActions && (
          <div className="mt-3 flex flex-wrap gap-2 md:hidden">
            {sponsor?.phone && (
              <a href={`tel:${sponsor.phone}`} className={CONTACT_BUTTON_CLASSNAME}>
                <i className="fr-icon-phone-line fr-icon--sm" aria-hidden="true" />
                {t("LearnFrench.card_call", "Appeler")}
              </a>
            )}
            {sponsor?.email && (
              <a href={`mailto:${sponsor.email}`} className={CONTACT_BUTTON_CLASSNAME}>
                <i className="fr-icon-mail-line fr-icon--sm" aria-hidden="true" />
                {t("LearnFrench.card_sendMail", "Envoyer un mail")}
              </a>
            )}
          </div>
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-4 p-4 md:p-8">
        <SingleLineTags tags={tags} />

        <div className="flex flex-col gap-3">
          <h3 className="text-title-grey text-h5 mb-0 font-bold">
            <Link
              ref={ref}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-title-grey bg-none after:absolute after:inset-0 after:m-0 after:h-full after:w-full after:bg-transparent after:[-webkit-mask-image:none] after:[mask-image:none] focus-visible:outline-none focus-visible:after:outline-2 focus-visible:after:outline-[#0a76f6]"
              dangerouslySetInnerHTML={{ __html: title }}
            />
          </h3>
          {sponsor?.nom && (
            <div className="text-mention-grey flex items-center gap-2 text-xs">
              <i className="fr-icon-building-line fr-icon--sm" aria-hidden="true" />
              {sponsor.nom}
            </div>
          )}
          <p
            className="text-default-grey line-clamp-2 text-sm md:line-clamp-1"
            dangerouslySetInnerHTML={{ __html: description }}
          />
        </div>

        <div className="flex items-end justify-between gap-4 pt-2 md:items-center">
          <div className="text-mention-grey flex flex-col gap-2 text-xs md:flex-row md:flex-wrap md:items-center md:gap-4">
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
    </div>
  );
});

CourseCard.displayName = "CourseCard";
