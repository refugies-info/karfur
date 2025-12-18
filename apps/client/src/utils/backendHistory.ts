import { isInBrowser } from "@refugies-info/ui";
import { createBrowserHistory } from "history";

const history = isInBrowser() ? createBrowserHistory() : undefined;

export default history;
