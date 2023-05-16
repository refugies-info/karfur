import ReactGA from "react-ga4";
import { logger } from "logger";

/**
 * Inits GA. Must be fired once only
 */
export const initGA = () => {
  // if (process.env.NEXT_PUBLIC_REACT_APP_ENV === "production") {
  const trackingId = process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_ANALYTICS;
  if (trackingId) ReactGA.initialize(trackingId);
  // }
};

/**
 * Adds a page view in analytics. Not needed in GA4
 */
// export const PageView = () => {
//   const url = window.location.pathname + window.location.search;
//   if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
//     logger.info("PageView", url);
//     return;
//   }
//   ReactGA.pageview(url);
// };

/**
 * Event - Add custom tracking event.
 * @param {string} category
 * @param {string} action
 * @param {string} label
 */
export const Event = (category: string, action: string, label: string) => {
  if (process.env.NEXT_PUBLIC_REACT_APP_ENV !== "production") {
    logger.info("Event", { category, action, label });
    // return;
  }
  ReactGA.event({
    category,
    action,
    label,
  });
};
