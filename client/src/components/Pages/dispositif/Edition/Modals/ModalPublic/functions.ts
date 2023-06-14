import { publicStatusType } from "@refugies-info/api-types";
import uniq from "lodash/uniq";

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

export const removeAllRefugeeTypes = (publicStatus: publicStatusType[] | undefined): publicStatusType[] => {
  return !publicStatus ? [] : publicStatus.filter(p => !["asile", "refugie", "subsidiaire", "apatride", "temporaire"].includes(p))
};

export const addAllRefugeeTypes = (publicStatus: publicStatusType[] | undefined): publicStatusType[] => {
  const allStatus: publicStatusType[] = ["asile", "refugie", "subsidiaire", "apatride", "temporaire"];
  return !publicStatus ? allStatus : uniq([...publicStatus, ...allStatus]);
};
