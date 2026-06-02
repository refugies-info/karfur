import type { Avis } from "@refugies-info/mongo";

export const cleanupAvis = (avis: Avis): Avis => {
  const cleaned = { ...avis };
  if (cleaned.userId == null) delete cleaned.userId;
  if (cleaned.anonymousUserId == null) delete cleaned.anonymousUserId;
  return cleaned;
};
