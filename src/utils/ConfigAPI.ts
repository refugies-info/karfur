import axios from "react-native-axios";
import Config from "../libs/getEnvironment";

const dbURL = Config.dbUrl;
const siteSecret = Config.siteSecret;
export const apiCaller = axios.create({
  baseURL: dbURL,
  headers: {
    "Content-Type": "application/json",
    "site-secret": siteSecret,
  },
});