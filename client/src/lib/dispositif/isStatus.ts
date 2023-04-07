import { DispositifStatus } from "api-types";

export const isStatus = (dispositifStatus: DispositifStatus | undefined | null, status: DispositifStatus | DispositifStatus[]) => {
  if (!dispositifStatus) return false;
  if (Array.isArray(status)) {
    for (const s of status) {
      if (dispositifStatus === s) return true
    }
  } else {
    if (status === dispositifStatus) return true;
  }
  return false;
}
