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
  const sessions = dispositif?.metadatas?.sessions;

  // Trier sessions par date de début (croissant)
  const sortedSessions = useMemo(() => {
    if (!sessions || sessions.length === 0) return [];
    return [...sessions].sort(
      (a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime(),
    );
  }, [sessions]);

  // Formatter de date réutilisable (optimisation performance)
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

  // Date actuelle pour comparaison (une seule instance)
  const now = new Date();

  // Ne pas afficher si pas de sessions
  if (!sortedSessions || sortedSessions.length === 0) return null;

  return (
    <MetaDataCard title={t("Dispositif.sessions")} className={className}>
      {sortedSessions.map((session: Session, index: number) => {
        const isPast = new Date(session.endDate) < now;
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
              {isPast && (
                <Badge severity="error" small icon="ri-alert-fill">
                  {t("Dispositif.datePassed")}
                </Badge>
              )}
            </span>
          </MetaDataItem>
        );
      })}
    </MetaDataCard>
  );
};

export default CardSessions;
