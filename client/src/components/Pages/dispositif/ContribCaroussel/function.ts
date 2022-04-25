import isInBrowser from "lib/isInBrowser";
import uniqBy from "lodash/uniqBy";

export const reduceContributors = (contributors: any[]) => {
  const nbCards = isInBrowser() ? Math.floor(
    (((window.innerWidth - 2 * 10) * 7) / 12 - 2 * (15 + 20)) / (140 + 20)
  ) : 1;

  // there may be duplicates in db in Dispositif.participants
  const deduplicatedContributors = uniqBy(contributors, "username");

  // reducedContributors is an array of multiple arrays containing maximum nbCards contributeurs
  const reducedContributors = (deduplicatedContributors || []).reduce(
    (acc, curr, i) => {
      if (
        i > 0 &&
        i % nbCards === 0 &&
        i !== deduplicatedContributors.length - 1
      ) {
        return {
          currGrp: [curr],
          groupedData: [...acc.groupedData, acc.currGrp],
        };
      } else if (
        i % nbCards !== 0 &&
        i === deduplicatedContributors.length - 1
      ) {
        return {
          groupedData: [...acc.groupedData, [...acc.currGrp, curr]],
          currGrp: [],
        };
      } else if (
        i % nbCards === 0 &&
        i === deduplicatedContributors.length - 1
      ) {
        return {
          groupedData: [...acc.groupedData, ...acc.currGrp, [curr]],
          currGrp: [],
        };
      }
      return {
        currGrp: [...acc.currGrp, curr],
        groupedData: acc.groupedData,
      };
    },
    { currGrp: [], groupedData: [] }
  ).groupedData;

  return reducedContributors;
}
