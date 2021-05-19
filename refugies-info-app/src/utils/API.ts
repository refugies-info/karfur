import axios from "react-native-axios";
import { getEnvironment } from "../libs/getEnvironment";

const dbURL = getEnvironment().dbUrl;

export const getLanguages = () => axios.get(dbURL + "/langues/getLanguages");
