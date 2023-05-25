import { GetDispositifResponse, GetTraductionsForReviewResponse, GetUserInfoResponse } from "@refugies-info/api-types";
import API from "utils/API";

/**
 * build a TraductionsForReview object from a dispositif
 */
const buildTranslationsObject = (
  dispositif: GetDispositifResponse,
  user: GetUserInfoResponse | null
): GetTraductionsForReviewResponse => {
  const traductions: GetTraductionsForReviewResponse = [
    {
      author: { id: user?._id?.toString() || "", username: user?.username || "" },
      translated: {
        content: {
          titreInformatif: dispositif.titreInformatif,
          titreMarque: dispositif.titreMarque,
          abstract: dispositif.abstract,
          what: dispositif.what,
          why: dispositif.why,
          how: dispositif.how,
          next: dispositif.next || {},
        }
      },
      toReview: [],
      toFinish: []
    }
  ]

  return traductions;
}

export const getTranslationPageData = async (
  dispositif: GetDispositifResponse,
  queryLanguage: string,
  token: string,
  user: GetUserInfoResponse | null
) => {
  let traductions: GetTraductionsForReviewResponse = await API.getTraductionsForReview(
    {
      dispositif: dispositif._id.toString() || "",
      language: queryLanguage || "",
    },
    { token },
  );

  // if dispositif is already translated, build an object from original text to be able to edit it
  if (traductions.length === 0 && dispositif.availableLanguages.includes(queryLanguage)) {
    const translatedDispositif = await API.getDispositif(dispositif._id.toString(), queryLanguage, { token });
    traductions = buildTranslationsObject(translatedDispositif, user);
  }

  const defaultTraduction = await API.getDefaultTraductionForDispositif(
    {
      dispositif: dispositif._id.toString() || "",
    },
    { token },
  ).then((data) => data.translation);

  return {
    traductions, defaultTraduction
  }
}
