import { SimplifiedContent } from "../../../types/interface";

export const groupResultsByNeed = (contents: SimplifiedContent[]) => {
  let results = {};
  if (contents && contents.length > 0) {
    contents.forEach((content) => {
      if (content.needs && content.needs.length > 0) {
        content.needs.forEach((needId) => {
          // @ts-ignore
          if (results[needId]) {
            // @ts-ignore
            results[needId].push(content._id);
            return;
          }
          // @ts-ignore
          results[needId] = [content._id];
          return;
        });
        return;
      }
    });
  }
  return results;
};
