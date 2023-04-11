import Constants from "expo-constants";
import {
  AppUserRequest,
  GetContentsForAppRequest,
  GetContentsForAppResponse,
  GetDispositifResponse,
  GetNbContentsForCountyRequest,
  GetNbContentsForCountyResponse,
  GetThemeResponse,
  Languages,
  MarkAsSeenRequest,
  PostAppUserResponse,
  ViewsType,
} from "@refugies-info/api-types";

import { makeApiRequest, ResponseWith } from "../hooks/useApi";
import { apiCaller } from "./ConfigAPI";

// FIXME Return type
export const getLanguages = () => apiCaller.get("/langues/getLanguages");

// FIXME Return type
export const getNeeds = () => apiCaller.get("/needs");

export const getThemes = (): Promise<GetThemeResponse[]> =>
  makeApiRequest<null, ResponseWith<GetThemeResponse[]>>("/themes", null).then(
    (response) => response.data
  );

export const getCitiesFromGoogleAPI = (text: string) =>
  apiCaller.post(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&language=fr&types=(cities)&components=country:fr&key=${process.env.GOOGLE_API_KEY}`
  );

export const getCityDetailsFromGoogleAPI = (placeId: string) =>
  apiCaller.post(
    `https://maps.googleapis.com/maps/api/place/details/json?place_id=${placeId}&fields=address_component&key=${process.env.GOOGLE_API_KEY}`
  );

export const getPlaceIdFromLocationFromGoogleAPI = (
  longitude: number,
  latitude: number
) =>
  apiCaller.post(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${process.env.GOOGLE_API_KEY}`
  );

export const getContentsForApp = (
  req: GetContentsForAppRequest
): Promise<GetContentsForAppResponse> =>
  makeApiRequest<
    GetContentsForAppRequest,
    ResponseWith<GetContentsForAppResponse>
  >("/dispositifs/getContentsForApp", req, "GET").then(
    (response) => response.data
  );

export const getNbContents = (
  req: GetNbContentsForCountyRequest
): Promise<GetNbContentsForCountyResponse> => {
  const route = `/dispositifs/getNbContents?county=${req.county}`;
  return makeApiRequest<
    GetNbContentsForCountyRequest,
    ResponseWith<GetNbContentsForCountyResponse>
  >(route, req, "GET").then((response) => response.data);
};

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
    "GET"
  ).then((response) => response.data);

// FIXME Return type
export const updateNbVuesOrFavoritesOnContent = (
  contentId: string,
  type: ViewsType
) =>
  makeApiRequest(`/dispositifs/${contentId}/views`, { types: [type] }, "POST");

export const addMerci = (contentId: string) =>
  makeApiRequest(`/dispositifs/${contentId}/merci`, {}, "PUT");

export const deleteMerci = (contentId: string) =>
  makeApiRequest(`/dispositifs/${contentId}/merci`, {}, "DELETE");

// FIXME Return type
// export const addNeedView = (id: string) => apiCaller.post("/needs/views", id);
export const addNeedView = (id: string) =>
  makeApiRequest(`/needs/${id}/views`, null, "POST");

export const updateAppUser = async (user: AppUserRequest) =>
  makeApiRequest<AppUserRequest, ResponseWith<PostAppUserResponse>>(
    "/appuser/",
    user,
    "POST"
  );

// FIXME Return type
export const markNotificationAsSeen = async (request: MarkAsSeenRequest) =>
  makeApiRequest<MarkAsSeenRequest, any>(
    "/notifications/seen",
    request,
    "POST"
  );

export const retrieveTechnicalInfo = () =>
  makeApiRequest(
    "/technical-info",
    {
      appVersion: Constants.expoConfig?.extra?.displayVersionNumber,
    },
    "POST"
  );
