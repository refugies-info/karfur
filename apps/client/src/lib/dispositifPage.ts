import { DispositifStatus, GetDispositifResponse, ViewsType } from "@refugies-info/api-types";
import API from "~/utils/API";

export const updateNbViews = (dispositif: GetDispositifResponse) => {
  if (dispositif.status === DispositifStatus.ACTIVE) {
    return API.addDispositifViews(dispositif._id.toString(), { types: [ViewsType.WEB] });
  }
  return null;
};
