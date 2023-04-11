import API from "utils/API";
import { GetDispositifResponse, ViewsType } from "api-types";

export const updateNbViews = (dispositif: GetDispositifResponse) => {
  if (dispositif.status === "Actif") {
    return API.addDispositifViews(dispositif._id.toString(), { types: [ViewsType.WEB] });
  }
  return null;
}

