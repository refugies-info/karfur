import { ObjectId } from "@refugies-info/mongo";
import uniq from "lodash/uniq";

/**
 * Type for values that can be converted to ObjectId
 */
type ObjectIdLike = ObjectId | string | { _id: ObjectId | string };

/**
 * Safely extracts an ObjectId string from various input types
 */
function toObjectIdString(value: ObjectIdLike): string {
  if (typeof value === "string") {
    return value;
  }
  if (value instanceof ObjectId) {
    return value.toString();
  }
  // Object with _id property
  return value._id.toString();
}

/**
 * Creates a duplicate-free version of an array of ObjectId-like values
 * @param arrayOfObjectIds - Array of ObjectIds, strings, or objects with _id property
 * @returns Array of unique ObjectIds
 */
export const uniqIds = (arrayOfObjectIds: ObjectIdLike[]): ObjectId[] =>
  uniq(arrayOfObjectIds.map(toObjectIdString)).map((x) => new ObjectId(x));
