import { RefObject, useEffect } from "react";

/**
 * Hook to ensure all links with the rtri-link class open in a new tab
 * @param containerRef Optional reference to the container element to scope the event delegation
 */
export const useRtriLinks = (containerRef?: RefObject<HTMLElement | null>) => {
  useEffect(() => {
    const handleLinkEvent = (event: MouseEvent) => {
      // Ensure target is an Element before using closest
      if (!(event.target instanceof Element)) return;

      const link = event.target.closest("a.rtri-link");

      if (link && !link.getAttribute("target")) {
        link.setAttribute("target", "_blank");
        link.setAttribute("rel", "noopener noreferrer");
      }
    };

    // If a container ref is provided, attach the listener to that container
    // Otherwise, attach it to the document body
    const container = containerRef?.current || document.body;

    // Handle both left-clicks and middle-clicks
    container.addEventListener("click", handleLinkEvent);
    container.addEventListener("auxclick", handleLinkEvent); // For middle-clicks

    return () => {
      container.removeEventListener("click", handleLinkEvent);
      container.removeEventListener("auxclick", handleLinkEvent);
    };
  }, [containerRef]);
};
