import type { Session, SimpleDispositif } from "@refugies-info/api-types";

export const getNextUpcomingSession = (dispositif: SimpleDispositif): Session | undefined => {
  const items = dispositif.metadatas?.sessions?.items;
  if (!items || items.length === 0) return undefined;

  const now = Date.now();
  return items
    .filter((session) => new Date(session.startDate).getTime() > now)
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
};
