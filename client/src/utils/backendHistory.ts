import { createBrowserHistory } from "history";
import isInBrowser from "lib/isInBrowser";

export default isInBrowser() ? createBrowserHistory() : undefined;
