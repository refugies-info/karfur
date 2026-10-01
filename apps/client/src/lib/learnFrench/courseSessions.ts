import type { Session, SimpleDispositif } from "@refugies-info/api-types";

export const getNextUpcomingSession = (dispositif: SimpleDispositif): Session | undefined => {
  const items = dispositif.metadatas?.sessions?.items;
  if (!items || items.length === 0) return undefined;

  const startOfToday = new Date();
  startOfToday.setHours(0, 0, 0, 0);
  return items
    .filter((session) => new Date(session.startDate).getTime() >= startOfToday.getTime())
    .sort((a, b) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime())[0];
};
