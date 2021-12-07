export const getDiffAlgoliaObject = (
  localObject: any,
  algoliaObject: any
) => {
  let objectToUpdate: any = { objectID: localObject.objectID };
  const keys = Object.keys(localObject);

  for (let key of keys) {
    if (key === "objectID") continue;

    else if (Array.isArray(localObject[key])) {
      let diff = localObject[key]
        .filter((x: any) => !!x)
        .filter((x: any) => !algoliaObject[key].includes(x.toString()))
        .concat(algoliaObject[key]
          .filter((x: any) => !!x)
          .filter((x: any) => !localObject[key].includes(x.toString()))
        );
      if (diff.length > 0) objectToUpdate[key] = localObject[key];

    } else if (localObject[key] !== algoliaObject[key]) {
      objectToUpdate[key] = localObject[key];
    }
  }

  return (Object.keys(objectToUpdate).length > 1) // at least 1 property different
    ? objectToUpdate // return object
    : null; // else, return null
}
