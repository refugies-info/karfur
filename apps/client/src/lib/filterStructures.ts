import { GetActiveStructuresResponse } from "@refugies-info/api-types";

export const filterStructuresByType = (arrayTofilter: GetActiveStructuresResponse[], typeSelected: string[]) => {
  if (!typeSelected || typeSelected.length === 0) {
    return arrayTofilter;
  }
  return arrayTofilter.filter((structure) => {
    let hasType: boolean = false;

    typeSelected.forEach((type) => {
      if (structure.structureTypes && structure.structureTypes.includes(type)) {
        hasType = true;
      }
    });

    return hasType;
  });
};

export const filterStructuresByKeword = (arrayTofilter: GetActiveStructuresResponse[], keyword: string) => {
  let newArrayKeyword: GetActiveStructuresResponse[] = [];
  if (keyword.length > 0) {
    if (arrayTofilter) {
      arrayTofilter.forEach((structure) => {
        if (
          (structure.nom.toLowerCase().includes(keyword.toLowerCase()) ||
            (structure.acronyme && structure.acronyme.toLowerCase().includes(keyword.toLowerCase()))) &&
          newArrayKeyword &&
          !newArrayKeyword.includes(structure)
        ) {
          newArrayKeyword.push(structure);
        }
      });
    }
  } else {
    newArrayKeyword = arrayTofilter;
  }
  return newArrayKeyword;
};

export const filterStructuresByLoc = (
  arrayTofilter: GetActiveStructuresResponse[],
  isCitySelected: boolean,
  depNumber: string,
  depName: string,
) => {
  let newArrayLoc: GetActiveStructuresResponse[] = [];
  if (isCitySelected) {
    if (arrayTofilter) {
      arrayTofilter.forEach((structure) => {
        if (
          structure.disposAssociesLocalisation?.includes("All") ||
          (structure.departments?.includes("All") && newArrayLoc)
        ) {
          newArrayLoc.push(structure);
        } else {
          if (depNumber && structure.disposAssociesLocalisation) {
            structure.disposAssociesLocalisation.forEach((el) => {
              if (el.substr(0, 2) === depNumber && newArrayLoc && !newArrayLoc.includes(structure)) {
                newArrayLoc.push(structure);
              }
            });
            if (structure.departments) {
              structure.departments.forEach((el) => {
                if (el.substr(0, 2) === depNumber && newArrayLoc && !newArrayLoc.includes(structure)) {
                  newArrayLoc.push(structure);
                }
              });
            }
          } else if (depName && structure.disposAssociesLocalisation) {
            structure.disposAssociesLocalisation.forEach((el) => {
              if (el.includes(depName) && newArrayLoc && !newArrayLoc.includes(structure)) {
                newArrayLoc.push(structure);
              }
            });
            if (structure.departments) {
              structure.departments.forEach((el) => {
                if (el.includes(depName) && newArrayLoc && !newArrayLoc.includes(structure)) {
                  newArrayLoc.push(structure);
                }
              });
            }
          }
        }
      });
    }
  } else {
    newArrayLoc = arrayTofilter;
  }
  return newArrayLoc;
};
