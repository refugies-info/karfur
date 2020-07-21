import Cookies from "js-cookie";
import ReactGA from "react-ga";

import API from "../utils/API";
import { logger } from "../logger";

// checks dataLayer[] to be available and pushes data to it
const pushtoDataLayer = (data) => {
  (window.dataLayer = window.dataLayer || []).push(data);
};
// dispatch() will decide whether to push directly into the DL
// or enhance with API-provided data first
export const dispatch = (data) => {
  data.cookie = Cookies.get("_ga");
  API.log_event(data).then(
    function (data) {
      pushtoDataLayer(data);
    },
    function (error) {
      // eslint-disable-next-line no-console
      console.log(error);
      return;
    }
  );
};

export const initGA = () => {
  if (process.env.REACT_APP_ENV !== "production") {
    return;
  }
  const trackingId = process.env.REACT_APP_GOOGLE_ANALYTICS;
  ReactGA.initialize(trackingId);
};

export const PageView = () => {
  if (process.env.REACT_APP_ENV !== "production") {
    return;
  }
  ReactGA.pageview(window.location.pathname + window.location.search);
};

/**
 * Event - Add custom tracking event.
 * @param {string} category
 * @param {string} action
 * @param {string} label
 */
export const Event = (category, action, label) => {
  if (process.env.REACT_APP_ENV !== "production") {
    logger.info("Event", { category, action, label });
    return;
  }
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};
