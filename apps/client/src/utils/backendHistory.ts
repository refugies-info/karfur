import { createBrowserHistory } from "history";
import { isInBrowser } from "@refugies-info/ui";

const history = isInBrowser() ? createBrowserHistory() : undefined;

export default history;
