import axios from "axios";

export const apiCaller = axios.create({
  baseURL: "https://data.geopf.fr/geocodage",
});

export const getCitiesFromGeoAPI = (text: string) =>
  apiCaller.get(`/search?q=${encodeURIComponent(text)}&type=municipality`);

export const getPlaceFromLocationFromGeoAPI = (longitude: number, latitude: number) =>
  apiCaller.get(`/reverse?lon=${longitude}&lat=${latitude}`);
