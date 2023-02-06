import { Dispositif, DispositifId } from "src/typegoose";

export const getDispositifDepartments = (dispositif: Dispositif & Required<{ _id: DispositifId }>) =>
  dispositif.metadatas.location || [];
