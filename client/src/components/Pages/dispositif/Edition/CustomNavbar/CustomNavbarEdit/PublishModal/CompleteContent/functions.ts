import { DispositifStatus } from "api-types";
import { isStatus } from "lib/dispositif";
import { help } from "./data";

export const getTextContent = (status: DispositifStatus | null, hasDraftVersion: boolean, hasChanges?: boolean) => {
  if (hasDraftVersion) {
    if (hasChanges === undefined) return [{ title: "", intro: "" }]
    if (hasChanges === false) return help.nochange;
    return help.published;
  }
  if (isStatus(status, [DispositifStatus.WAITING_ADMIN, DispositifStatus.WAITING_STRUCTURE]))
    return help.waiting;
  return help.draft;
}
