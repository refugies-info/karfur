import { ObjectId } from "mongoose";
import _ from "lodash";

// we have to convert objectId to string to compare it with other strings
export const deduplicateArrayOfObjectIds = (arrayOfObjectIds: ObjectId[]) =>
  _.uniq(arrayOfObjectIds.map((x) => x.toString()));
