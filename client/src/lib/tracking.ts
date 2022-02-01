import ReactGA from "react-ga";
import { logger } from "logger";

export const initGA = () => {
  if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
    return;
  }
  const trackingId = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_ANALYTICS;
  if (trackingId) ReactGA.initialize(trackingId);
};

export const PageView = () => {
  if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
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
export const Event = (category: string, action: string, label: string) => {
  if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
    logger.info("Event", { category, action, label });
    return;
  }
  ReactGA.event({
    category: category,
    action: action,
    label: label,
  });
};
