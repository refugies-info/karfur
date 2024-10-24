import {
  AppUserRequest,
  GetContentsForAppRequest,
  GetContentsForAppResponse,
  GetDispositifResponse,
  GetLanguagesResponse,
  GetNbContentsForCountyResponse,
  GetNeedResponse,
  GetThemeResponse,
  Languages,
  MarkAsSeenRequest,
  PostAppUserResponse,
  TtsRequest,
  ViewsType,
} from "@refugies-info/api-types";
import Constants from "expo-constants";
import ReactNativeBlobUtil from "react-native-blob-util";

import { makeApiRequest, ResponseWith } from "~/hooks/useApi";
import { logger } from "~/logger";
import { apiCaller, dbURL, headers } from "./ConfigAPI";

export const getLanguages = (): Promise<GetLanguagesResponse[]> =>
  makeApiRequest<null, ResponseWith<GetLanguagesResponse[]>>("/langues/getLanguages", null).then(
    (response) => response.data,
  );

export const getNeeds = () =>
  makeApiRequest<null, ResponseWith<GetNeedResponse[]>>("/needs", null).then((response) => response.data);

export const getThemes = () =>
  makeApiRequest<null, ResponseWith<GetThemeResponse[]>>("/themes", null).then((response) => response.data);

export const getCitiesFromGoogleAPI = (text: string) =>
  apiCaller.post(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&language=fr&types=(cities)&components=country:fr&key=${process.env.GOOGLE_API_KEY}`,
  );

export const getCityDetailsFromGoogleAPI = (placeId: string) =>
  apiCaller.post(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component&key=${process.env.GOOGLE_API_KEY}`,
  );

export const getPlaceIdFromLocationFromGoogleAPI = (longitude: number, latitude: number) =>
  apiCaller.post(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_API_KEY}`,
  );

export const getContentsForApp = (req: GetContentsForAppRequest): Promise<GetContentsForAppResponse> =>
  makeApiRequest<GetContentsForAppRequest, ResponseWith<GetContentsForAppResponse>>(
    "/dispositifs/getContentsForApp",
    req,
    "GET",
  ).then((response) => response.data);

export const getNbContents = (req: GetContentsForAppRequest): Promise<GetNbContentsForCountyResponse> =>
  makeApiRequest<GetContentsForAppRequest, ResponseWith<GetNbContentsForCountyResponse>>(
    "/dispositifs/getNbContentsForCounty",
    req,
    "GET",
  ).then((response) => response.data);

type GetContentByIdRequest = any;
export const getContentById = ({
  locale,
  contentId,
}: {
  locale: Languages;
  contentId: string;
}): Promise<GetDispositifResponse> =>
  makeApiRequest<GetContentByIdRequest, ResponseWith<GetDispositifResponse>>(
    `/dispositifs/${contentId}?locale=${locale}`,
    {},
    "GET",
  ).then((response) => response.data);

// FIXME Return type
export const updateNbVuesOrFavoritesOnContent = (contentId: string, type: ViewsType) =>
  makeApiRequest(`/dispositifs/${contentId}/views`, { types: [type] }, "POST");

export const addMerci = (contentId: string) => makeApiRequest(`/dispositifs/${contentId}/merci`, {}, "PUT");

export const deleteMerci = (contentId: string) => makeApiRequest(`/dispositifs/${contentId}/merci`, {}, "DELETE");

// FIXME Return type
// export const addNeedView = (id: string) => apiCaller.post("/needs/views", id);
export const addNeedView = (id: string) => makeApiRequest(`/needs/${id}/views`, {}, "POST");

export const updateAppUser = async (user: AppUserRequest) =>
  makeApiRequest<AppUserRequest, ResponseWith<PostAppUserResponse>>("/appuser/", user, "POST");

// FIXME Return type
export const markNotificationAsSeen = async (request: MarkAsSeenRequest) =>
  makeApiRequest<MarkAsSeenRequest, any>("/notifications/seen", request, "POST");

export const retrieveTechnicalInfo = () =>
  makeApiRequest(
    "/technical-info",
    {
      appVersion: Constants.expoConfig?.extra?.displayVersionNumber,
    },
    "POST",
  );

/**
 * Fetch file as a blob, cache it and return the file path
 * @param request
 * @returns file path
 */
export const fetchAudio = async (request: TtsRequest): Promise<string> => {
  const response = await ReactNativeBlobUtil.config({
    fileCache: true, // add this option that makes response data to be stored as a file,
    appendExt: "mp3",
  }).fetch("POST", `${dbURL}/tts`, headers, JSON.stringify(request));
  const { status } = response.respInfo;
  if (status !== 200) {
    logger.error(`fetchAudio error ${status}`, {});
    throw new Error(`FetchAudio error: ${status}`);
  }
  return response.path();
};
