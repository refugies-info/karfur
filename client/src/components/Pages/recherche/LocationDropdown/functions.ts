export const getPlaceName = (prediction: google.maps.places.AutocompletePrediction): string => {
  const placeName = prediction.terms[0]?.value;
  if (placeName) {
    if (prediction.types.includes("locality")) {
      return `${placeName} (ville)`;
    }
    if (prediction.types.includes("administrative_area_level_2")) {
      return `${placeName} (département)`;
    }
    if (prediction.types.includes("postal_code")) {
      return `${placeName} ${prediction.terms[1]?.value || ""} (ville)`;
    }
  }
  return prediction.description
}
