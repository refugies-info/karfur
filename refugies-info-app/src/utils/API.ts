import axios from "react-native-axios";
import { getEnvironment } from "../libs/getEnvironment";

const dbURL = getEnvironment().dbUrl;
const siteSecret = getEnvironment().siteSecret;

const apiCaller = axios.create({
  baseURL: dbURL,
  headers: {
    "Content-Type": "application/json",
    "site-secret": siteSecret,
  },
});

export const getLanguages = () => apiCaller.get("/langues/getLanguages");

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
    `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${latitude},${longitude}&radius=1500&language=fr&type=locality&key=${process.env.GOOGLE_API_KEY}`
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

export const get_dispositif = (params = {}) =>
  apiCaller.post("/dispositifs/get_dispositif", params);
