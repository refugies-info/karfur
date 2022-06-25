import axios from "react-native-axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

import Config from "../libs/getEnvironment";
import { ObjectId, AppUser } from "../types/interface";
import { logger } from "../logger";

const dbURL = Config.dbUrl;
const siteSecret = Config.siteSecret;
const apiCaller = axios.create({
  baseURL: dbURL,
  headers: {
    "Content-Type": "application/json",
    "site-secret": siteSecret,
  },
});

export const getLanguages = () => apiCaller.get("/langues/getLanguages");

export const getNeeds = () => apiCaller.get("/needs/getNeeds");

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

export const getContentsForApp = ({
  locale,
  age,
  department,
  frenchLevel,
}: {
  locale: string;
  age: string | null;
  department: string | null;
  frenchLevel: string | null;
}) => {
  const route =
    `/dispositifs/getContentsForApp?locale=${locale}` +
    (age ? `&age=${age}` : "") +
    (department ? `&department=${department}` : "") +
    (frenchLevel ? `&frenchLevel=${frenchLevel}` : "");

  return apiCaller.get(route);
};

export const getNbContents = ({
  department,
}: {
  department: string | null;
}) => {
  const route = `/dispositifs/getNbContents?department=${department}`;
  return apiCaller.get(route);
};

export const getContentById = ({
  locale,
  contentId,
}: {
  locale: string;
  contentId: ObjectId;
}) => {
  const route = `/dispositifs/getContentById?locale=${locale}&contentId=${contentId}`;

  return apiCaller.get(route);
};

export const updateNbVuesOrFavoritesOnContent = (
  params:
    | { query: { id: ObjectId; nbVuesMobile: number } }
    | { query: { id: ObjectId; nbFavoritesMobile: number } }
) => apiCaller.post("/dispositifs/updateNbVuesOrFavoritesOnContent", params);

export const updateAppUser = async (payload: AppUser) => {
  const uid = await AsyncStorage.getItem("uid");

  if (!uid) {
    logger.error("[updateAppUser]: uid not found in async storage");
  }

  apiCaller.post("/appuser/", {
    ...payload,
    uid,
  });
};
