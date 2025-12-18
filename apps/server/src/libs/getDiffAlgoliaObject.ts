import type { AlgoliaObject } from "~/types/interface";

export const getDiffAlgoliaObject = (localObject: AlgoliaObject, algoliaObject: AlgoliaObject) => {
  const objectToUpdate: Partial<AlgoliaObject> = { objectID: localObject.objectID };
  const keys = Object.keys(localObject);

  for (const key of keys) {
    if (key === "objectID") continue;
    else if (Array.isArray(localObject[key])) {
      const diff = localObject[key]
        .filter((x) => !!x)
        .filter(
          (x) => !algoliaObject[key] || !(algoliaObject[key] as string[]).includes(x.toString()),
        )
        .concat(
          ((algoliaObject[key] as string[]) || [])
            .filter((x) => !!x)
            .filter((x) => !((localObject[key] as string[]) || []).includes(x.toString())),
        );
      if (diff.length > 0) objectToUpdate[key] = localObject[key];
    } else if (localObject[key] !== algoliaObject[key]) {
      objectToUpdate[key] = localObject[key];
    }
  }

  return Object.keys(objectToUpdate).length > 1 // at least 1 property different
    ? objectToUpdate // return object
    : null; // else, return null
};
