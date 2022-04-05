import { CorrespondingStatus } from "containers/Backend/Admin/AdminContenu/data";
import { StructureStatus } from "containers/Backend/Admin/AdminStructures/data";
import { UserStatus } from "containers/Backend/Admin/AdminUsers/data";

type Status = CorrespondingStatus | StructureStatus | UserStatus;
export const statusCompare = (a: Status, b: Status ) => {
  const orderA = a.order;
  const orderB = b.order;
  return orderA > orderB ? 1 : -1;
};
