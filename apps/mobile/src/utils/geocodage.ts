import axios from "axios";

export const apiCaller = axios.create({
  baseURL: "https://data.geopf.fr",
});

export const getCitiesFromGeoAPI = (text: string) => apiCaller.get(`/geocodage/search?q=${text}&type=municipality`);

export const getPlaceFromLocationFromGeoAPI = (longitude: number, latitude: number) =>
  apiCaller.get(`/geocodage/reverse?lon=${longitude}&lat=${latitude}`);
