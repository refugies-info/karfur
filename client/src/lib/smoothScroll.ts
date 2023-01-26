import React from "react";

export const smoothScroll: React.MouseEventHandler<HTMLAnchorElement> = (e) => {
  e.preventDefault();

  const href = (e.target as HTMLElement).closest("a[href]")?.getAttribute("href");
  const anchor = href?.split("#")[1];
  if (anchor) {
    document.getElementById(anchor)?.scrollIntoView({
      behavior: "smooth"
    });
    window.location.href = "#" + anchor;
  }
}
