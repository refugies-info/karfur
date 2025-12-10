import type { Dispositif, DispositifId } from "@refugies-info/mongo";

export const getDispositifDepartments = (
  dispositif: Dispositif & Required<{ _id: DispositifId }>,
) => dispositif.metadatas?.location || [];
