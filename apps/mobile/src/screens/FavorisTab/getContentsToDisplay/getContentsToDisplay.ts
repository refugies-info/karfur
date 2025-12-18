import type { ContentForApp, GetDispositifResponse, Languages } from "@refugies-info/api-types";
import { getContentById } from "~/utils/API";

/**
 * Return the contents to display
 * @param contentsId - content ids to display
 * @param contents - list of all the content
 * @param currentLanguageI18nCode - language code
 * // TODO test
 */
const getContentsToDisplay = async (
  contentsId: string[],
  contents: ContentForApp[],
  currentLanguageI18nCode: Languages | null,
) => {
  const result: ContentForApp[] = [];
  for (const contentId of contentsId) {
    const contentWithInfosArray = contents.filter((content) => content._id === contentId);
    if (contentWithInfosArray.length > 0) {
      // result already in store
      result.push(contentWithInfosArray[0]);
    } else {
      // fetch result
      await getContentById({
        contentId: String(contentId),
        locale: currentLanguageI18nCode || "fr",
      }).then((response: GetDispositifResponse) => {
        // @ts-expect-error response.data.data is not typed
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
