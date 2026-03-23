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
  const modalites = sessionsMetadata?.modalitesEntreesSorties;

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

  // Ne pas afficher si ni modalité ni sessions
  if (modalites === undefined && (!sortedSessions || sortedSessions.length === 0)) return null;

  return (
    <MetaDataCard title={t("Dispositif.sessions")} className={className}>
      {modalites !== undefined && modalites !== null && (
        <MetaDataItem className="[&_p]:before:!hidden">
          <span className="font-bold text-xs uppercase tracking-wide">
            {modalites === 0
              ? t("Dispositif.modalitesDatesFixesTitle")
              : t("Dispositif.modalitesPermanentesTitle")}
          </span>
        </MetaDataItem>
      )}
      {sortedSessions.map((session: Session, index: number) => {
        const refDate = modalites === 1 ? session.endDate : session.startDate;
        const isPast = new Date(refDate) < now;
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
