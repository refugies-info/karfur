import { ContentStatus, StructureAdminStatus, UserStatus } from "types/interface";

type Status = StructureAdminStatus | UserStatus | ContentStatus;
export const statusCompare = (a: Status, b: Status) => {
  const orderA = a.order;
  const orderB = b.order;
  return orderA > orderB ? 1 : -1;
};
