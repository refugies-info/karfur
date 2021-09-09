import { SimplifiedContent } from "../../../types/interface";

export const groupResultsByNeed = (contents: SimplifiedContent[]) => {
  let results = {};
  if (contents && contents.length > 0) {
    contents.forEach((content) => {
      if (content.needs && content.needs.length > 0) {
        content.needs.forEach((needId) => {
          if (results[needId]) {
            results[needId].push(content._id);
            return;
          }
          results[needId] = [content._id];
          return;
        });
        return;
      }
    });
  }
  console.log("results", results);
  return results;
};
