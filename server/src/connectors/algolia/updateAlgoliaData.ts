import logger from "../../logger";
import { AlgoliaObject } from "../../types/interface";

const algoliasearch = require("algoliasearch");
const client = algoliasearch("L9HYT1676M", "b14b1dd48cb3299fbc01c3dea0350d09");
const index = client.initIndex("staging_refugies");

export const getAllAlgoliaObjects = async (): Promise<AlgoliaObject[]> => {
  let algoliaContents: AlgoliaObject[] = [];

  await index.browseObjects({
    query: "", // Empty query will match all records
    batch: (batch: any) => {
      algoliaContents = algoliaContents.concat(batch);
    }
  });

  return algoliaContents;
}

export const addAlgoliaObjects = async (objects: AlgoliaObject[]) => {
  logger.info(`[algolia] adding ${objects.length} contents`);
  return index.saveObjects(objects);
}

export const deleteAlgoliaObjects = async (objectsID: string[]) => {
  logger.info(`[algolia] deleting ${objectsID.length} contents`);
  return index.deleteObjects(objectsID);
}

export const updateAlgoliaObjects = async (objects: AlgoliaObject[]) => {
  logger.info(`[algolia] updating ${objects.length} content`);
  return index.partialUpdateObjects(objects);
}
