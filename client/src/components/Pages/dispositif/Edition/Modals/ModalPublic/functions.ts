import { publicStatusType } from "@refugies-info/api-types";

export const includeAllRefugees = (publicStatus: publicStatusType[] | undefined) => {
  return !!(
    publicStatus &&
    publicStatus.includes("asile") &&
    publicStatus.includes("refugie") &&
    publicStatus.includes("subsidiaire") &&
    publicStatus.includes("apatride") &&
    publicStatus.includes("temporaire")
  );
};
