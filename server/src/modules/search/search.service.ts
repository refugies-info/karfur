import { AlgoliaObject } from "../../types/interface";
import {
  addAlgoliaObjects,
  deleteAlgoliaObjects,
  updateAlgoliaObjects
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
  if (contentsAdded.length) await addAlgoliaObjects(contentsAdded);

  // DELETE
  const deleted = algoliaIds.filter(x => !localIds.includes(x));
  if (deleted.length) await deleteAlgoliaObjects(deleted);

  // UPDATE
  let objectsToUpdate: AlgoliaObject[] = [];
  for (const content of localContents) {
    const algoliaContent = algoliaContents.find(c => c.objectID.toString() === content.objectID.toString());
    if (!algoliaContent) continue;
    const objectDiff = getDiffAlgoliaObject(content, algoliaContent);
    if (objectDiff) objectsToUpdate.push(objectDiff)
  }
  if (objectsToUpdate.length) await updateAlgoliaObjects(objectsToUpdate);

  return {
    added: contentsAdded.length,
    deleted: deleted.length,
    updated: objectsToUpdate.length
  }
}
