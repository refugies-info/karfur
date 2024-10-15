import { useRouter } from "next/router";
import { useMemo } from "react";

const SEARCH_EVENT_NAME = "USE_SEARCH";
const HOME_SEARCH_EVENT_NAME = "USE_SEARCH_HOME";

const useSearchEventName = () => {
  const router = useRouter();
  const eventName = useMemo(
    () => (router.pathname === "/" ? HOME_SEARCH_EVENT_NAME : SEARCH_EVENT_NAME),
    [router.pathname],
  );
  return eventName;
};

export default useSearchEventName;
