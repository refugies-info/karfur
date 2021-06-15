import axios from "react-native-axios";
import { getEnvironment } from "../libs/getEnvironment";

const dbURL = getEnvironment().dbUrl;

const apiCaller = axios.create({
  baseURL: dbURL,
  headers: {
    "Content-Type": "application/json",
  },
});

export const getLanguages = () => apiCaller.get("/langues/getLanguages");

export const getCitiesFromGoogleAPI = (text: string) =>
  apiCaller.post(
    `https://maps.googleapis.com/maps/api/place/autocomplete/json?input=${text}&language=fr&types=(cities)&components=country:fr&key=${process.env.GOOGLE_API_KEY}`
  );
