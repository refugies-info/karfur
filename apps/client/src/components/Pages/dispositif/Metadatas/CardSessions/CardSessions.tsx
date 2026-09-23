import type { Session } from "@refugies-info/api-types";
import { MetaDataCard, MetaDataItem } from "@refugies-info/ui";
import { useTranslation } from "next-i18next";
import { useMemo } from "react";
import { useSelector } from "react-redux";
import Badge from "~/components/UI/Badge";
import { selectedDispositifSelector } from "~/services/SelectedDispositif/selectedDispositif.selector";

interface Props {
  className?: string;
}

const CardSessions = ({ className }: Props) => {
  const { t } = useTranslation();
  const dispositif = useSelector(selectedDispositifSelector);
  const sessionsMetadata = dispositif?.metadatas?.sessions;
  const sessions = sessionsMetadata?.items;
  const modalitesEntreesSorties = sessionsMetadata?.modalitesEntreesSorties;

  const upcomingSessions = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];
    const now = Date.now();
    return sessions
      .filter((session: Session) => new Date(session.startDate).getTime() > now)
      .sort(
        (a: Session, b: Session) =>
          new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
      );
  }, [sessions]);

  const locale = t("__locale", { defaultValue: "fr" });
  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale, {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
    [locale],
  );

  if (modalitesEntreesSorties === 1) return null;
  if (upcomingSessions.length === 0) return null;

  return (
    <MetaDataCard title={t("Dispositif.sessions")} className={className}>
      {upcomingSessions.map((session: Session, index: number) => {
        const startDate = dateFormatter.format(new Date(session.startDate));
        const endDate = dateFormatter.format(new Date(session.endDate));

        return (
          <MetaDataItem
            key={session.externalRef || `${session.startDate}-${session.endDate}-${index}`}
            icon="ri-calendar-event-line"
            className="[&_p]:before:!hidden"
          >
            <span className="flex flex-col gap-1">
              <span>
                {t("Dispositif.from")} <span className="whitespace-nowrap">{startDate}</span>{" "}
                <span className="whitespace-nowrap">
                  {t("Dispositif.to")} {endDate}
                </span>
              </span>
              <span>
                <Badge severity="info" small icon="fr-icon-info-fill">
                  {t("Dispositif.sessionStartsSoon")}
                </Badge>
              </span>
            </span>
          </MetaDataItem>
        );
      })}
    </MetaDataCard>
  );
};

export default CardSessions;
