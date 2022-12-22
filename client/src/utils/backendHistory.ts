import { createBrowserHistory } from "history";
import isInBrowser from "lib/isInBrowser";

const history = isInBrowser() ? createBrowserHistory() : undefined;

export default history;
