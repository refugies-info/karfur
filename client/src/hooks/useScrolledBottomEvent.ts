import { useCallback, useEffect, useState } from "react";
import throttle from "lodash/throttle";
import { Event } from "lib/tracking";

/**
 * Send an analytics event when the page is scrolled to the bottom
 * @param sendEvent true if it should send an event, false otherwise
 */
const useScrolledBottomEvent = (sendEvent: boolean) => {
  const [isBottom, setIsBottom] = useState(false);
  const [eventSent, setEventSent] = useState(false);

  const handleScroll = useCallback(() => {
    const footer = document.getElementById("footer");
    const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
    const scroll = scrollTop + (clientHeight + (footer?.clientHeight || 0));
    if (scroll >= scrollHeight) {
      setIsBottom(true);
    } else {
      setIsBottom(false);
    }
  }, []);

  useEffect(() => {
    const onScroll = throttle(() => window.requestAnimationFrame(handleScroll), 300);
    document.addEventListener("scroll", onScroll);
    return () => document.removeEventListener("scroll", onScroll);
  }, [handleScroll]);

  useEffect(() => {
    if (isBottom && !eventSent) {
      setEventSent(true);
      if (sendEvent) Event("SCROLL", "scrolled bottom", "Dispo View");
    }
  }, [isBottom, eventSent, sendEvent])
};

export default useScrolledBottomEvent;
