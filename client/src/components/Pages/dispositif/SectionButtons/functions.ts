export const getPlayIcon = (isPlaying: boolean, isOpen: boolean) => {
  if (!isPlaying && !isOpen) return "ri-play-circle-line";
  return isPlaying ? "ri-pause-circle-fill" : "ri-play-circle-fill";
}
