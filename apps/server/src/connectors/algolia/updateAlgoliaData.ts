import { algoliasearch } from "algoliasearch";
import logger from "~/logger";
import type { AlgoliaObject } from "~/types/interface";

const client = algoliasearch("L9HYT1676M", process.env.ALGOLIA_API_KEY);
const indexName = process.env.ALGOLIA_INDEX;

export const getAllAlgoliaObjects = async (): Promise<AlgoliaObject[]> => {
  let algoliaContents: AlgoliaObject[] = [];

  await client.browseObjects<AlgoliaObject>({
    indexName,
    aggregator: (response) => {
      algoliaContents = algoliaContents.concat(response.hits);
    },
    browseParams: {
      query: "", // Empty query will match all records
    },
  });

  return algoliaContents;
};

export const addAlgoliaObjects = async (objects: AlgoliaObject[]) => {
  logger.info(`[algolia] adding ${objects.length} contents`);
  return client.saveObjects({
    indexName,
    objects,
  });
};

export const deleteAlgoliaObjects = async (objectIDs: string[]) => {
  logger.info(`[algolia] deleting ${objectIDs.length} contents`);
  return client.deleteObjects({
    indexName,
    objectIDs,
  });
};

export const updateAlgoliaObjects = async (objects: AlgoliaObject[]) => {
  logger.info(`[algolia] updating ${objects.length} content`);
  return client.partialUpdateObjects({
    indexName,
    objects,
  });
};
