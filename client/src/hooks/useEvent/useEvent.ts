import useConsentContext, { Consents } from "hooks/useConsentContext";
import { Event } from "lib/tracking";
import { logger } from "logger";

/**
 * This hook expose Event function for all domain events
 *
 * The hook route events to trackings services if there are enabled.
 */
const useEvent = () => {
  const { isAccepted } = useConsentContext();
  const _Event = (category: string, action: string, label: string) => {
    if (isAccepted(Consents.GOOGLE_ANALYTICS)) {
      Event(category, action, label);
    } else {
      logger.warn("Event not send - cookie refused:", { category, action, label });
    }
  };
  return { Event: _Event };
};

export default useEvent;