import API from "utils/API";
import { DispositifStatus, GetDispositifResponse, ViewsType } from "@refugies-info/api-types";

export const updateNbViews = (dispositif: GetDispositifResponse) => {
  if (dispositif.status === DispositifStatus.ACTIVE) {
    return API.addDispositifViews(dispositif._id.toString(), { types: [ViewsType.WEB] });
  }
  return null;
}

