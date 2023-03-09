import { Dispositif, DispositifId } from "../typegoose";

export const getDispositifDepartments = (dispositif: Dispositif & Required<{ _id: DispositifId }>) =>
  dispositif.metadatas.location || [];
