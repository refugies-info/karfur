import { DispositifStatus } from "api-types";
import { isStatus } from "lib/dispositif";
import { help } from "./data";

export const getTextContent = (status: DispositifStatus | null) => {
  if (isStatus(status, DispositifStatus.ACTIVE)) return help.published;
  if (isStatus(status, [DispositifStatus.WAITING_ADMIN, DispositifStatus.WAITING_STRUCTURE]))
    return help.waiting;
  return help.draft;
}
