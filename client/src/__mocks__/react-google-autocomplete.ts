/*** Mock Google Maps JavaScript API ***/
export const setupGoogleMock = () => {
  const google = {
    maps: {
      places: {
        AutocompleteService: class { },
        PlacesService: class { },
        PlacesServiceStatus: {
          INVALID_REQUEST: "INVALID_REQUEST",
          NOT_FOUND: "NOT_FOUND",
          OK: "OK",
          OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
          REQUEST_DENIED: "REQUEST_DENIED",
          UNKNOWN_ERROR: "UNKNOWN_ERROR",
          ZERO_RESULTS: "ZERO_RESULTS"
        }
      },
      Geocoder: () => { },
      GeocoderStatus: {
        ERROR: "ERROR",
        INVALID_REQUEST: "INVALID_REQUEST",
        OK: "OK",
        OVER_QUERY_LIMIT: "OVER_QUERY_LIMIT",
        REQUEST_DENIED: "REQUEST_DENIED",
        UNKNOWN_ERROR: "UNKNOWN_ERROR",
        ZERO_RESULTS: "ZERO_RESULTS"
      }
    }
  };
  global.window.google = google;
};
