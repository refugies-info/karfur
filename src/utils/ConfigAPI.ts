import axios from "react-native-axios";
import Config from "../libs/getEnvironment";

export const dbURL = Config.dbUrl;
export const headers = {
  "Content-Type": "application/json",
  "site-secret": Config.siteSecret || "",
};
export const apiCaller = axios.create({
  baseURL: dbURL,
  headers,
});