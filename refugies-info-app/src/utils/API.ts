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
