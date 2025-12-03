import type { Avis } from "~/typegoose/Dispositif";

export const cleanupAvis = (avis: Avis) => {
  if (avis.userId === undefined) delete avis.userId;
  if (avis.anonymousUserId === undefined) delete avis.anonymousUserId;
  return avis;
};
