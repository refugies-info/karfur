/**
 * Summarizes selected locations for display in the search bar, e.g. "Rennes, Lyon, +1"
 * when more than 2 are selected.
 */
export const summarizeLocations = (locations: string[]): string => {
  if (locations.length <= 2) return locations.join(", ");
  return `${locations.slice(0, 2).join(", ")}, +${locations.length - 2}`;
};
