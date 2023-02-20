import API from "utils/API";
import { GetDispositifResponse } from "api-types";

export const updateNbViews = (dispositif: GetDispositifResponse) => {
  if (dispositif.status === "Actif") {
    return API.addDispositifViews(dispositif._id.toString(), { types: ["web"] });
  }
  return null;
}

