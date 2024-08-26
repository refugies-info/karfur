import isInBrowser from "@/lib/isInBrowser";
import { createBrowserHistory } from "history";

const history = isInBrowser() ? createBrowserHistory() : undefined;

export default history;
