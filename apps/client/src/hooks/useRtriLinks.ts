import { RefObject, useEffect } from "react";

/**
 * Hook to ensure all links with the rtri-link class open in a new tab
 * @param containerRef Optional reference to the container element to scope the event delegation
 */
export const useRtriLinks = (containerRef?: RefObject<HTMLElement>) => {
  useEffect(() => {
    const handleClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      const link = target.closest("a.rtri-link");

      if (link && !link.getAttribute("target")) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    };

    // If a container ref is provided, attach the listener to that container
    // Otherwise, attach it to the document body
    const container = containerRef?.current || document.body;

    // Use event delegation to handle all link clicks
    container.addEventListener("click", handleClick);

    return () => {
      container.removeEventListener("click", handleClick);
    };
  }, [containerRef]);
};
