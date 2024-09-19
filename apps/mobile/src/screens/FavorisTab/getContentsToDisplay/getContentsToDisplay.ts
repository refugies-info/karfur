import { ContentForApp, Languages } from "@refugies-info/api-types";
import { ObjectId } from "~/types/interface";
import { getContentById } from "~/utils/API";

/**
 * Return the contents to display
 * @param contentsId - content ids to display
 * @param contents - list of all the content
 * @param currentLanguageI18nCode - language code
 * // TODO test
 */
const getContentsToDisplay = async (
  contentsId: ObjectId[],
  contents: ContentForApp[],
  currentLanguageI18nCode: Languages | null,
) => {
  let result: ContentForApp[] = [];
  for (let contentId of contentsId) {
    const contentWithInfosArray = contents.filter((content) => content._id === contentId);
    if (contentWithInfosArray.length > 0) {
      // result already in store
      result.push(contentWithInfosArray[0]);
    } else {
      // fetch result
      await getContentById({
        contentId: contentId,
        locale: currentLanguageI18nCode || "fr",
      }).then((response: any) => {
        const data = response?.data?.data;
        if (data) {
          result.push({
            ...data,
            sponsorUrl: data.mainSponsor?.picture?.secure_url,
          });
        }
      });
    }
  }
  return result.reverse();
};

export default getContentsToDisplay;
