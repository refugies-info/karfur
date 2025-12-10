// import type { Ref } from "@typegoose/typegoose";
import uniq from "lodash/uniq";
import { ObjectId } from "~/typegoose";

/**
 * Creates a duplicate-free version of an array of ObjectId
 * @param arrayOfObjectIds
 * @returns ObjectId[]
 */
export const uniqIds = (arrayOfObjectIds: any[]): ObjectId[] =>
  uniq(
    arrayOfObjectIds.map((x) => ((x as any)._id ? (x as any)._id.toString() : x.toString())),
  ).map((x) => new ObjectId(x));
