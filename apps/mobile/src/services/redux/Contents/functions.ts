import { GetContentsForAppResponse } from "@refugies-info/api-types";

export const groupResultsByNeed = (contents: GetContentsForAppResponse["dataFr"]) => {
  let results: Record<string, string[]> = {};
  if (contents && contents.length > 0) {
    contents.map((content) => {
      if (content.needs && content.needs.length > 0) {
        content.needs.forEach((needId) => {
          if (results[needId.toString()]) {
            results[needId.toString()].push(content._id);
            return;
          }
          results[needId.toString()] = [content._id];
          return;
        });
        return;
      }
    });
  }
  return results;
};
