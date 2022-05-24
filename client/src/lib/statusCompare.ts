import { ContentStatus, StructureStatus, UserStatus } from "types/interface";

type Status = StructureStatus | UserStatus | ContentStatus;
export const statusCompare = (a: Status, b: Status ) => {
  const orderA = a.order;
  const orderB = b.order;
  return orderA > orderB ? 1 : -1;
};
