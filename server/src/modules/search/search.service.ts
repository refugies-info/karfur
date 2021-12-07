import { AlgoliaObject } from "../../types/interface";
import {
  addAlgoliaObjects,
  deleteAlgoliaObjects,
  updateAlgoliaObject
} from "../../connectors/algolia/updateAlgoliaData";
import { getDiffAlgoliaObject } from "../../libs/getDiffAlgoliaObject";

export const updateAlgoliaIndex = async (
  localContents: AlgoliaObject[],
  algoliaContents: AlgoliaObject[]
) => {

  const localIds = localContents.map(c => c.objectID.toString());
  const algoliaIds = algoliaContents.map(c => c.objectID.toString());
  // ADD
  const added = localIds.filter(x => !algoliaIds.includes(x));
  const contentsAdded = added.map(id => localContents.find(c => c.objectID.toString() === id));
  await addAlgoliaObjects(contentsAdded);

  // DELETE
  const deleted = algoliaIds.filter(x => !localIds.includes(x));
  await deleteAlgoliaObjects(deleted);

  // UPDATE
  let countUpdated = 0;
  for (const content of localContents) {
    const algoliaContent = algoliaContents.find(c => c.objectID.toString() === content.objectID.toString());
    if (!algoliaContent) continue;
    const objectToUpdate = getDiffAlgoliaObject(content, algoliaContent);
    if (objectToUpdate) {
      await updateAlgoliaObject(objectToUpdate);
      countUpdated += 1;
    }
  }

  return {
    added: contentsAdded.length,
    deleted: deleted.length,
    updated: countUpdated
  }
}
