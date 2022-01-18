export const updateObject = (oldObject: object, updatedValues: object) => {
  return {
    ...oldObject,
    ...updatedValues,
  };
};
