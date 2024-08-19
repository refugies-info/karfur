import { Ref } from "@typegoose/typegoose";
import uniq from "lodash/uniq";
import { ObjectId } from "../typegoose";

/**
 * Creates a duplicate-free version of an array of ObjectId
 * @param arrayOfObjectIds
 * @returns ObjectId[]
 */
export const uniqIds = (arrayOfObjectIds: Ref<any, ObjectId>[]): ObjectId[] => uniq(arrayOfObjectIds.map((x) => x.toString())).map(x => new ObjectId(x));
