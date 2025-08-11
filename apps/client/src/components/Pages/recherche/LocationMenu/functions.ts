export const getPlaceName = (feature: any): string => {
  const { properties } = feature;
  const placeName = properties.name;
  if (placeName) {
    if (properties.type === "municipality") {
      return `${placeName} (ville)`;
    }
    if (properties.type === "administrativearea") {
      return `${placeName} (département)`;
    }
  }
  return properties.label;
};
