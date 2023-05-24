import { InfoSection } from "@refugies-info/api-types";
import { getSectionReadableText } from "lib/getReadableText";

export const getPlayIcon = (isPlaying: boolean, isOpen: boolean) => {
  if (!isPlaying && !isOpen) return "ri-play-circle-line";
  return isPlaying ? "ri-pause-circle-fill" : "ri-play-circle-fill";
}

export const getReadableText = (content: InfoSection | string): string => {
  if (typeof content === "string") return getReadableText(content);
  return getSectionReadableText(content);
}
