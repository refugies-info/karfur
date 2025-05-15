import { isValidObjectId } from "mongoose";
import { NotFoundError } from "~/errors";

export function validateId(id: string, entityName?: string): void {
  if (!isValidObjectId(id)) {
    throw new NotFoundError(`Invalid ${entityName ? entityName + " " : ""}ID`);
  }
}
