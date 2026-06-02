import type { Avis } from "@refugies-info/mongo";

export const cleanupAvis = (avis: Avis) => {
  if (avis.userId == null) delete avis.userId;
  if (avis.anonymousUserId == null) delete avis.anonymousUserId;
  return avis;
};
