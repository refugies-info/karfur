import { frenchLevelType, publicStatusType } from "@refugies-info/api-types";
import uniq from "lodash/uniq";


export const includeAllFrenchLevels = (frenchLevel: frenchLevelType[] | undefined | null) => {
  return !!(
    frenchLevel &&
    frenchLevel.includes("alpha") &&
    frenchLevel.includes("A1") &&
    frenchLevel.includes("A2") &&
    frenchLevel.includes("B1") &&
    frenchLevel.includes("B2") &&
    frenchLevel.includes("C1") &&
    frenchLevel.includes("C2")
  );
};

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
